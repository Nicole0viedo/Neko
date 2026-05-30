import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Heart, MessageCircle, Share2, Filter, Search } from 'lucide-react'

const categories = [
  'All',
  'Beauty',
  'Electronics',
  'Food & Beverage',
  'Fashion',
  'Home & Living',
  'Health & Wellness',
]

const videos = [
  {
    id: 1,
    title: 'Glow Naturals Serum',
    brand: 'Glow Naturals',
    category: 'Beauty',
    views: 12453,
    likes: 892,
    comments: 45,
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop',
    pixverseUrl: 'https://app.pixverse.ai/video/abc123',
  },
  {
    id: 2,
    title: 'PowerUp Charger Pro',
    brand: 'PowerUp Tech',
    category: 'Electronics',
    views: 9876,
    likes: 654,
    comments: 32,
    thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
    pixverseUrl: 'https://app.pixverse.ai/video/def456',
  },
  {
    id: 3,
    title: 'Crunch Co. Artisan Snacks',
    brand: 'Crunch Co.',
    category: 'Food & Beverage',
    views: 15234,
    likes: 1203,
    comments: 67,
    thumbnail: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=400&fit=crop',
    pixverseUrl: 'https://app.pixverse.ai/video/ghi789',
  },
  {
    id: 4,
    title: 'EcoWear Summer Collection',
    brand: 'EcoWear',
    category: 'Fashion',
    views: 8765,
    likes: 534,
    comments: 28,
    thumbnail: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop',
    pixverseUrl: 'https://app.pixverse.ai/video/jkl012',
  },
  {
    id: 5,
    title: 'CozyHome Candle Collection',
    brand: 'CozyHome',
    category: 'Home & Living',
    views: 11234,
    likes: 876,
    comments: 41,
    thumbnail: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=400&fit=crop',
    pixverseUrl: 'https://app.pixverse.ai/video/mno345',
  },
  {
    id: 6,
    title: 'VitaBoost Daily Vitamins',
    brand: 'VitaHealth',
    category: 'Health & Wellness',
    views: 7654,
    likes: 432,
    comments: 23,
    thumbnail: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=400&fit=crop',
    pixverseUrl: 'https://app.pixverse.ai/video/pqr678',
  },
]

const sampleComments = [
  { id: 1, user: 'MarketingPro', text: 'Love the energy! Perfect for social media', likes: 12, time: '2h ago' },
  { id: 2, user: 'BrandManager', text: 'The cat mascot is so charming', likes: 8, time: '4h ago' },
  { id: 3, user: 'CreativeDir', text: 'Great product integration', likes: 15, time: '6h ago' },
]

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [likedVideos, setLikedVideos] = useState(new Set())
  const [sortBy, setSortBy] = useState('popular')
  const [showComments, setShowComments] = useState(false)

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes
    if (sortBy === 'recent') return b.views - a.views
    if (sortBy === 'discussed') return b.comments - a.comments
    return 0
  })

  const toggleLike = (videoId) => {
    const newLiked = new Set(likedVideos)
    if (newLiked.has(videoId)) {
      newLiked.delete(videoId)
    } else {
      newLiked.add(videoId)
    }
    setLikedVideos(newLiked)
  }

  const handleShare = async (video) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this ad created with Neko: ${video.title} by ${video.brand}`,
          url: `/preview/${video.id}`,
        })
      } catch {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/preview/${video.id}`)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Video Gallery</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore amazing ads created by our community with PixVerse-powered cat mascots
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos by title or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Viewed</option>
              <option value="discussed">Most Discussed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedVideos.map((video) => (
            <div key={video.id} className="video-card bg-white rounded-2xl shadow-lg overflow-hidden">
              <Link to={`/preview/${video.id}`} className="block relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Play className="h-16 w-16 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="inline-block rounded-full bg-primary px-2 py-1 text-xs font-medium text-white mb-2">
                    {video.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                  <p className="text-sm text-gray-300">by {video.brand}</p>
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {video.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {video.comments}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLike(video.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        likedVideos.has(video.id)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${likedVideos.has(video.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare(video)}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {showComments && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-3">
                      {sampleComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {comment.user[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-900">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary">
                                <Heart className="h-3 w-3" />
                                {comment.likes}
                              </button>
                              <button className="text-xs text-gray-500 hover:text-primary">Reply</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedVideos.length === 0 && (
          <div className="text-center py-16">
            <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Want to showcase your brand?</h3>
              <p className="text-gray-600">Create your own custom cat mascot ad and add it to the gallery</p>
            </div>
            <Link
              to="/onboarding"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 whitespace-nowrap"
            >
              Create Your Ad
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
