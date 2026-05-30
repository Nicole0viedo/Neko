import { Outlet, Link, useLocation } from 'react-router-dom'
import { Cat, Menu, X, ShoppingCart, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Cat Video Studio', href: '/cat-video-studio' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Get Started', href: '/onboarding' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-effect sticky top-0 z-50 border-b">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Cat className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">Neko</span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button className="relative p-2 text-gray-700 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
              </button>
            </div>

            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="space-y-1 px-4 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cat className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Neko</span>
              </div>
              <p className="text-sm text-cream/70">
                Create custom advertising videos featuring your brand's unique cat mascot with AI-powered PixVerse technology.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-cream/70">
                <li><Link to="/gallery" className="hover:text-cream">Gallery</Link></li>
                <li><Link to="/pricing" className="hover:text-cream">Pricing</Link></li>
                <li><Link to="/onboarding" className="hover:text-cream">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-cream/70">
                <li><a href="#" className="hover:text-cream">About Us</a></li>
                <li><a href="#" className="hover:text-cream">Contact</a></li>
                <li><a href="#" className="hover:text-cream">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-cream/70">
                <li><a href="#" className="hover:text-cream">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cream">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cream">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-cream/20 pt-8 text-center text-sm text-cream/60">
            <p>&copy; 2024 Neko Platform. All rights reserved. Powered by PixVerse.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
