import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    number: 75000,
    suffix: '+',
    label: 'Booths & Stalls',
    description: 'From toys to pet supplies, giftware to home decor — all in one city.',
  },
  {
    number: 2100000,
    suffix: '+',
    label: 'Products Available',
    description: 'More SKUs than most online marketplaces — and you can touch them all.',
  },
  {
    number: 14000000,
    suffix: '㎡',
    label: 'Market Space',
    description: 'Five massive districts. I walk them every week so you don\'t have to.',
  },
]

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numberRef.current) return
    const obj = { value: 0 }
    const tween = gsap.to(obj, {
      value: stat.number,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: numberRef.current,
        start: 'top 85%',
        once: true,
      },
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.floor(obj.value).toLocaleString() + stat.suffix
        }
      },
    })
    return () => { tween.kill() }
  }, [stat.number, stat.suffix])

  return (
    <div
      className="bg-white rounded-2xl p-8 md:p-10 border transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: 'var(--navy-15)',
        boxShadow: '0 8px 32px rgba(10, 37, 64, 0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(10, 37, 64, 0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(10, 37, 64, 0.08)'
      }}
    >
      <span
        ref={numberRef}
        className="font-display font-medium block"
        style={{
          fontSize: 'clamp(48px, 4vw, 96px)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'var(--orange)',
        }}
      >
        0{stat.suffix}
      </span>
      <h4
        className="font-display text-[24px] font-medium mt-3"
        style={{ color: 'var(--navy)' }}
      >
        {stat.label}
      </h4>
      <p
        className="font-body text-[16px] mt-2 leading-[1.6]"
        style={{ color: 'var(--navy-60)' }}
      >
        {stat.description}
      </p>
    </div>
  )
}

export default function WhyYiwuSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.reveal-child',
    stagger: 0.15,
  })

  return (
    <section
      id="why-yiwu"
      className="relative"
      style={{ background: 'var(--warm-white)' }}
    >
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="WHY YIWU MARKET" />
        <h2
          className="reveal-child font-display font-medium mt-4 max-w-[600px]"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          The World's Largest Small-Product Market
        </h2>

        <div className="reveal-child grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <p
          className="reveal-child font-body text-[18px] leading-[1.7] max-w-[720px] mx-auto mt-12 text-center"
          style={{ color: 'var(--navy-60)' }}
        >
          Yiwu Market isn't a website — it's a physical city of products. You can't compare prices online because most suppliers don't list publicly. That's why having someone on the ground matters. I spend 5 days a week at the market and supplier factories, comparing real samples, negotiating face-to-face, and checking production quality in person. I find options that match your budget and quality needs — so you don't have to fly to China to know what you're getting.
        </p>
      </div>
    </section>
  )
}
