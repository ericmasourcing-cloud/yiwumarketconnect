import { useScrollReveal } from '@/hooks/useScrollReveal'
import { MapPin, Target, PackageCheck } from 'lucide-react'

const values = [
  {
    icon: MapPin,
    color: 'var(--ksa-green)',
    bg: 'var(--ksa-green-light)',
    title: 'Yiwu Market-Based',
    body: 'Real products from real booths. We collect photos, item numbers and pricing directly from Yiwu market.',
  },
  {
    icon: Target,
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
    title: 'Saudi-Focused Categories',
    body: 'Curated for Eid, Ramadan, Saudi National Day, party shops and event businesses in the KSA market.',
  },
  {
    icon: PackageCheck,
    color: 'var(--gold)',
    bg: 'var(--gold-light)',
    title: 'MOQ Checked Per Item',
    body: 'We confirm MOQ, packing details and customization options before quotation — no guesswork.',
  },
]

export default function ValuePropsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.value-card',
    stagger: 0.1,
    y: 40,
  })

  return (
    <section className="relative py-[80px] md:py-[120px]" style={{ background: 'var(--warm-white)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="value-card group relative p-8 rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-[6px]"
              style={{
                borderColor: 'var(--navy-8)',
                boxShadow: '0 8px 32px rgba(10, 37, 64, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(10, 37, 64, 0.12)'
                e.currentTarget.style.borderColor = 'var(--navy-15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(10, 37, 64, 0.06)'
                e.currentTarget.style.borderColor = 'var(--navy-8)'
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: v.bg }}
              >
                <v.icon size={26} style={{ color: v.color }} strokeWidth={2} />
              </div>
              <h3
                className="font-display text-[22px] font-medium"
                style={{ color: 'var(--navy)' }}
              >
                {v.title}
              </h3>
              <p
                className="font-body text-[16px] leading-[1.65] mt-3"
                style={{ color: 'var(--navy-60)' }}
              >
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
