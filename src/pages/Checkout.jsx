import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CreditCard, Lock, Check, ArrowLeft, Shield, Sparkles } from 'lucide-react'

const plans = {
  basic: {
    name: 'Basic',
    price: 49,
    features: [
      '1 custom 35+ second video',
      'Standard cat mascot style',
      'HD quality (1080p)',
      '2 revision rounds',
      'Commercial license',
    ],
  },
  professional: {
    name: 'Professional',
    price: 149,
    features: [
      '3 custom 35+ second videos',
      'All mascot styles included',
      '4K quality (2160p)',
      '5 revision rounds',
      'Commercial license',
      'Priority support',
      'Social media kit',
    ],
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    features: [
      'Unlimited video generation',
      'All mascot styles + custom',
      '4K quality (2160p)',
      'Unlimited revisions',
      'Commercial license',
      'Dedicated account manager',
      'API access',
    ],
  },
}

export default function Checkout() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const plan = plans[planId] || plans.basic
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'United States',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          plan: plan.name,
          amount: plan.price,
          customerInfo: formData,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        navigate(`/order-confirmation/${data.orderId}`)
      } else {
        alert('Payment processing failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/pricing"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pricing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600 mb-8">Complete your order for the {plan.name} plan</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      name="nameOnCard"
                      required
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value)
                          setFormData({ ...formData, cardNumber: formatted })
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value)
                          setFormData({ ...formData, expiryDate: formatted })
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="billingAddress"
                      name="billingAddress"
                      required
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="94102"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay ${plan.price}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    PixVerse-powered cat mascot video generation
                  </p>
                  {plan.popular && (
                    <span className="inline-block mt-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">What's included:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${plan.price}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">${plan.price}.00</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Secure Payment</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 256-bit SSL encryption</li>
                  <li>• PCI DSS compliant</li>
                  <li>• Money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
