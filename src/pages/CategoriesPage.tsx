import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CategoriesSection from '@/sections/CategoriesSection'
import InquirySection from '@/sections/InquirySection'

export default function CategoriesPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <CategoriesSection />
        <InquirySection />
      </main>
      <Footer />
    </div>
  )
}
