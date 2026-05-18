import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useActiveSection } from '@/hooks/useActiveSection'

const NAV_LINKS = [
  { label: 'Why Yiwu', href: '#why-yiwu' },
  { label: 'Services', href: '#services' },
  { label: 'Categories', href: '#categories' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      const offset = 72
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-shadow duration-300"
        style={{
          background: 'rgba(248, 246, 243, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(10, 37, 64, 0.08)',
          boxShadow: scrolled ? '0 2px 16px rgba(10, 37, 64, 0.06)' : 'none',
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] md:h-[72px] px-6 md:px-12">
          {/* Logo */}
          <a href="#" className="font-display text-[20px] font-medium tracking-[-0.01em]" style={{ color: 'var(--navy)' }}>
            YiwuMarket<span style={{ color: 'var(--orange)' }}>Connect</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="relative font-display text-[15px] font-medium transition-colors duration-300"
                  style={{ color: isActive ? 'var(--navy)' : 'rgba(10, 37, 64, 0.6)' }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full"
                      style={{ background: 'var(--orange)' }}
                    />
                  )}
                </button>
              )
            })}
            <button
              onClick={() => handleNavClick('#contact')}
              className="font-display text-[16px] font-medium px-6 py-3 rounded-xl text-white transition-all duration-300 hover:-translate-y-[1px]"
              style={{
                background: 'var(--orange)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E55A2B'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--orange)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} style={{ color: 'var(--navy)' }} /> : <Menu size={24} style={{ color: 'var(--navy)' }} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 z-[99] lg:hidden transition-transform duration-[400ms] ease-out"
        style={{
          background: 'var(--warm-white)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-display text-[28px] font-medium"
              style={{ color: 'var(--navy)' }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#contact')}
            className="mt-4 font-display text-[18px] font-medium px-8 py-4 rounded-xl text-white"
            style={{ background: 'var(--orange)' }}
          >
            Get a Quote
          </button>
        </div>
      </div>
    </>
  )
}
