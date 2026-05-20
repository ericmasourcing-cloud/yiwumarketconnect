import { Shield, Camera, Headphones, Clock, User } from 'lucide-react'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const badges = [
  { icon: Shield, color: 'var(--green)', text: 'Verified Supplier Network' },
  { icon: Camera, color: 'var(--blue)', text: 'Real Product Photos' },
  { icon: Headphones, color: 'var(--orange)', text: '1-on-1 Communication' },
  { icon: Clock, color: 'var(--navy)', text: '5-Day Market Response' },
]

export default function TrustSection() {
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
        <SectionLabel text="TRUST & CREDIBILITY" />
        <h2
          className="font-display font-medium mt-4"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          Why Clients Trust Me
        </h2>
        <p
          className="font-body text-[18px] leading-[1.7] max-w-[640px] mt-5"
          style={{ color: 'var(--navy-60)' }}
        >
          I don't have 200 staff or a fancy office. What I have is 5 years on the ground — 5 days a week walking the market aisles and visiting supplier factories. I know which districts have the best products, which suppliers deliver on time, and how to negotiate for small orders. My clients come from Europe, North America, Australia, the Middle East, Africa, and Southeast Asia — over 30 countries and counting. No hidden fees, no false promises, just honest work.
        </p>

        {/* Trust Badges */}
        <div
          ref={badgesRef}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12"
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
              I've been a full-time Yiwu Market agent since 2018. Five days a week, I'm at the market or visiting supplier factories — checking production lines, comparing samples in person, and building relationships with reliable vendors. I work with clients from over 30 countries across Europe, North America, the Middle East, Africa, and Southeast Asia. I'm best at written communication — detailed WhatsApp updates, photo reports, and clear emails. I use professional translation tools to make sure every product spec, price, and instruction is accurate. My clients trust me because they can see exactly what I see, in real time. No surprises, no shortcuts — just honest work as your eyes and hands in the world's biggest product market.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
