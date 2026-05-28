import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import TrustSection from '@/sections/TrustSection'
import SocialProofSection from '@/sections/SocialProofSection'
import ContactCTASection from '@/sections/ContactCTASection'

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <TrustSection />
        <SocialProofSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  )
}
