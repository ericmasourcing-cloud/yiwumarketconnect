import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Search, Camera, FileText, Palette, PackageCheck, Ship } from 'lucide-react'

const services = [
  {
    icon: Search,
    title: 'Category Sourcing',
    body: 'Tell us the category. We visit 5-10 relevant booths in Yiwu market and collect options that match your target price and quality.',
  },
  {
    icon: Camera,
    title: 'Real Market Photos',
    body: 'We send real photos, item numbers and booth details so you can see exactly what is available before deciding.',
  },
  {
    icon: FileText,
    title: 'MOQ & Price Check',
    body: 'We confirm minimum order quantity, unit price, packing details and lead time for each item you are interested in.',
  },
  {
    icon: Palette,
    title: 'Customization Support',
    body: 'Need logo printing, custom packaging or specific colors? We coordinate with suppliers and send mockups for approval.',
  },
  {
    icon: PackageCheck,
    title: 'Quality Check',
    body: 'Before shipping, we check quantity, colors, materials and obvious defects. Photos and videos are shared for transparency.',
  },
  {
    icon: Ship,
    title: 'Shipping Coordination',
    body: 'We help coordinate handoff from supplier to your freight forwarder and can recommend trusted partners we have worked with.',
  },
]

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[120px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[720px] mx-auto">
            <span className="font-body text-[14px] font-medium tracking-wider" style={{ color: 'var(--ksa-green)' }}>
              SERVICES
            </span>
            <h1
              className="font-display font-medium mt-3"
              style={{
                fontSize: 'clamp(36px, 4vw, 64px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--navy)',
              }}
            >
              How we help Saudi buyers source from Yiwu
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {services.map((s) => (
              <div
                key={s.title}
                className="p-8 rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: 'var(--navy-8)',
                  boxShadow: '0 8px 32px rgba(10, 37, 64, 0.06)',
                }}
              >
                <s.icon size={28} style={{ color: 'var(--ksa-green)' }} strokeWidth={2} />
                <h3 className="font-display text-[22px] font-medium mt-5" style={{ color: 'var(--navy)' }}>
                  {s.title}
                </h3>
                <p className="font-body text-[16px] leading-[1.65] mt-2" style={{ color: 'var(--navy-60)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
