import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
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
