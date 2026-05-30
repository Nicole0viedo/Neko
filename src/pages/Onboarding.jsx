import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, FileText, Sparkles, ArrowRight, ArrowLeft, Check, Camera, Palette } from 'lucide-react'

const steps = [
  { id: 1, name: 'Brand Info', icon: FileText },
  { id: 2, name: 'Product Details', icon: Upload },
  { id: 3, name: 'Mascot Style', icon: Palette },
  { id: 4, name: 'Preview', icon: Sparkles },
]

const mascotStyles = [
  { id: 'playful', name: 'Playful', description: 'Fun, energetic, and full of personality', image: '🐱' },
  { id: 'professional', name: 'Professional', description: 'Polished, trustworthy, and sophisticated', image: '🐱‍💼' },
  { id: 'cute', name: 'Cute & Kawaii', description: 'Adorable, charming, and heartwarming', image: '😺' },
  { id: 'adventure', name: 'Adventurous', description: 'Bold, exciting, and action-packed', image: '🐱‍👤' },
]

const storyTemplates = [
  { id: 'lifestyle', name: 'Lifestyle Showcase', description: 'Mascot uses product in everyday scenarios' },
  { id: 'testimonial', name: 'Customer Testimonial', description: 'Mascot shares authentic product experience' },
  { id: 'tutorial', name: 'How-To Tutorial', description: 'Step-by-step guide featuring your product' },
  { id: 'story', name: 'Brand Story', description: 'Narrative-driven storytelling about your brand' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    brandName: '',
    brandDescription: '',
    contactEmail: '',
    productName: '',
    productDescription: '',
    productCategory: '',
    productImages: [],
    mascotStyle: 'playful',
    storyTemplate: 'lifestyle',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/orders/create-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      navigate(`/checkout/basic`)
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Ad Campaign</h1>
          <p className="mt-2 text-gray-600">Follow the steps below to create your custom cat mascot advertisement</p>
        </div>

        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, idx) => (
                <li key={step.id} className={`relative ${idx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                  {idx !== steps.length - 1 && (
                    <div className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300" />
                  )}
                  <div className="group relative flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep > step.id
                          ? 'bg-primary text-white'
                          : currentStep === step.id
                          ? 'border-2 border-primary bg-white text-primary'
                          : 'border-2 border-gray-300 bg-white text-gray-300'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`ml-4 text-sm font-medium ${
                        currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Brand Information</h2>
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Enter your brand name"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Description
                  </label>
                  <textarea
                    id="brandDescription"
                    rows={3}
                    value={formData.brandDescription}
                    onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Tell us about your brand"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Category *
                </label>
                <select
                  id="productCategory"
                  required
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Select a category</option>
                  <option value="beauty">Beauty & Skincare</option>
                  <option value="electronics">Electronics</option>
                  <option value="food">Food & Beverage</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home">Home & Living</option>
                  <option value="health">Health & Wellness</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  id="productDescription"
                  required
                  rows={4}
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Describe your product, its features, and benefits"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Optional)
                </label>
                <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 hover:text-primary/80"
                      >
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Choose Your Mascot Style</h2>
              <div className="grid grid-cols-2 gap-4">
                {mascotStyles.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setFormData({ ...formData, mascotStyle: style.id })}
                    className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                      formData.mascotStyle === style.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-3">{style.image}</div>
                    <h3 className="font-semibold text-gray-900">{style.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{style.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Select Storyline Template</h2>
                <div className="space-y-3">
                  {storyTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setFormData({ ...formData, storyTemplate: template.id })}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        formData.storyTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Review & Preview</h2>
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Brand:</span>
                    <p className="text-gray-900">{formData.brandName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{formData.contactEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Product:</span>
                    <p className="text-gray-900">{formData.productName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-900 capitalize">{formData.productCategory || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Mascot Style:</span>
                    <p className="text-gray-900 capitalize">{formData.mascotStyle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Story Template:</span>
                    <p className="text-gray-900 capitalize">{formData.storyTemplate}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Generate!</h3>
                <p className="text-sm text-gray-600">
                  Your custom 35+ second PixVerse video will be generated based on your selections.
                  You'll receive an email when it's ready.
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">What's Included:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    35+ second HD video in MP4 format
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Custom cat mascot with your brand's style
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Product showcase integrated naturally
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Background music and professional editing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Social media optimized versions
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/pricing"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Choose Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
