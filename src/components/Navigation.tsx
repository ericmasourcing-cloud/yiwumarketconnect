import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Services', href: '/services' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[50] h-[72px] flex items-center transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(248, 246, 243, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--navy-8)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-[20px] font-medium tracking-[-0.01em]"
            style={{ color: 'var(--navy)' }}
          >
            YiwuMarket<span style={{ color: 'var(--orange)' }}>Connect</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative font-display text-[14px] font-medium transition-colors duration-300"
                style={{ color: isActive(link.href, link.exact) ? 'var(--navy)' : 'rgba(10, 37, 64, 0.55)' }}
              >
                {link.label}
                {isActive(link.href, link.exact) && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                    style={{ background: 'var(--orange)' }}
                  />
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className="font-display text-[14px] font-medium px-5 py-2.5 rounded-xl text-white transition-all duration-300 hover:-translate-y-[1px]"
              style={{ background: 'var(--orange)' }}
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
            </Link>
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
        <div className="flex flex-col items-center justify-center h-full gap-6 pt-20">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-[26px] font-medium"
              style={{ color: isActive(link.href, link.exact) ? 'var(--orange)' : 'var(--navy)' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 font-display text-[18px] font-medium px-8 py-4 rounded-xl text-white"
            style={{ background: 'var(--orange)' }}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </>
  )
}
