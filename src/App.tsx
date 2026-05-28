import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from '@/pages/HomePage'
import BlogPostPage from '@/pages/BlogPostPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  )
}

export default App
