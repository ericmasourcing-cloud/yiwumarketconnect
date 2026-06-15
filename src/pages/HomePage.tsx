import { useState, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/sections/HeroSection'
import ValuePropsSection from '@/sections/ValuePropsSection'
import CategoriesSection from '@/sections/CategoriesSection'
import ProductsSection from '@/sections/ProductsSection'
import ProcessSection from '@/sections/ProcessSection'
import InquirySection from '@/sections/InquirySection'

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(true)

  const handleHeroVisible = useCallback((visible: boolean) => {
    setHeroVisible(visible)
  }, [])

  return (
    <div className="relative" style={{ background: 'var(--warm-white)' }}>
      <Navigation heroVisible={heroVisible} />
      <main className="relative z-[1]">
        <HeroSection onHeroVisible={handleHeroVisible} />
        <ValuePropsSection />
        <CategoriesSection />
        <ProductsSection />
        <ProcessSection />
        <InquirySection />
      </main>
      <Footer />
    </div>
  )
}
