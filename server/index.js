import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/stripe') {
    next()
    return
  }

  express.json()(req, res, next)
})
app.use(express.urlencoded({ extended: true }))

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder-key'
)

const catVideoJobs = new Map()
const catVideoQueue = []
const activeCatVideoWorkers = new Set()

const rateLimitBuckets = new Map()

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return req.ip
}

function rateLimit({ keyPrefix, windowMs, max }) {
  return (req, res, next) => {
    const now = Date.now()
    const ip = getClientIp(req) || 'unknown'
    const key = `${keyPrefix}:${ip}`
    const current = rateLimitBuckets.get(key)
    if (!current || current.resetAt <= now) {
      rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs })
      next()
      return
    }

    if (current.count >= max) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
      })
      return
    }

    current.count += 1
    next()
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeHex(hex) {
  if (typeof hex !== 'string') return ''
  const trimmed = hex.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return withHash.toUpperCase()
}

function isValidHex(hex) {
  return /^#[0-9A-F]{6}$/.test(hex)
}

function sanitizeText(value, maxLen) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!Number.isFinite(maxLen)) return trimmed
  return trimmed.slice(0, maxLen)
}

async function anthropicDraftPrompt(input) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest'
  if (!apiKey) {
    throw new Error('Missing LLM API key. Set ANTHROPIC_API_KEY (or LLM_API_KEY) on the server.')
  }

  const system = [
    'You are a creative director. Turn the structured product inputs into ONE vivid, shot-by-shot video prompt for an AI video model.',
    'The hero is a friendly, expressive cat marketing the product.',
    "Weave in the product's name, key benefit, and brand colors as on-screen palette/mood.",
    'Honor the requested tone, aspect ratio, and duration.',
    'Describe camera movement, lighting, and a clear product "hero moment."',
    'Output only JSON: { "prompt": string, "negativePrompt": string }.',
  ].join(' ')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0.7,
      system,
      messages: [{ role: 'user', content: JSON.stringify(input) }],
    }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const msg = data?.error?.message || data?.message || 'LLM request failed.'
    throw new Error(msg)
  }

  const text = Array.isArray(data?.content) ? data.content.map((c) => c?.text).filter(Boolean).join('\n') : ''
  const trimmed = typeof text === 'string' ? text.trim() : ''

  const extractJson = (value) => {
    const start = value.indexOf('{')
    const end = value.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null
    const slice = value.slice(start, end + 1)
    try {
      return JSON.parse(slice)
    } catch {
      return null
    }
  }

  let parsed = null
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    parsed = extractJson(trimmed)
  }

  const prompt = sanitizeText(parsed?.prompt, 5000)
  const negativePrompt = sanitizeText(parsed?.negativePrompt, 2000)

  if (!prompt) throw new Error('LLM did not return a valid { prompt, negativePrompt } payload.')

  return { prompt, negativePrompt }
}

async function pixverseFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const apiKey = process.env.PIXVERSE_API_KEY
  if (!apiKey) throw new Error('Missing PIXVERSE_API_KEY on the server.')

  const response = await fetch(`https://app-api.pixverse.ai/openapi/v2${path}`, {
    method,
    headers: {
      'API-KEY': apiKey,
      'Ai-trace-id': uuidv4(),
      ...headers,
    },
    body,
  })

  const json = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(json?.ErrMsg || `PixVerse request failed (${response.status}).`)
  }
  if (json?.ErrCode !== 0) {
    throw new Error(json?.ErrMsg || 'PixVerse request failed.')
  }
  return json?.Resp
}

async function pixverseUploadImage(file) {
  const formData = new FormData()
  const blob = new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' })
  formData.append('image', blob, file.originalname || 'image')
  const resp = await pixverseFetch('/image/upload', { method: 'POST', body: formData })
  return resp?.img_id
}

async function pixverseGenerateTextVideo({ prompt, negativePrompt, aspectRatio, duration, model, quality }) {
  const resp = await pixverseFetch('/video/text/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      aspect_ratio: aspectRatio,
      duration,
      model,
      prompt,
      negative_prompt: negativePrompt || '',
      quality,
      seed: Math.floor(Math.random() * 2147483647),
    }),
  })
  return resp?.video_id
}

async function pixverseGenerateImageVideo({ imgId, prompt, negativePrompt, duration, model, quality }) {
  const resp = await pixverseFetch('/video/img/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      img_id: imgId,
      duration,
      model,
      prompt,
      negative_prompt: negativePrompt || '',
      quality,
      seed: Math.floor(Math.random() * 2147483647),
    }),
  })
  return resp?.video_id
}

async function pixverseGetVideoResult(videoId) {
  return pixverseFetch(`/video/result/${videoId}`, { method: 'GET' })
}

function setCatJob(jobId, patch) {
  const current = catVideoJobs.get(jobId)
  if (!current) return null
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() }
  catVideoJobs.set(jobId, next)
  return next
}

