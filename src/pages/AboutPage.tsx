import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { MapPin, Users, Package, Calendar } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[120px] pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="max-w-[720px]">
            <span className="font-body text-[14px] font-medium tracking-wider" style={{ color: 'var(--ksa-green)' }}>
              ABOUT US
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
              Yiwu eyes and hands for Saudi event buyers
            </h1>
            <p
              className="font-body text-[18px] leading-[1.7] mt-6"
              style={{ color: 'var(--navy-60)' }}
            >
              We are based in Yiwu, China — the world&apos;s largest wholesale market for small products. We help Saudi importers, party shops, retailers and event businesses source seasonal decorations, party supplies and event giveaways directly from the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {[
              {
                icon: MapPin,
                title: 'Based in Yiwu',
                body: 'We visit booths, take real photos and collect item numbers from suppliers across the market.',
              },
              {
                icon: Users,
                title: 'Built for Saudi Buyers',
                body: 'We focus on categories that sell well in Saudi Arabia: Eid, Ramadan, National Day, parties and seasonal events.',
              },
              {
                icon: Package,
                title: 'Checked Before Quotation',
                body: 'We confirm MOQ, packing, customization options and lead time before sending you prices.',
              },
              {
                icon: Calendar,
                title: 'Seasonal Readiness',
                body: 'We prepare category lists ahead of peak seasons so buyers can plan orders early.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl border bg-white"
                style={{ borderColor: 'var(--navy-8)' }}
              >
                <item.icon size={28} style={{ color: 'var(--ksa-green)' }} strokeWidth={2} />
                <h3 className="font-display text-[22px] font-medium mt-4" style={{ color: 'var(--navy)' }}>
                  {item.title}
                </h3>
                <p className="font-body text-[16px] leading-[1.65] mt-2" style={{ color: 'var(--navy-60)' }}>
                  {item.body}
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
