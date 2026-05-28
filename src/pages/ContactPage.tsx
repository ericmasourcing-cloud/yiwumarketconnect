import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import InquiryFormSection from '@/sections/InquiryFormSection'

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <InquiryFormSection />
      </main>
      <Footer />
    </div>
  )
}