async function runCatVideoWorker(jobId) {
  if (activeCatVideoWorkers.has(jobId)) return
  activeCatVideoWorkers.add(jobId)

  try {
    const job = catVideoJobs.get(jobId)
    if (!job) return

    setCatJob(jobId, { status: 'drafting_prompt', stage: 'drafting_prompt', message: 'Drafting your prompt…' })
    const { prompt, negativePrompt } = await anthropicDraftPrompt(job.input)
    setCatJob(jobId, { prompt, negativePrompt })

    let imgId = null
    if (job.productImage) {
      setCatJob(jobId, { status: 'uploading_assets', stage: 'uploading_assets', message: 'Uploading your product image…' })
      imgId = await pixverseUploadImage(job.productImage)
      setCatJob(jobId, { productImage: null })
    }

    setCatJob(jobId, { status: 'generating', stage: 'generating', message: 'Generating video (this can take a few minutes)…' })
    const model = 'v6'
    const quality = '720p'

    const videoId = imgId
      ? await pixverseGenerateImageVideo({
          imgId,
          prompt,
          negativePrompt,
          duration: job.input.duration,
          model,
          quality,
        })
      : await pixverseGenerateTextVideo({
          prompt,
          negativePrompt,
          aspectRatio: job.input.aspectRatio,
          duration: job.input.duration,
          model,
          quality,
        })

    if (!videoId && videoId !== 0) throw new Error('PixVerse did not return a video_id.')
    setCatJob(jobId, { pixverseVideoId: videoId })

    const startedAt = Date.now()
    const timeoutMs = 6 * 60 * 1000

    while (Date.now() - startedAt < timeoutMs) {
      const result = await pixverseGetVideoResult(videoId)
      const status = result?.status

      if (status === 1 && result?.url) {
        setCatJob(jobId, { status: 'done', stage: 'done', message: 'Ready!', videoUrl: result.url })
        return
      }

      if (status === 7) {
        throw new Error('PixVerse moderation blocked this request. Try adjusting the tone or product wording.')
      }

      if (status === 8) {
        throw new Error('PixVerse generation failed. Try again with different inputs.')
      }

      const waitMs = 3000 + Math.floor(Math.random() * 2000)
      await sleep(waitMs)
    }

    throw new Error('Timed out while waiting for PixVerse to finish. Please try again.')
  } catch (error) {
    setCatJob(jobId, {
      status: 'error',
      stage: 'error',
      message: 'Generation failed.',
      error: error?.message || 'Something went wrong.',
    })
  } finally {
    activeCatVideoWorkers.delete(jobId)
    startNextCatVideoJobs()
  }
}

function startNextCatVideoJobs() {
  const maxWorkers = 2
  while (activeCatVideoWorkers.size < maxWorkers && catVideoQueue.length > 0) {
    const nextJobId = catVideoQueue.shift()
    if (!nextJobId) continue
    runCatVideoWorker(nextJobId)
  }
}

setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000
  for (const [id, job] of catVideoJobs.entries()) {
    const updatedAt = Date.parse(job.updatedAt || job.createdAt || '')
    if (Number.isFinite(updatedAt) && updatedAt < cutoff) catVideoJobs.delete(id)
  }
}, 10 * 60 * 1000)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 2,
  },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
    cb(ok ? null : new Error('Unsupported file type.'), ok)
  },
})

app.post(
  '/api/cat-video',
  rateLimit({ keyPrefix: 'cat-video', windowMs: 60 * 1000, max: 6 }),
  upload.fields([
    { name: 'brandLogo', maxCount: 1 },
    { name: 'productImages', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files || {}
      const brandLogo = Array.isArray(files.brandLogo) ? files.brandLogo[0] : null
      const productImages = Array.isArray(files.productImages) ? files.productImages : []

      const productName = sanitizeText(req.body.productName, 120)
      const oneLineDescription = sanitizeText(req.body.oneLineDescription, 240)
      const keyBenefit = sanitizeText(req.body.keyBenefit, 240)
      const targetAudience = sanitizeText(req.body.targetAudience, 240)
      const callToAction = sanitizeText(req.body.callToAction, 240)
      const tonePreset = sanitizeText(req.body.tonePreset, 40)
      const toneText = sanitizeText(req.body.toneText, 400)
      const aspectRatio = sanitizeText(req.body.aspectRatio, 20)
      const duration = Number.parseInt(req.body.duration, 10)

      let brandColors = []
      try {
        brandColors = JSON.parse(req.body.brandColors || '[]')
      } catch {
        brandColors = []
      }
      brandColors = Array.isArray(brandColors) ? brandColors.map(normalizeHex).filter(Boolean).slice(0, 3) : []

      const errors = []
      if (!brandLogo) errors.push('Brand logo is required.')
      if (!productName) errors.push('Product name is required.')
      if (!oneLineDescription) errors.push('One-line description is required.')
      if (!keyBenefit) errors.push('Key benefit is required.')
      if (!targetAudience) errors.push('Target audience is required.')
      if (!callToAction) errors.push('Call-to-action is required.')
      if (brandColors.length === 0) errors.push('At least one brand color is required.')
      if (brandColors.some((c) => !isValidHex(c))) errors.push('Brand colors must be valid hex values.')
      if (!['16:9', '9:16', '1:1'].includes(aspectRatio)) errors.push('Invalid aspect ratio.')
      if (![5, 8].includes(duration)) errors.push('Invalid duration.')
      if (productImages.length > 1) errors.push('Upload up to 1 product image.')

      if (errors.length > 0) {
        res.status(400).json({ success: false, error: errors[0] })
        return
      }

      const input = {
        productName,
        oneLineDescription,
        keyBenefit,
        targetAudience,
        callToAction,
        tonePreset,
        toneText,
        aspectRatio,
        duration,
        brandColors,
      }

      const jobId = uuidv4()
      const createdAt = new Date().toISOString()
      catVideoJobs.set(jobId, {
        id: jobId,
        status: 'queued',
        stage: 'queued',
        message: 'Queued…',
        createdAt,
        updatedAt: createdAt,
        input,
        productImage: productImages[0] || null,
      })

      catVideoQueue.push(jobId)
      startNextCatVideoJobs()

      const created = catVideoJobs.get(jobId)
      res.json({
        success: true,
        job: {
          id: created.id,
          status: created.status,
          stage: created.stage,
          message: created.message,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: error?.message || 'Failed to start generation.' })
    }
  }
)

app.get(
  '/api/cat-video/:id',
  rateLimit({ keyPrefix: 'cat-video-status', windowMs: 60 * 1000, max: 60 }),
  (req, res) => {
    const job = catVideoJobs.get(req.params.id)
    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found.' })
      return
    }

    res.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        stage: job.stage,
        message: job.message,
        videoUrl: job.videoUrl,
        error: job.error,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    })
  }
)

