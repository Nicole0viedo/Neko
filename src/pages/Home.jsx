import { Link } from 'react-router-dom'
import { Play, Sparkles, Users, ShoppingCart, BarChart3, MessageCircle, Heart, Share2 } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Video Generation',
    description: 'Our cat mascot comes alive in stunning PixVerse-generated videos tailored to your brand.',
    icon: Sparkles,
  },
  {
    name: 'Brand Customization',
    description: 'Upload your products, customize storylines, and create ads that perfectly represent your brand.',
    icon: Users,
  },
  {
    name: 'E-Commerce Integration',
    description: 'Seamless checkout experience with tiered pricing plans and secure payment processing.',
    icon: ShoppingCart,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track video engagement, views, and customer interactions in real-time.',
    icon: BarChart3,
  },
  {
    name: 'Social Sharing',
    description: 'Share your ads directly to social media platforms with one click.',
    icon: Share2,
  },
  {
    name: 'Community Engagement',
    description: 'Get feedback, likes, and comments from our community of advertisers.',
    icon: MessageCircle,
  },
]

const stats = [
  { label: 'Active Brands', value: '150+' },
  { label: 'Videos Generated', value: '2,500+' },
  { label: 'Avg. Engagement Rate', value: '68%' },
  { label: 'Customer Satisfaction', value: '98%' },
]

const sampleVideos = [
  {
    id: 1,
    title: 'Skincare Line Ad',
    brand: 'Glow Naturals',
    category: 'Beauty',
    views: 12453,
    likes: 892,
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Tech Charger Promo',
    brand: 'PowerUp',
    category: 'Electronics',
    views: 9876,
    likes: 654,
    thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Artisan Snacks',
    brand: 'Crunch Co.',
    category: 'Food & Beverage',
    views: 15234,
    likes: 1203,
    thumbnail: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop',
  },
]

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Cat Mascot,{' '}
              <span className="text-primary">Unlimited Advertising</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Create stunning, AI-powered product advertisements featuring your brand's unique cat mascot. Powered by PixVerse technology for professional-quality videos in minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/onboarding"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Start Creating Free
              </Link>
              <Link
                to="/gallery"
                className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-2"
              >
                View Gallery <Play className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-20">
            <div className="relative rounded-3xl bg-gray-900 p-2 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&h=600&fit=crop"
                alt="Cat mascot with products"
                className="rounded-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="group flex items-center gap-3 rounded-full bg-white/95 px-8 py-4 shadow-lg hover:bg-white transition-all">
                  <Play className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-gray-900">Watch Demo Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything You Need to Create Amazing Ads
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              From product upload to final video, our platform handles it all.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              See What's Possible
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Check out some of the amazing ads created by our community.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {sampleVideos.map((video) => (
              <Link
                key={video.id}
                to={`/preview/${video.id}`}
                className="video-card group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all duration-300"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="rounded-full bg-primary px-2 py-1">{video.category}</span>
                    <span className="text-gray-300">by {video.brand}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {video.likes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary to-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Create Your First Ad?
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/90 max-w-2xl mx-auto">
            Join 150+ brands already using Neko to create engaging, AI-powered advertising content with their cat mascots.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/onboarding"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-semibold leading-6 text-white flex items-center gap-2"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                  <p className="text-gray-600">
                    Sign up and tell us about your brand and product. Our onboarding flow makes it easy to get started.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Product</h3>
                  <p className="text-gray-600">
                    Upload product images, descriptions, and select your preferred mascot storyline template.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Generates Your Video</h3>
                  <p className="text-gray-600">
                    Our AI, powered by PixVerse, creates a custom 35+ second advertising video featuring your cat mascot.
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share & Track Results</h3>
                  <p className="text-gray-600">
                    Share your video to social media, track engagement metrics, and get feedback from the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
