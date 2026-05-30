import { Link } from 'react-router-dom'
import { Play, Heart, Share2, Download, MessageCircle, ChevronLeft, Eye, Calendar, Share, Instagram, Twitter, Facebook } from 'lucide-react'
import { useState } from 'react'

const mockVideo = {
  id: '1',
  title: 'Glow Naturals Serum',
  brand: 'Glow Naturals',
  category: 'Beauty',
  views: 12453,
  likes: 892,
  shares: 234,
  createdAt: '2024-01-15',
  duration: 38,
  pixverseUrl: 'https://app.pixverse.ai/video/abc123',
  description: 'A beautiful showcase of our premium skincare serum featuring our beloved cat mascot, Whiskers. Watch as she demonstrates the daily routine that keeps skin glowing and radiant.',
  tags: ['skincare', 'beauty', 'cat-mascot', 'wellness'],
  comments: [
    { id: 1, user: 'BeautyEnthusiast', text: 'Love how natural the integration looks!', likes: 24, time: '3 hours ago' },
    { id: 2, user: 'MarketingPro', text: 'Great brand storytelling', likes: 18, time: '5 hours ago' },
    { id: 3, user: 'CreativeDir', text: 'The cat mascot is so charming!', likes: 31, time: '1 day ago' },
    { id: 4, user: 'BrandManager', text: 'Perfect for Instagram Reels', likes: 15, time: '2 days ago' },
  ],
  relatedVideos: [
    { id: 2, title: 'PowerUp Charger Pro', thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop', brand: 'PowerUp Tech' },
    { id: 3, title: 'Crunch Co. Snacks', thumbnail: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop', brand: 'Crunch Co.' },
    { id: 4, title: 'EcoWear Collection', thumbnail: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop', brand: 'EcoWear' },
  ],
}

export default function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out this amazing ad: ${mockVideo.title} by ${mockVideo.brand}`)
    
    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: 'https://instagram.com',
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
      setShowShareModal(false)
    } else if (links[platform]) {
      window.open(links[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleDownload = () => {
    window.open(mockVideo.pixverseUrl, '_blank')
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      alert('Comment posted successfully!')
      setCommentText('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/gallery"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-gray-900">
                {isPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-pulse mb-4">
                        <Play className="h-20 w-20 mx-auto" />
                      </div>
                      <p className="text-lg font-medium">Playing PixVerse Video...</p>
                      <p className="text-sm text-gray-300 mt-2">{mockVideo.duration}s • HD Quality</p>
                      <a
                        href={mockVideo.pixverseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-3 bg-primary rounded-lg font-semibold hover:bg-primary/90"
                      >
                        Watch Full Video on PixVerse
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="group flex items-center justify-center w-20 h-20 rounded-full bg-white/95 hover:bg-white transition-all shadow-xl"
                    >
                      <Play className="h-8 w-8 text-primary ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {mockVideo.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {mockVideo.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share className="h-4 w-4" />
                        {mockVideo.shares}
                      </span>
                    </div>
                    <span className="text-sm">{mockVideo.duration}s</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{mockVideo.title}</h1>
                    <p className="text-gray-600 mt-1">by {mockVideo.brand}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {mockVideo.category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {mockVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 mb-6">{mockVideo.description}</p>

                <div className="flex items-center gap-3 pt-6 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
                    <Heart className="h-4 w-4" />
                    Like
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Powered by PixVerse</p>
                      <p className="text-sm text-gray-600 mt-1">
                        This video was generated using PixVerse AI technology, ensuring professional quality and engaging content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({mockVideo.comments.length})
              </h2>

              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this video..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {mockVideo.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {comment.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{comment.user}</span>
                        <span className="text-sm text-gray-500">{comment.time}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{comment.text}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
                          <Heart className="h-4 w-4" />
                          {comment.likes}
                        </button>
                        <button className="text-sm text-gray-500 hover:text-primary">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Published {mockVideo.createdAt}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Brand</h3>
                  <p className="font-semibold text-gray-900">{mockVideo.brand}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Category</h3>
                  <p className="font-semibold text-gray-900">{mockVideo.category}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Video Duration</h3>
                  <p className="font-semibold text-gray-900">{mockVideo.duration} seconds</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Platform</h3>
                  <p className="font-semibold text-gray-900">PixVerse AI</p>
                </div>

                <div className="pt-4 border-t">
                  <Link
                    to="/onboarding"
                    className="block w-full text-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Create Similar Ad
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Videos</h2>
              <div className="space-y-4">
                {mockVideo.relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    to={`/preview/${video.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="flex">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-24 object-cover"
                      />
                      <div className="p-3 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">{video.brand}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Share this video</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50"
              >
                <Twitter className="h-8 w-8 text-blue-400" />
                <span className="text-xs text-gray-700">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50"
              >
                <Facebook className="h-8 w-8 text-blue-600" />
                <span className="text-xs text-gray-700">Facebook</span>
              </button>
              <button
                onClick={() => handleShare('instagram')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50"
              >
                <Instagram className="h-8 w-8 text-pink-600" />
                <span className="text-xs text-gray-700">Instagram</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50"
              >
                <Share className="h-8 w-8 text-gray-600" />
                <span className="text-xs text-gray-700">Copy Link</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
