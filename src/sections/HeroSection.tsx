import { useRef, useEffect, useState } from 'react'
import { Shield, Eye, Package, ChevronDown } from 'lucide-react'
import gsap from 'gsap'

interface HeroSectionProps {
  onHeroVisible: (visible: boolean) => void
}

export default function HeroSection({ onHeroVisible }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
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

    const trustItems = trustRef.current?.children
    if (trustItems) {
      Array.from(trustItems).forEach((item, i) => {
        tl.to(item, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
        }, 1.4 + i * 0.1)
      })
    }

    return () => { tl.kill() }
  }, [loaded])

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden"
    >
      <div className="relative z-[2] max-w-[560px] px-6 md:px-12 lg:ml-[5%] pt-[100px] md:pt-0">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border opacity-0 translate-y-[10px] mb-6"
          style={{
            background: 'var(--navy-4)',
            borderColor: 'var(--navy-15)',
          }}
        >
          <span className="text-base">🇨🇳</span>
          <span className="font-body text-[14px]" style={{ color: 'var(--navy-60)' }}>
            Yiwu Market Sourcing Agent · Based in China Since 2018
          </span>
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="space-y-0">
          <h1
            className="headline-line font-display font-medium opacity-0"
            style={{
              fontSize: 'clamp(40px, 5vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--navy)',
              clipPath: 'inset(0 100% 0 0)',
            }}
          >
            Your Eyes &
          </h1>
          <h1
            className="headline-line font-display font-medium opacity-0"
            style={{
              fontSize: 'clamp(40px, 5vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--navy)',
              clipPath: 'inset(0 100% 0 0)',
            }}
          >
            Hands in
          </h1>
          <h1
            className="headline-line font-display font-medium opacity-0"
            style={{
              fontSize: 'clamp(40px, 5vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--orange)',
              clipPath: 'inset(0 100% 0 0)',
            }}
          >
            Yiwu Market
          </h1>
        </div>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="font-body text-[18px] leading-[1.7] max-w-[480px] mt-6 opacity-0 translate-y-[20px]"
          style={{ color: 'var(--navy-60)' }}
        >
          I help small shops, online sellers, and boutique brands find the right products at Yiwu Market — with low MOQ, honest pricing, and real quality checks.
        </p>

        {/* CTA Group */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mt-10">
          <a
            href="#contact"
            className="inline-flex items-center justify-center font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300 opacity-0 translate-y-[15px]"
            style={{
              background: 'var(--orange)',
            }}
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
            Send Inquiry →
          </a>
          <a
            href="https://wa.me/8618686062666"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-display text-[16px] font-medium px-8 py-[14px] rounded-xl transition-all duration-300 opacity-0 translate-y-[15px]"
            style={{
              background: 'var(--pure-white)',
              border: '1.5px solid var(--navy-15)',
              color: 'var(--navy)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--navy-4)'
              e.currentTarget.style.borderColor = 'var(--navy-40)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--pure-white)'
              e.currentTarget.style.borderColor = 'var(--navy-15)'
            }}
          >
            Chat on WhatsApp 💬
          </a>
        </div>

        {/* Trust Micro-Bar */}
        <div ref={trustRef} className="flex flex-wrap gap-6 md:gap-8 mt-12">
          {[
            { icon: Shield, color: 'var(--green)', text: 'Verified Suppliers' },
            { icon: Eye, color: 'var(--blue)', text: 'In-Person Checks' },
            { icon: Package, color: 'var(--orange)', text: 'Low MOQ' },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 opacity-0 translate-y-[10px]"
            >
              <item.icon size={16} style={{ color: item.color }} />
              <span className="font-body text-[14px]" style={{ color: 'var(--navy-60)' }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]">
        <a href="#why-yiwu" className="animate-bounce-chevron inline-block">
          <ChevronDown size={20} style={{ color: 'var(--navy-40)' }} />
        </a>
      </div>

      {/* Loading indicator */}
      {!loaded && (
        <div className="absolute bottom-8 right-8 z-[2]">
          <div
            className="animate-pulse-loader w-3 h-3 rounded-full"
            style={{ background: 'var(--orange)' }}
          />
        </div>
      )}
    </section>
  )
}
