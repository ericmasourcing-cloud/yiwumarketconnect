import { Search, ShieldCheck, ClipboardCheck, Package, Palette, Truck } from 'lucide-react'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const services = [
  {
    icon: Search,
    color: 'var(--orange)',
    title: 'Product Sourcing',
    body: 'Tell me what you\'re looking for — I\'ll visit 5–10 booths, collect catalogues, take real photos, and send you a comparison with MOQ, price, and lead time.',
  },
  {
    icon: ShieldCheck,
    color: 'var(--blue)',
    title: 'Supplier Screening',
    body: 'I check supplier business licences, visit their booths, and verify they actually stock what they claim. No blind introductions.',
  },
  {
    icon: ClipboardCheck,
    color: 'var(--green)',
    title: 'Quality Check',
    body: 'Before shipping, I do a basic inspection — check quantity, colors, materials, and obvious defects. Simple but honest.',
  },
  {
    icon: Package,
    color: 'var(--orange)',
    title: 'Sample Collection',
    body: 'Need samples before a big order? I\'ll collect them from different suppliers, take comparison photos and videos, and ship them to you.',
  },
  {
    icon: Palette,
    color: 'var(--blue)',
    title: 'Logo & Packaging',
    body: 'Want your logo on the product or custom packaging? I coordinate with the supplier on printing specs, send mockups, and confirm the final look before production.',
  },
  {
    icon: Truck,
    color: 'var(--green)',
    title: 'Shipping Support',
    body: 'From factory to freight forwarder, I help coordinate the handoff. I can recommend trusted forwarders I\'ve worked with.',
  },
]

export default function ServicesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.service-card',
    stagger: 0.08,
    y: 50,
  })

  return (
    <section id="services" style={{ background: 'var(--beige)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="WHAT I DO" />
        <h2
          className="font-display font-medium mt-4 max-w-[600px]"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          End-to-End Sourcing, at Human Scale
        </h2>
        <p
          className="font-body text-[18px] leading-[1.7] max-w-[640px] mt-5"
          style={{ color: 'var(--navy-60)' }}
        >
          I don't run a factory. I don't claim to have the lowest price. What I do is help you find the right products, verify the suppliers, and make sure what you receive matches what you saw.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {services.map((s) => (
            <div
              key={s.title}
              className="service-card bg-white rounded-2xl p-10 border transition-all duration-300 hover:-translate-y-[6px]"
              style={{
                borderColor: 'var(--navy-15)',
                boxShadow: '0 8px 32px rgba(10, 37, 64, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(10, 37, 64, 0.12)'
                e.currentTarget.style.borderColor = 'var(--navy-15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(10, 37, 64, 0.08)'
                e.currentTarget.style.borderColor = 'var(--navy-15)'
              }}
            >
              <s.icon size={24} style={{ color: s.color }} strokeWidth={2} />
              <h4
                className="font-display text-[20px] font-medium mt-5"
                style={{ color: 'var(--navy)' }}
              >
                {s.title}
              </h4>
              <p
                className="font-body text-[16px] mt-3 leading-[1.6]"
                style={{ color: 'var(--navy-60)' }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
