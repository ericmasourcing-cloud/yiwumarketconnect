import { useState, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import FermatSpiral from '@/components/FermatSpiral'
import Footer from '@/components/Footer'
import HeroSection from '@/sections/HeroSection'
import StatsBarSection from '@/sections/StatsBarSection'
import WhyYiwuSection from '@/sections/WhyYiwuSection'
import ServicesSection from '@/sections/ServicesSection'
import ContactCTASection from '@/sections/ContactCTASection'

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(true)

  const handleHeroVisible = useCallback((visible: boolean) => {
    setHeroVisible(visible)
  }, [])

  return (
    <div className="relative" style={{ background: 'var(--warm-white)' }}>
      <FermatSpiral isVisible={heroVisible} />
      <Navigation />
      <main className="relative z-[1]">
        <HeroSection onHeroVisible={handleHeroVisible} />
        <StatsBarSection />
        <WhyYiwuSection />
        <ServicesSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  )
}
