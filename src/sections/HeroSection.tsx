import { useRef, useEffect, useState } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import gsap from 'gsap'

interface HeroSectionProps {
  onHeroVisible?: (visible: boolean) => void
}

export default function HeroSection({ onHeroVisible }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!onHeroVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => onHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [onHeroVisible])

  useEffect(() => {
    if (!loaded) return

    const tl = gsap.timeline()

    tl.to(badgeRef.current, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1,
    })

    const lines = headlineRef.current?.querySelectorAll('.headline-line')
    if (lines) {
      lines.forEach((line, i) => {
        tl.to(line, {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, 0.3 + i * 0.15)
      })
    }

    tl.to(subRef.current, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    }, 0.9)

    const ctas = ctaRef.current?.children
    if (ctas) {
      Array.from(ctas).forEach((cta, i) => {
        tl.to(cta, {
          opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        }, 1.1 + i * 0.1)
      })
    }

    const statItems = statsRef.current?.children
    if (statItems) {
      Array.from(statItems).forEach((item, i) => {
        tl.to(item, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
        }, 1.3 + i * 0.1)
      })
    }

    tl.fromTo(visualRef.current,
      { opacity: 0, scale: 0.95, rotateY: -8 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: 'power2.out' },
      0.6
    )

    return () => { tl.kill() }
  }, [loaded])

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-pattern-dots"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--gold-light) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--ksa-green-light) 0%, transparent 70%)' }}
      />

      <div className="relative z-[2] w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-[120px] lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border opacity-0 translate-y-[10px] mb-6"
              style={{
                background: 'var(--ksa-green-light)',
                borderColor: 'rgba(0, 108, 53, 0.2)',
              }}
            >
              <span className="text-base">🇸🇦</span>
              <span className="font-body text-[14px] font-medium" style={{ color: 'var(--ksa-green)' }}>
                Yiwu-based wholesale supplier · For Saudi buyers
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef} className="space-y-0">
              <h1
                className="headline-line font-display font-medium opacity-0"
                style={{
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: 'var(--navy)',
                  clipPath: 'inset(0 100% 0 0)',
                }}
              >
                <span>Yiwu Event &</span><br />
                <span>Seasonal Supplies</span><br />
                <span style={{ color: 'var(--ksa-green)' }}>for Saudi Buyers</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p
              ref={subRef}
              className="font-body text-[18px] leading-[1.7] max-w-[520px] mt-6 opacity-0 translate-y-[20px]"
              style={{ color: 'var(--navy-60)' }}
            >
              Selected party, Eid, Ramadan, Saudi National Day and seasonal event products from Yiwu market for importers, party shops, retailers and event businesses.
            </p>

            {/* CTA Group */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="#inquiry"
                className="group inline-flex items-center justify-center gap-2 font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300 opacity-0 translate-y-[15px]"
                style={{ background: 'var(--ksa-green)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ksa-green-dark)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 108, 53, 0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--ksa-green)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Send Inquiry
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://wa.me/8618686062666"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-display text-[16px] font-medium px-8 py-[14px] rounded-xl transition-all duration-300 opacity-0 translate-y-[15px]"
                style={{
                  background: 'var(--pure-white)',
                  border: '1.5px solid var(--navy-15)',
                  color: 'var(--navy)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--beige)'
                  e.currentTarget.style.borderColor = 'var(--navy-40)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--pure-white)'
                  e.currentTarget.style.borderColor = 'var(--navy-15)'
                }}
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Trust Micro-Bar */}
            <div ref={statsRef} className="flex flex-wrap gap-8 mt-12">
              {[
                { value: 'Yiwu', label: 'Market-based product supply' },
                { value: 'KSA', label: 'Saudi-focused event categories' },
                { value: 'MOQ', label: 'Checked by item and packing' },
              ].map((item) => (
                <div
                  key={item.value}
                  className="flex flex-col opacity-0 translate-y-[10px]"
                >
                  <span
                    className="font-display text-[18px] font-bold tracking-tight"
                    style={{ color: 'var(--ksa-green)' }}
                  >
                    {item.value}
                  </span>
                  <span className="font-body text-[13px] mt-0.5" style={{ color: 'var(--navy-60)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div
            ref={visualRef}
            className="order-1 lg:order-2 relative opacity-0"
            style={{ perspective: '1000px' }}
          >
            <div className="relative">
              <div
                className="relative rounded-[32px] overflow-hidden border shadow-2xl"
                style={{
                  borderColor: 'var(--navy-8)',
                  boxShadow: '0 32px 80px rgba(10, 37, 64, 0.18)',
                }}
              >
                <img
                  src="/images/cat-toys.jpg"
                  alt="Yiwu event supplies wholesale"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,37,64,0.4)] to-transparent" />
              </div>

              {/* Floating card 1 */}
              <div
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border animate-float"
                style={{ borderColor: 'var(--navy-8)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: 'var(--ksa-green-light)' }}
                  >
                    🌙
                  </div>
                  <div>
                    <p className="font-display text-[15px] font-medium" style={{ color: 'var(--navy)' }}>
                      Eid & Ramadan
                    </p>
                    <p className="font-body text-[13px]" style={{ color: 'var(--navy-60)' }}>
                      Decorations ready
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card 2 */}
              <div
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border animate-float"
                style={{ borderColor: 'var(--navy-8)', animationDelay: '1s' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: 'var(--gold-light)' }}
                  >
                    🎈
                  </div>
                  <div>
                    <p className="font-display text-[15px] font-medium" style={{ color: 'var(--navy)' }}>
                      Party Supplies
                    </p>
                    <p className="font-body text-[13px]" style={{ color: 'var(--navy-60)' }}>
                      Mixed MOQ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
