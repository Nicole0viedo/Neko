import { Link } from 'react-router-dom'
import { Play, Download, Edit, Share2, BarChart3, Calendar, Eye, Heart, TrendingUp, Bell, Settings, Plus } from 'lucide-react'
import { useState } from 'react'

const mockOrders = [
  {
    id: 'ORD-001',
    plan: 'Professional',
    status: 'completed',
    videoTitle: 'Glow Naturals Serum Ad',
    createdAt: '2024-01-15',
    views: 12453,
    likes: 892,
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  },
  {
    id: 'ORD-002',
    plan: 'Basic',
    status: 'processing',
    videoTitle: 'PowerUp Charger Pro',
    createdAt: '2024-01-18',
    views: null,
    likes: null,
    thumbnail: null,
  },
]

const mockStats = {
  totalViews: 25678,
  totalLikes: 1845,
  totalOrders: 5,
  avgEngagement: 7.2,
}

const recentActivity = [
  { type: 'order', message: 'Your video for PowerUp Charger is being generated', time: '2 hours ago' },
  { type: 'like', message: 'Your Glow Naturals ad received 50 new likes', time: '5 hours ago' },
  { type: 'comment', message: 'New comment on your video from MarketingPro', time: '1 day ago' },
  { type: 'view', message: 'Your videos reached 10,000 total views!', time: '2 days ago' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-base">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage your ad campaigns and track performance</p>
            </div>
            <Link
              to="/onboarding"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'videos', name: 'My Videos', icon: Play },
                { id: 'orders', name: 'Orders', icon: Calendar },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp },
                { id: 'settings', name: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>

            <div className="mt-8 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Contact our support team for assistance with your campaigns.
              </p>
              <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                Contact Support
              </button>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{mockStats.totalViews.toLocaleString()}</p>
                      </div>
                      <div className="rounded-full bg-primary/10 p-3">
                        <Eye className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+12.5%</span>
                      <span className="text-gray-600 ml-1">from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Likes</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{mockStats.totalLikes.toLocaleString()}</p>
                      </div>
                      <div className="rounded-full bg-pink-100 p-3">
                        <Heart className="h-6 w-6 text-pink-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+8.3%</span>
                      <span className="text-gray-600 ml-1">from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Orders</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{mockStats.totalOrders}</p>
                      </div>
                      <div className="rounded-full bg-blue-100 p-3">
                        <Play className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">1 in progress</p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{mockStats.avgEngagement}%</p>
                      </div>
                      <div className="rounded-full bg-purple-100 p-3">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+2.1%</span>
                      <span className="text-gray-600 ml-1">from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="divide-y">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="px-6 py-4 flex items-start gap-4">
                        <div className="rounded-full bg-gray-100 p-2">
                          <Bell className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <button className="text-sm text-primary hover:text-primary/80 font-medium">
                      View All
                    </button>
                  </div>
                  <div className="divide-y">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex items-center gap-4">
                          {order.thumbnail ? (
                            <img
                              src={order.thumbnail}
                              alt={order.videoTitle}
                              className="w-24 h-20 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-24 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Play className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{order.videoTitle}</h3>
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {order.plan} Plan • {order.createdAt}
                            </p>
                            {order.views && (
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {order.views.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {order.likes}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'completed' && (
                              <>
                                <Link
                                  to={`/preview/${order.id}`}
                                  className="p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100"
                                >
                                  <Play className="h-5 w-5" />
                                </Link>
                                <button className="p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100">
                                  <Download className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100">
                                  <Share2 className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100">
                                  <Edit className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'videos' && (
              <div className="bg-white rounded-lg shadow">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">My Videos</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockOrders.filter(o => o.status === 'completed').map((order) => (
                      <div key={order.id} className="rounded-lg overflow-hidden border">
                        <img
                          src={order.thumbnail}
                          alt={order.videoTitle}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900">{order.videoTitle}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {order.views?.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {order.likes}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Link
                              to={`/preview/${order.id}`}
                              className="flex-1 text-center px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90"
                            >
                              View
                            </Link>
                            <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center py-16">
                  <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600 mb-6">
                    Detailed analytics and performance metrics coming soon
                  </p>
                  <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                    Enable Analytics
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                </div>
                <div className="divide-y">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{order.id}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{order.videoTitle}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${order.plan === 'Professional' ? '149' : '49'}
                          </p>
                          <p className="text-sm text-gray-600">{order.plan} Plan</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                        <input
                          type="text"
                          defaultValue="Glow Naturals"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="contact@glownaturals.com"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t">
                    <button className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
