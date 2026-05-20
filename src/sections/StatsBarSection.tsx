import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const stats = [
  {
    number: 30,
    suffix: '+',
    label: 'Countries Served',
    description: 'Europe, Americas, Middle East, Africa & Asia',
  },
  {
    number: 5,
    suffix: '+',
    label: 'Years Experience',
    description: 'In Yiwu Market since 2018',
  },
  {
    number: 500,
    suffix: '+',
    label: 'Products Sourced',
    description: 'Across all categories',
  },
  {
    number: 24,
    suffix: 'h',
    label: 'Response Time',
    description: 'Always fast reply',
  },
  {
    number: 100,
    suffix: '%',
    label: 'Quality Checked',
    description: 'Before every shipment',
  },
  {
    number: 50,
    suffix: '-100',
    label: 'Pieces MOQ',
    description: 'Low minimum orders',
  },
]

gsap.registerPlugin(ScrollTrigger)

function AnimatedNumber({ stat }: { stat: typeof stats[0] }) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numRef.current) return
    const obj = { value: 0 }
    const tween = gsap.to(obj, {
      value: stat.number,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: numRef.current,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = Math.floor(obj.value).toLocaleString() + stat.suffix
        }
      },
    })
    return () => { tween.kill() }
  }, [stat.number, stat.suffix])

  return (
    <span
      ref={numRef}
      className="font-display font-medium block"
      style={{
        fontSize: 'clamp(36px, 4vw, 64px)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        color: 'var(--orange)',
      }}
    >
      0{stat.suffix}
    </span>
  )
}

export default function StatsBarSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.stat-item',
    stagger: 0.1,
  })

  return (
    <section style={{ background: 'var(--beige)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12 py-[60px] md:py-[80px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <AnimatedNumber stat={stat} />
              <p
                className="font-display text-[16px] font-medium mt-2"
                style={{ color: 'var(--navy)' }}
              >
                {stat.label}
              </p>
              <p
                className="font-body text-[13px] mt-1"
                style={{ color: 'var(--navy-60)' }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
