import { Shield, Camera, Headphones, Clock } from 'lucide-react'
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
          I don't have 200 staff or a fancy office. What I have is 5 years on the ground — walking market aisles and visiting supplier factories 5 days a week. I know which of the 5 districts has the best products for each category, which suppliers deliver on time (I've worked with over 80 verified vendors), and how to negotiate MOQs 60-80% lower than Alibaba rates. My clients come from 30+ countries across 5 continents. No hidden fees, no false promises — just honest work with full cost transparency.
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
          <div className="w-[160px] h-[160px] rounded-full overflow-hidden flex-shrink-0 border-4 shadow-lg" style={{ borderColor: 'var(--orange-40)' }}>
            <img
              src="/eric-profile.jpg"
              alt="Eric Ma - Yiwu Sourcing Agent with clients at Yiwu Market"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-display text-[24px] font-medium" style={{ color: 'var(--navy)' }}>
              Hi, I'm Eric 👋
            </h4>
            <p
              className="font-body text-[16px] leading-[1.7] mt-3"
              style={{ color: 'var(--navy-60)' }}
            >
              I've been a full-time Yiwu Market agent since 2018 — five days a week walking the aisles of the world's largest wholesale market (14 million square meters, 75,000+ booths). I check production lines in person, compare samples side-by-side, and have built relationships with 80+ verified suppliers across all 5 market districts. I work with clients from 30+ countries — from first-time importers in Germany to established sellers in Australia. My average response time on WhatsApp is under 3 hours, even on weekends. I use professional translation tools to ensure every product spec, price, and instruction is accurate — so nothing gets lost in translation. My clients trust me because I show them exactly what I see: real-time photos, detailed comparison sheets, and honest cost breakdowns. No surprises, no shortcuts — just transparent work as your eyes and hands in Yiwu.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
