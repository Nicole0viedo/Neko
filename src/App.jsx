import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Pricing from './pages/Pricing'
import Gallery from './pages/Gallery'
import Dashboard from './pages/Dashboard'
import VideoPreview from './pages/VideoPreview'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import CatVideoStudio from './pages/CatVideoStudio'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cat-video-studio" element={<CatVideoStudio />} />
          <Route path="preview/:videoId" element={<VideoPreview />} />
          <Route path="checkout/:planId" element={<Checkout />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
