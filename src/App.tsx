import { useState, useCallback } from 'react'
import './App.css'
import Navigation from '@/components/Navigation'
import FermatSpiral from '@/components/FermatSpiral'
import Footer from '@/components/Footer'
import HeroSection from '@/sections/HeroSection'
import WhyYiwuSection from '@/sections/WhyYiwuSection'
import ServicesSection from '@/sections/ServicesSection'
import CategoriesSection from '@/sections/CategoriesSection'
import HowItWorksSection from '@/sections/HowItWorksSection'
import TrustSection from '@/sections/TrustSection'
import InquiryFormSection from '@/sections/InquiryFormSection'
import ContactCTASection from '@/sections/ContactCTASection'

function App() {
  const [heroVisible, setHeroVisible] = useState(true)

  const handleHeroVisible = useCallback((visible: boolean) => {
    setHeroVisible(visible)
  }, [])

  return (
    <div className="relative" style={{ background: 'var(--warm-white)' }}>
      {/* Three.js Fermat Spiral - fixed behind hero */}
      <FermatSpiral isVisible={heroVisible} />

      {/* Navigation */}
      <Navigation />

      {/* Page content */}
      <main className="relative z-[1]">
        <HeroSection onHeroVisible={handleHeroVisible} />
        <WhyYiwuSection />
        <ServicesSection />
        <CategoriesSection />
        <HowItWorksSection />
        <TrustSection />
        <InquiryFormSection />
        <ContactCTASection />
      </main>

      <Footer />
    </div>
  )
}

export default App
