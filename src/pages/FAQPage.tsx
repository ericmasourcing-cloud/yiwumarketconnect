import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FAQSection from '@/sections/FAQSection'
import ContactCTASection from '@/sections/ContactCTASection'

export default function FAQPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <FAQSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  )
}
