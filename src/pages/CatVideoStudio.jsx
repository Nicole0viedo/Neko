import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cat, Download, RefreshCcw, Sparkles, Upload } from 'lucide-react'

const tonePresets = [
  { id: 'playful', name: 'Playful' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'energetic', name: 'Energetic' },
]

const aspectRatioOptions = [
  { id: '16:9', name: '16:9 (Landscape)' },
  { id: '9:16', name: '9:16 (Vertical)' },
  { id: '1:1', name: '1:1 (Square)' },
]

const durationOptions = [
  { id: 5, name: '5s' },
  { id: 8, name: '8s' },
]

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

function isValidHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

function clampBrandColors(colors) {
  const cleaned = (Array.isArray(colors) ? colors : []).map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean)
  const normalized = cleaned.map((c) => (c.startsWith('#') ? c : `#${c}`))
  return normalized.slice(0, 3)
}

function fileIssue(file, { maxBytes }) {
  if (!file) return null
  if (!allowedImageTypes.includes(file.type)) return 'Use a PNG, JPG, or WebP image.'
  if (typeof maxBytes === 'number' && file.size > maxBytes) return `File must be under ${Math.round(maxBytes / 1024 / 1024)}MB.`
  return null
}

export default function CatVideoStudio() {
  const [form, setForm] = useState({
    brandLogo: null,
    brandColors: ['#A78BFA', '#7DD3FC', '#FBCFE8'],
    productImages: [],
    productName: '',
    oneLineDescription: '',
    keyBenefit: '',
    targetAudience: '',
    callToAction: '',
    tonePreset: 'playful',
    toneText: '',
    aspectRatio: '16:9',
    duration: 5,
  })

  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [job, setJob] = useState(null)

  const formRef = useRef(null)
  const pollTimerRef = useRef(null)
  const videoPanelRef = useRef(null)
  const pollInFlightRef = useRef(false)

  const errors = useMemo(() => {
    const next = {}

    const logoError = fileIssue(form.brandLogo, { maxBytes: 5 * 1024 * 1024 })
    if (!form.brandLogo) next.brandLogo = 'Brand logo is required.'
    else if (logoError) next.brandLogo = logoError

    const colors = clampBrandColors(form.brandColors)
    if (colors.length === 0) next.brandColors = 'Add at least one brand color.'
    else if (colors.some((c) => !isValidHexColor(c))) next.brandColors = 'Use valid hex colors (e.g. #FF3366).'

    if (!form.productName.trim()) next.productName = 'Product name is required.'
    if (!form.oneLineDescription.trim()) next.oneLineDescription = 'One-line description is required.'
    if (!form.keyBenefit.trim()) next.keyBenefit = 'Key benefit is required.'
    if (!form.targetAudience.trim()) next.targetAudience = 'Target audience is required.'
    if (!form.callToAction.trim()) next.callToAction = 'Call-to-action is required.'

    if (!aspectRatioOptions.some((o) => o.id === form.aspectRatio)) next.aspectRatio = 'Choose an aspect ratio.'
    if (!durationOptions.some((o) => o.id === form.duration)) next.duration = 'Choose a duration.'

    if (form.productImages.length > 1) next.productImages = 'Upload up to 1 product image.'
    const productImageError = form.productImages.map((f) => fileIssue(f, { maxBytes: 10 * 1024 * 1024 })).find(Boolean)
    if (productImageError) next.productImages = productImageError

    return next
  }, [form])

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (job?.status !== 'done') return
    if (!job?.videoUrl) return
    videoPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [job?.status, job?.videoUrl])

  useEffect(() => {
    if (!job?.id) return undefined
    if (job.status === 'done' || job.status === 'error') return undefined
    if (pollTimerRef.current) return undefined

    pollTimerRef.current = window.setInterval(async () => {
      if (pollInFlightRef.current) return
      pollInFlightRef.current = true
      try {
        const response = await fetch(`/api/cat-video/${job.id}`)
        const data = await response.json()
        if (!response.ok || !data?.success) {
          throw new Error(data?.error || 'Failed to fetch job status.')
        }
        setJob(data.job)
        if (data.job?.status === 'done' || data.job?.status === 'error') {
          window.clearInterval(pollTimerRef.current)
          pollTimerRef.current = null
        }
      } catch (e) {
        setServerError(e?.message || 'Something went wrong while checking progress.')
        window.clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      } finally {
        pollInFlightRef.current = false
      }
    }, 2000)

    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
      pollInFlightRef.current = false
    }
  }, [job?.id, job?.status])

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }))

  const visibleError = (key) => {
    if (!touched[key]) return ''
    return errors[key] || ''
  }

  const setColorAt = (idx, value) => {
    setForm((prev) => {
      const next = [...prev.brandColors]
      next[idx] = value
      return { ...prev, brandColors: next }
    })
  }

  const addColor = () => {
    setForm((prev) => {
      if (prev.brandColors.length >= 3) return prev
      return { ...prev, brandColors: [...prev.brandColors, '#000000'] }
    })
  }

  const removeColor = (idx) => {
    setForm((prev) => {
      const next = prev.brandColors.filter((_, i) => i !== idx)
      return { ...prev, brandColors: next }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setTouched({
      brandLogo: true,
      brandColors: true,
      productImages: true,
      productName: true,
      oneLineDescription: true,
      keyBenefit: true,
      targetAudience: true,
      callToAction: true,
      aspectRatio: true,
      duration: true,
    })

    if (Object.keys(errors).length > 0) return

    const body = new FormData()
    body.append('productName', form.productName.trim())
    body.append('oneLineDescription', form.oneLineDescription.trim())
    body.append('keyBenefit', form.keyBenefit.trim())
    body.append('targetAudience', form.targetAudience.trim())
    body.append('callToAction', form.callToAction.trim())
    body.append('tonePreset', form.tonePreset)
    body.append('toneText', form.toneText.trim())
    body.append('aspectRatio', form.aspectRatio)
    body.append('duration', String(form.duration))
    body.append('brandColors', JSON.stringify(clampBrandColors(form.brandColors)))
    body.append('brandLogo', form.brandLogo)

    for (const img of form.productImages) body.append('productImages', img)

    setJob({ status: 'queued', stage: 'queued' })
    try {
      const response = await fetch('/api/cat-video', { method: 'POST', body })
      const data = await response.json()
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to start generation.')
      }
      setJob(data.job)
    } catch (error) {
      setJob(null)
      setServerError(error?.message || 'Something went wrong.')
    }
  }

  const handleRegenerate = async () => {
    setJob(null)
    setServerError('')
    const fakeEvent = { preventDefault: () => {} }
    await handleSubmit(fakeEvent)
  }

  const statusLabel = (jobStatus) => {
    if (!jobStatus) return ''
    if (jobStatus === 'queued') return 'Queued'
    if (jobStatus === 'drafting_prompt') return 'Drafting your prompt'
    if (jobStatus === 'uploading_assets') return 'Uploading assets'
    if (jobStatus === 'generating') return 'Generating video (this can take a few minutes)'
    if (jobStatus === 'done') return 'Done'
    if (jobStatus === 'error') return 'Error'
    return 'Working…'
  }

  const showForm = !job || job.status === 'error' || job.status === 'done'

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cat Video Studio</h1>
              <p className="mt-2 text-gray-600">
                Generate a polished cat-led marketing video from your product details and brand assets.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border">
              <Cat className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-gray-900">PixVerse-powered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Branding</h2>
                  <p className="mt-1 text-sm text-gray-600">Upload your logo and choose your brand colors.</p>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Logo <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${
                        visibleError('brandLogo') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Upload className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {form.brandLogo?.name || 'Choose an image'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, or WebP • up to 5MB</p>
                        </div>
                      </div>
                      <label className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 cursor-pointer">
                        Browse
                        <input
                          type="file"
                          accept={allowedImageTypes.join(',')}
                          className="sr-only"
                          onBlur={() => markTouched('brandLogo')}
                          onChange={(e) => setField('brandLogo', e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                    {visibleError('brandLogo') && (
                      <p className="mt-2 text-sm text-red-600">{visibleError('brandLogo')}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Brand Colors <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addColor}
                        className="text-sm font-medium text-primary hover:text-primary/80"
                        disabled={form.brandColors.length >= 3}
                      >
                        Add color
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {form.brandColors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="color"
                            value={isValidHexColor(color) ? color : '#000000'}
                            onBlur={() => markTouched('brandColors')}
                            onChange={(e) => setColorAt(idx, e.target.value)}
                            className="h-10 w-12 rounded-md border border-gray-300"
                          />
                          <input
                            type="text"
                            value={color}
                            onBlur={() => markTouched('brandColors')}
                            onChange={(e) => setColorAt(idx, e.target.value)}
                            className={`flex-1 rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                              visibleError('brandColors') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="#FF3366"
                          />
                          {form.brandColors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColor(idx)}
                              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {visibleError('brandColors') && (
                      <p className="mt-2 text-sm text-red-600">{visibleError('brandColors')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Product</h2>
                  <p className="mt-1 text-sm text-gray-600">Add product details so the cat can sell it convincingly.</p>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.productName}
                        onBlur={() => markTouched('productName')}
                        onChange={(e) => setField('productName', e.target.value)}
                        className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                          visibleError('productName') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="e.g. WhiskerGlow Serum"
                      />
                      {visibleError('productName') && (
                        <p className="mt-2 text-sm text-red-600">{visibleError('productName')}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        One-Line Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.oneLineDescription}
                        onBlur={() => markTouched('oneLineDescription')}
                        onChange={(e) => setField('oneLineDescription', e.target.value)}
                        className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                          visibleError('oneLineDescription') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="What is it, in one sentence?"
                      />
                      {visibleError('oneLineDescription') && (
                        <p className="mt-2 text-sm text-red-600">{visibleError('oneLineDescription')}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Key Benefit <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.keyBenefit}
                          onBlur={() => markTouched('keyBenefit')}
                          onChange={(e) => setField('keyBenefit', e.target.value)}
                          className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                            visibleError('keyBenefit') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="e.g. 2x faster results"
                        />
                        {visibleError('keyBenefit') && (
                          <p className="mt-2 text-sm text-red-600">{visibleError('keyBenefit')}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Audience <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.targetAudience}
                          onBlur={() => markTouched('targetAudience')}
                          onChange={(e) => setField('targetAudience', e.target.value)}
                          className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                            visibleError('targetAudience') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="e.g. busy professionals"
                        />
                        {visibleError('targetAudience') && (
                          <p className="mt-2 text-sm text-red-600">{visibleError('targetAudience')}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Call-to-Action <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.callToAction}
                        onBlur={() => markTouched('callToAction')}
                        onChange={(e) => setField('callToAction', e.target.value)}
                        className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                          visibleError('callToAction') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="e.g. Shop now at neko.com"
                      />
                      {visibleError('callToAction') && (
                        <p className="mt-2 text-sm text-red-600">{visibleError('callToAction')}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image (optional)</label>
                    <div
                      className={`rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
                        visibleError('productImages') ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Use product imagery as a reference frame</p>
                          <p className="mt-1 text-sm text-gray-600">
                            PixVerse may use the first image to guide the video. For best aspect ratio results, upload an image already in {form.aspectRatio}.
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <label className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 cursor-pointer">
                              Upload image
                              <input
                                type="file"
                                accept={allowedImageTypes.join(',')}
                                className="sr-only"
                                onBlur={() => markTouched('productImages')}
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null
                                  setField('productImages', file ? [file] : [])
                                }}
                              />
                            </label>
                            {form.productImages.length > 0 && (
                              <span className="text-xs text-gray-600">
                                {form.productImages[0]?.name || '1 selected'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {visibleError('productImages') && (
                      <p className="mt-2 text-sm text-red-600">{visibleError('productImages')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Direction</h2>
                  <p className="mt-1 text-sm text-gray-600">Set the tone, aspect ratio, and duration.</p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tone preset</label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {tonePresets.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setField('tonePreset', preset.id)}
                            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                              form.tonePreset === preset.id
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom tone notes</label>
                      <textarea
                        rows={3}
                        value={form.toneText}
                        onChange={(e) => setField('toneText', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Optional: pacing, vibe, style notes, on-screen text style, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aspect Ratio <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={form.aspectRatio}
                          onBlur={() => markTouched('aspectRatio')}
                          onChange={(e) => setField('aspectRatio', e.target.value)}
                          className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                            visibleError('aspectRatio') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          {aspectRatioOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                        {visibleError('aspectRatio') && (
                          <p className="mt-2 text-sm text-red-600">{visibleError('aspectRatio')}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={String(form.duration)}
                          onBlur={() => markTouched('duration')}
                          onChange={(e) => setField('duration', Number(e.target.value))}
                          className={`w-full rounded-lg border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                            visibleError('duration') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          {durationOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                        {visibleError('duration') && (
                          <p className="mt-2 text-sm text-red-600">{visibleError('duration')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {serverError && (
                <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  Your assets are sent to the server for processing. No third-party calls are made from your browser.
                </p>
                <button
                  type="submit"
                  disabled={job && job.status !== 'done' && job.status !== 'error'}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />
                  Finish Form
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">Status</h3>
                <div className="mt-3 flex items-start gap-3">
                  <div className={`mt-0.5 h-3 w-3 rounded-full ${
                    job?.status === 'done'
                      ? 'bg-green-500'
                      : job?.status === 'error'
                      ? 'bg-red-500'
                      : job?.status
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {job?.status ? statusLabel(job.status) : 'Fill the form to begin'}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {job?.message || (job?.status ? 'Working in the background.' : 'Your video will appear here when ready.')}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => formRef.current?.requestSubmit?.()}
                    disabled={job && job.status !== 'done' && job.status !== 'error'}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                  >
                    <Sparkles className="h-4 w-4" />
                    Finish Form
                  </button>
                </div>
              </div>

              {job?.status === 'done' && job?.videoUrl && (
                <div ref={videoPanelRef} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">Your Video</h3>
                  <div className="mt-4 overflow-hidden rounded-xl border bg-black">
                    <video src={job.videoUrl} controls className="w-full" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={job.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {job?.status === 'error' && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                  <h3 className="text-sm font-semibold text-red-900">Generation failed</h3>
                  <p className="mt-2 text-sm text-red-700">{job.error || 'Something went wrong. Please try again.'}</p>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Retry
                  </button>
                </div>
              )}

              {showForm && (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">Tips</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>Keep the one-line description crisp and specific.</li>
                    <li>Use brand colors that look good as an on-screen palette.</li>
                    <li>For image-to-video, upload a product image already cropped to the chosen aspect ratio.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
