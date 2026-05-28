import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CategoriesSection from '@/sections/CategoriesSection'
import ContactCTASection from '@/sections/ContactCTASection'

export default function CategoriesPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <CategoriesSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  )
}
