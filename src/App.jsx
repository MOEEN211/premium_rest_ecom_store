import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Articles from './pages/Articles'
import Contact from './pages/Contact'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import ArticleDetails from './pages/ArticleDetails'
import Delivery from './pages/Delivery'
import Returns from './pages/Returns'
import Terms from './pages/Terms'
import Admin from './pages/Admin'
import AdminGuard from './components/AdminGuard'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/blogs" element={<Layout><Articles /></Layout>} />
        <Route path="/article/:id" element={<Layout><ArticleDetails /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/delivery" element={<Layout><Delivery /></Layout>} />
        <Route path="/returns" element={<Layout><Returns /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/admin" element={<Layout><AdminGuard><Admin /></AdminGuard></Layout>} />
      </Routes>
      <WhatsAppButton />
    </div>
  )
}

export default App
