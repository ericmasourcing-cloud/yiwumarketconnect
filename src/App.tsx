import { useState, useCallback } from 'react'
import './App.css'
import Navigation from '@/components/Navigation'
import FermatSpiral from '@/components/FermatSpiral'
import Footer from '@/components/Footer'
import HeroSection from '@/sections/HeroSection'
import StatsBarSection from '@/sections/StatsBarSection'
import WhyYiwuSection from '@/sections/WhyYiwuSection'
import ServicesSection from '@/sections/ServicesSection'
import CategoriesSection from '@/sections/CategoriesSection'
import HowItWorksSection from '@/sections/HowItWorksSection'
import TrustSection from '@/sections/TrustSection'
import SocialProofSection from '@/sections/SocialProofSection'
import FAQSection from '@/sections/FAQSection'
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

      {/* Page content - structured like JingSourcing */}
      <main className="relative z-[1]">
        {/* 1. Hero - H1 + CTA */}
        <HeroSection onHeroVisible={handleHeroVisible} />

        {/* 2. Stats Bar - "20+ Countries, 5+ Years..." (JingSourcing: 4000+ clients) */}
        <StatsBarSection />

        {/* 3. Why Yiwu Market */}
        <WhyYiwuSection />

        {/* 4. Services - What I Do */}
        <ServicesSection />

        {/* 5. How It Works - 4 Steps */}
        <HowItWorksSection />

        {/* 6. Product Categories */}
        <CategoriesSection />

        {/* 7. About Eric + Trust Badges */}
        <TrustSection />

        {/* 8. Client Reviews + Lead Magnet (JingSourcing: testimonials + free guide) */}
        <SocialProofSection />

        {/* 9. FAQ Accordion (JingSourcing: "What sets us apart" accordion) */}
        <FAQSection />

        {/* 10. Inquiry Form */}
        <InquiryFormSection />

        {/* 11. Final CTA */}
        <ContactCTASection />
      </main>

      <Footer />
    </div>
  )
}

export default App
