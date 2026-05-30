import { Link } from 'react-router-dom'
import { CheckCircle, Download, Calendar, Mail, ArrowRight, Sparkles } from 'lucide-react'

const mockOrderDetails = {
  id: 'ORD-2024-001234',
  plan: 'Professional',
  amount: 149,
  email: 'contact@glownaturals.com',
  createdAt: '2024-01-20',
  estimatedDelivery: '2024-01-22',
  status: 'processing',
  trackingNumber: 'NKO-12345',
}

export default function OrderConfirmation() {
  const order = mockOrderDetails

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Thank You for Your Order!</h1>
          <p className="mt-2 text-gray-600">
            Your order has been confirmed and is being processed
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600 mt-1">Order #{order.id}</p>
            </div>
            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
              Processing
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                Order Date
              </div>
              <p className="font-semibold text-gray-900">{order.createdAt}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Sparkles className="h-4 w-4" />
                Estimated Delivery
              </div>
              <p className="font-semibold text-gray-900">{order.estimatedDelivery}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-semibold text-gray-900">{order.email}</p>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">
                Total Amount
              </div>
              <p className="font-semibold text-gray-900">${order.amount}.00</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">What Happens Next?</h3>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  Your PixVerse video is being generated! Our AI will create a custom 35+ second advertising video featuring your cat mascot. You'll receive an email notification once it's ready.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-gray-700">Order confirmed - We'll review your product details</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/30 text-primary flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-gray-700">AI generates your custom video</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-gray-500">Quality review & final delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">Your Order Includes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">3 Custom Videos</p>
                  <p className="text-sm text-gray-600">35+ seconds each in 4K quality</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">5 Revision Rounds</p>
                  <p className="text-sm text-gray-600">Fine-tune to perfection</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Commercial License</p>
                  <p className="text-sm text-gray-600">Use across all channels</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Social Media Kit</p>
                  <p className="text-sm text-gray-600">Optimized for all platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about your order, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Contact Support
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Want to create another ad?</p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            Start Another Campaign
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            <span>Powered by</span>
            <strong className="text-primary">PixVerse</strong>
            <span>&</span>
            <strong className="text-primary">Neko Platform</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