app.post('/api/payments/create-checkout-session', async (req, res) => {
  try {
    const { planId, plan, amount, customerInfo } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Neko ${plan} Plan`,
              description: `PixVerse-powered cat mascot video generation - ${plan} tier`,
              images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout/${planId}`,
      customer_email: customerInfo.contactEmail || customerInfo.email,
      metadata: {
        planId,
        plan,
        customerInfo: JSON.stringify(customerInfo),
      },
    })

    res.json({
      success: true,
      sessionId: session.id,
      orderId: `ORD-${Date.now()}`,
    })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/orders/create-preview', async (req, res) => {
  try {
    const previewId = `PREVIEW-${Date.now()}`
    const {
      brandName,
      productName,
      productCategory,
      mascotStyle,
      storyTemplate,
    } = req.body

    res.json({
      success: true,
      previewId,
      message: 'Preview created successfully',
      preview: {
        headline: `${brandName || 'Your brand'} x Neko`,
        concept: `A ${mascotStyle || 'playful'} cat mascot presents ${productName || 'your product'} in a ${storyTemplate || 'lifestyle'} format.`,
        category: productCategory || 'general',
      },
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params

    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single()

    if (error) throw error

    res.json({ success: true, order: data })
  } catch (error) {
    console.error('Fetch order error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/videos/generate', async (req, res) => {
  try {
    const {
      orderId,
      productName,
      brandName,
      productCategory,
    } = req.body

    const videoData = {
      id: `VID-${Date.now()}`,
      order_id: orderId || null,
      title: productName || 'Generated Ad',
      brand: brandName || 'Neko Demo Brand',
      category: productCategory || 'General',
      pixverse_url: `https://app.pixverse.ai/video/${uuidv4()}`,
      thumbnail_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
      duration: 35,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      status: 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('videos').insert([videoData])

    if (error) throw error

    res.json({
      success: true,
      videoId: videoData.id,
      message: 'Video generation started',
    })
  } catch (error) {
    console.error('Video generation error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/gallery', async (req, res) => {
  try {
    const { category, search, sort } = req.query

    let query = supabase.from('videos').select('*')

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    if (sort === 'popular') {
      query = query.order('likes', { ascending: false })
    } else if (sort === 'recent') {
      query = query.order('views', { ascending: false })
    } else if (sort === 'discussed') {
      query = query.order('comments', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error

    res.json({ success: true, videos: data })
  } catch (error) {
    console.error('Gallery fetch error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/videos/:videoId/like', async (req, res) => {
  try {
    const { videoId } = req.params

    const { data: existingVideo, error: fetchError } = await supabase
      .from('videos')
      .select('likes')
      .eq('id', videoId)
      .single()

    if (fetchError) throw fetchError

    const nextLikes = (existingVideo?.likes || 0) + 1

    const { data, error } = await supabase
      .from('videos')
      .update({ likes: nextLikes, updated_at: new Date().toISOString() })
      .eq('id', videoId)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, likes: data.likes })
  } catch (error) {
    console.error('Like error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/comments', async (req, res) => {
  try {
    const { videoId, userId, userName, text } = req.body

    const commentData = {
      id: uuidv4(),
      video_id: videoId,
      user_id: userId || null,
      user_name: userName || 'Guest',
      text,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('comments').insert([commentData])

    if (error) throw error

    res.json({ success: true, comment: commentData })
  } catch (error) {
    console.error('Comment error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/comments/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, comments: data })
  } catch (error) {
    console.error('Fetch comments error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Payment successful:', session.id)
        break
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
