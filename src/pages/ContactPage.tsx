import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import InquirySection from '@/sections/InquirySection'

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <InquirySection />
      </main>
      <Footer />
    </div>
  )
}
