import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ServicesSection from '@/sections/ServicesSection'
import HowItWorksSection from '@/sections/HowItWorksSection'
import ContactCTASection from '@/sections/ContactCTASection'

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <ServicesSection />
        <HowItWorksSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  )
}
