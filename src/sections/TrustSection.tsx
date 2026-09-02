import { Shield, Camera, Headphones, Clock, User } from 'lucide-react'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const testimonials = [
  {
    quote: "Eric helped me find a reliable toy supplier with a MOQ of just 100 pieces — way lower than what I found online. He sent detailed photos and even caught a color issue before shipment. Highly recommend.",
    name: 'Sarah K.',
    role: 'Toy Store Owner, Germany',
    initials: 'SK',
  },
  {
    quote: "I was skeptical about working with someone in China I'd never met. But Eric was responsive, honest about pricing, and the samples he collected matched exactly what he described. Saved me a trip.",
    name: 'Marcus T.',
    role: 'Online Seller, Netherlands',
    initials: 'MT',
  },
  {
    quote: 'We needed custom packaging for our gift boxes and Eric handled the back-and-forth with the supplier for three rounds of mockups. The final boxes looked perfect. He really takes care of the details.',
    name: 'Aiko N.',
    role: 'Boutique Gift Shop, Japan',
    initials: 'AN',
  },
]

const badges = [
  { icon: Shield, color: 'var(--green)', text: 'Verified Supplier Network' },
  { icon: Camera, color: 'var(--blue)', text: 'Real Product Photos' },
  { icon: Headphones, color: 'var(--orange)', text: '1-on-1 Communication' },
  { icon: Clock, color: 'var(--navy)', text: '5-Day Market Response' },
]

export default function TrustSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.testimonial-card',
    stagger: 0.1,
    y: 40,
  })
  const badgesRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.badge-item',
    stagger: 0.08,
  })
  const aboutRef = useScrollReveal<HTMLDivElement>({
    y: 30,
  })

  return (
    <section id="about" style={{ background: 'var(--warm-white)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="TRUST & TESTIMONIALS" />
        <h2
          className="font-display font-medium mt-4"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          Trusted by Small Businesses Worldwide
        </h2>

        {/* Testimonial Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card bg-white rounded-2xl p-10 border"
              style={{
                borderColor: 'var(--navy-15)',
                boxShadow: '0 8px 32px rgba(10, 37, 64, 0.08)',
              }}
            >
              <p
                className="font-body text-[16px] leading-[1.6] italic"
                style={{ color: 'var(--navy-60)' }}
              >
                <span className="font-display text-[24px]" style={{ color: 'var(--orange)' }}>"</span>
                {t.quote}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-[16px] font-medium text-white flex-shrink-0"
                  style={{ background: 'var(--navy)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-display text-[16px] font-medium" style={{ color: 'var(--navy)' }}>
                    {t.name}
                  </p>
                  <p className="font-body text-[14px]" style={{ color: 'var(--navy-60)' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div
          ref={badgesRef}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16"
        >
          {badges.map((b) => (
            <div
              key={b.text}
              className="badge-item flex flex-col items-center gap-2 text-center"
            >
              <b.icon size={32} style={{ color: b.color }} />
              <span className="font-body text-[14px] max-w-[140px]" style={{ color: 'var(--navy-60)' }}>
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* About Eric Snippet */}
        <div
          ref={aboutRef}
          className="max-w-[800px] mx-auto mt-16 flex flex-col md:flex-row items-center gap-8"
        >
          <div
            className="w-[120px] h-[120px] rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--beige)' }}
          >
            <User size={48} style={{ color: 'var(--navy-40)' }} />
          </div>
          <div>
            <h4 className="font-display text-[24px] font-medium" style={{ color: 'var(--navy)' }}>
              Hi, I'm Eric 👋
            </h4>
            <p
              className="font-body text-[16px] leading-[1.7] mt-3"
              style={{ color: 'var(--navy-60)' }}
            >
              I've been walking the aisles of Yiwu Market since 2018. I know which districts have the best toys, which suppliers actually deliver on time, and how to negotiate for small orders. I work with clients from over 20 countries. I'm best at written communication — WhatsApp messages, detailed emails, and photo/video updates. I use translation tools to make sure every product spec, price, and instruction is 100% accurate. No misunderstandings, no surprises. My job is simple: be your trusted eyes and hands in the world's biggest product market.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
