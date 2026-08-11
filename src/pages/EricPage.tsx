import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SectionLabel from '@/components/SectionLabel'
import ContactCTASection from '@/sections/ContactCTASection'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { MapPin, MessageCircle, Camera, Handshake } from 'lucide-react'

const highlights = [
  { icon: MapPin, text: 'Based in Yiwu — on the market floor 5 days a week' },
  { icon: Handshake, text: '80+ verified suppliers across all 5 market districts' },
  { icon: MessageCircle, text: 'WhatsApp replies in under 3 hours, even on weekends' },
  { icon: Camera, text: 'Real-time photos and honest cost breakdowns' },
]

export default function EricPage() {
  const introRef = useScrollReveal<HTMLDivElement>({ y: 30 })
  const highlightsRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.highlight-item',
    stagger: 0.08,
  })

  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[80px]">
        <section style={{ background: 'var(--warm-white)' }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
            <SectionLabel text="MEET YOUR AGENT" />
            <h1
              className="font-display font-medium mt-4"
              style={{
                fontSize: 'clamp(32px, 3.5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--navy)',
              }}
            >
              Hi, I'm Eric 👋
            </h1>

            <div
              ref={introRef}
              className="mt-12 flex flex-col md:flex-row items-center md:items-start gap-10"
            >
              <div
                className="w-[200px] h-[200px] rounded-full overflow-hidden flex-shrink-0 border-4 shadow-lg"
                style={{ borderColor: 'var(--orange-light)' }}
              >
                <img
                  src="/eric-profile.jpg"
                  alt="Eric Ma - Yiwu Sourcing Agent with clients at Yiwu Market"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="max-w-[720px]">
                <p
                  className="font-body text-[18px] leading-[1.7]"
                  style={{ color: 'var(--navy-60)' }}
                >
                  I've been a full-time Yiwu Market agent since 2018 — five days a week walking
                  the aisles of the world's largest wholesale market (14 million square meters,
                  75,000+ booths). I check production lines in person, compare samples
                  side-by-side, and have built relationships with 80+ verified suppliers across
                  all 5 market districts.
                </p>
                <p
                  className="font-body text-[18px] leading-[1.7] mt-5"
                  style={{ color: 'var(--navy-60)' }}
                >
                  I work with clients from 30+ countries — from first-time importers in Germany
                  to established sellers in Australia. My average response time on WhatsApp is
                  under 3 hours, even on weekends. I use professional translation tools to ensure
                  every product spec, price, and instruction is accurate — so nothing gets lost
                  in translation. My clients trust me because I show them exactly what I see:
                  real-time photos, detailed comparison sheets, and honest cost breakdowns. No
                  surprises, no shortcuts — just transparent work as your eyes and hands in Yiwu.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div
              ref={highlightsRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16 max-w-[900px]"
            >
              {highlights.map((h) => (
                <div
                  key={h.text}
                  className="highlight-item flex items-center gap-4 p-5 rounded-2xl"
                  style={{ background: 'var(--navy-8)' }}
                >
                  <h.icon size={28} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                  <span className="font-body text-[15px] leading-[1.5]" style={{ color: 'var(--navy)' }}>
                    {h.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Market photo */}
            <div className="mt-16 rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/eric-market.jpg"
                alt="Eric at Yiwu International Trade Market"
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  )
}
