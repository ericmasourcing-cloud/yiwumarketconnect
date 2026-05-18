import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  y?: number
  x?: number
  opacity?: number
  duration?: number
  stagger?: number
  delay?: number
  once?: boolean
  start?: string
  childSelector?: string
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.6,
      stagger = 0.08,
      delay = 0,
      once = true,
      start = 'top 85%',
      childSelector,
    } = options

    const targets = childSelector ? el.querySelectorAll(childSelector) : el

    gsap.set(targets, { y, x, opacity })

    const tween = gsap.to(targets, {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [])

  return ref
}
