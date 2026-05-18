import { useEffect, useRef, useState } from 'react'

const SECTION_IDS = ['why-yiwu', 'services', 'categories', 'process', 'about', 'contact']
const NAV_OFFSET = 100

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2 + NAV_OFFSET

      let current = ''
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) {
          current = id
        }
      }
      setActiveSection(current)
    }

    const throttledScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        handleScroll()
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return activeSection
}
