import { MessageCircle, Mail, MapPin } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const contacts = [
  {
    icon: MessageCircle,
    color: 'var(--green)',
    label: 'WHATSAPP',
    value: '+86 186 8606 2666',
    note: 'Fastest response — usually within 2 hours',
    href: 'https://wa.me/8618686062666',
  },
  {
    icon: Mail,
    color: 'var(--blue)',
    label: 'EMAIL',
    value: 'ericma.sourcing@gmail.com',
    note: 'Best for detailed product requests',
    href: 'mailto:ericma.sourcing@gmail.com',
  },
  {
    icon: MapPin,
    color: 'var(--orange)',
    label: 'LOCATION',
    value: 'Yiwu International Trade City, Zhejiang, China',
    note: 'District 1 to 5 — I walk them all',
    href: null,
  },
]

export default function ContactCTASection() {
  const cardsRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.contact-card',
    stagger: 0.1,
    y: 30,
  })
  const ctaRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.3 })

  return (
    <section style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[100px]">
        <h2
          className="font-display font-medium text-center"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#fff',
          }}
        >
          Let's Find Your Next Product
        </h2>
        <p
          className="font-body text-[18px] leading-[1.7] text-center mt-4 max-w-[560px] mx-auto"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          I'm usually in the market Monday through Saturday. Drop me a message and I'll respond as soon as I'm back at my desk.
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {contacts.map((c) => {
            const content = (
              <div
                className="contact-card rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <c.icon size={28} style={{ color: c.color, margin: '0 auto' }} />
                <p
                  className="font-display text-[14px] font-medium mt-4 tracking-[0.05em]"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {c.label}
                </p>
                <p className="font-body text-[18px] text-white mt-2">
                  {c.value}
                </p>
                <p
                  className="font-body text-[14px] mt-2"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {c.note}
                </p>
              </div>
            )

            return c.href ? (
              <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={c.label}>{content}</div>
            )
          })}
        </div>

        <div ref={ctaRef} className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center justify-center font-display text-[16px] font-medium px-10 py-4 rounded-xl text-white transition-all duration-300"
            style={{ background: 'var(--orange)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E55A2B'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--orange)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Send an Inquiry →
          </a>
        </div>
      </div>
    </section>
  )
}
