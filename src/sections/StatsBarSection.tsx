import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '@/hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { number: 30, suffix: '+', label: 'Countries', sub: 'Served Worldwide' },
  { number: 5, suffix: '+', label: 'Years', sub: 'In Yiwu Market' },
  { number: 500, suffix: '+', label: 'Products', sub: 'Sourced & Delivered' },
  { number: 100, suffix: '%', label: 'Orders', sub: 'Quality Checked' },
]

function AnimatedNumber({ number, suffix }: { number: number; suffix: string }) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numRef.current) return
    const obj = { value: 0 }
    const tween = gsap.to(obj, {
      value: number,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: numRef.current,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = Math.floor(obj.value).toLocaleString() + suffix
        }
      },
    })
    return () => { tween.kill() }
  }, [number, suffix])

  return (
    <span
      ref={numRef}
      className="font-display font-bold"
      style={{
        fontSize: 'clamp(40px, 5vw, 72px)',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        color: 'var(--orange)',
      }}
    >
      {number.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatsBarSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.stat-item',
    stagger: 0.12,
  })

  return (
    <section style={{ background: 'var(--navy)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12 py-[50px] md:py-[60px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-item text-center relative flex flex-col items-center justify-center py-4"
            >
              <AnimatedNumber number={stat.number} suffix={stat.suffix} />
              <p
                className="font-display text-[17px] font-medium mt-2 tracking-wide"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {stat.label}
              </p>
              <p className="font-body text-[14px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {stat.sub}
              </p>

              {index < stats.length - 1 && (
                <div
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-[60%]"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
