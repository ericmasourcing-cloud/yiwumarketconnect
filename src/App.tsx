import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from '@/pages/HomePage'
import EricPage from '@/pages/EricPage'
import ServicesPage from '@/pages/ServicesPage'
import AboutPage from '@/pages/AboutPage'
import FAQPage from '@/pages/FAQPage'
import CategoriesPage from '@/pages/CategoriesPage'
import ContactPage from '@/pages/ContactPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'

function App() {
  return (
    <Routes>
      <Route path="/eric" element={<EricPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  )
}

export default App
