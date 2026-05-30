import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Sparkles,
    price: 49,
    description: 'Perfect for small businesses and startups',
    features: [
      '1 custom 35+ second video',
      'Standard cat mascot style',
      'HD quality (1080p)',
      '2 revision rounds',
      'Commercial license',
      'Email support',
    ],
    notIncluded: [
      '4K quality',
      'Multiple mascots',
      'Priority processing',
      'Social media kit',
    ],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Zap,
    price: 149,
    description: 'Best for growing brands with regular needs',
    features: [
      '3 custom 35+ second videos',
      'All mascot styles included',
      '4K quality (2160p)',
      '5 revision rounds',
      'Commercial license',
      'Priority support',
      'Social media kit',
      'Multi-platform formats',
    ],
    notIncluded: [
      'Dedicated account manager',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    price: 499,
    description: 'Complete solution for large organizations',
    features: [
      'Unlimited video generation',
      'All mascot styles + custom',
      '4K quality (2160p)',
      'Unlimited revisions',
      'Commercial license',
      'Dedicated account manager',
      'Social media kit',
      'Multi-platform formats',
      'API access',
      'Custom mascot creation',
      'White-label options',
    ],
    notIncluded: [],
    popular: false,
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your brand's needs. All plans include PixVerse-powered video generation.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                plan.popular ? 'ring-2 ring-primary scale-105' : 'ring-1 ring-gray-900/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <plan.icon className="h-10 w-10 text-primary mb-3" />
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600 ml-1">/video package</span>
              </div>

              <Link
                to={`/checkout/${plan.id}`}
                className={`block w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </Link>

              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="h-5 w-5 flex-shrink-0 mt-0.5">✗</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
              <p className="text-gray-600 mb-6">
                We offer tailored video packages for brands with unique requirements. Get in touch with our team to discuss your project.
              </p>
              <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                Contact Sales
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-700">Volume discounts for multiple videos</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-700">Custom mascot design services</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-700">White-label partnerships available</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-700">API integration support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="font-semibold text-gray-900 mb-2">How long does video generation take?</h3>
              <p className="text-sm text-gray-600">
                Standard processing takes 24-48 hours. Professional and Enterprise plans include priority processing for faster delivery.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Can I request revisions?</h3>
              <p className="text-sm text-gray-600">
                Yes! Each plan includes revision rounds. Basic includes 2 revisions, Professional includes 5, and Enterprise offers unlimited revisions.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="font-semibold text-gray-900 mb-2">What video formats do I receive?</h3>
              <p className="text-sm text-gray-600">
                You receive MP4 files optimized for web playback. Professional and Enterprise plans include multiple social media formats (Instagram, TikTok, YouTube, etc.).
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="font-semibold text-gray-900 mb-2">What's included in the commercial license?</h3>
              <p className="text-sm text-gray-600">
                The commercial license allows you to use the generated videos for advertising, marketing, and promotional purposes across all your channels.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            Start with a consultation call
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
