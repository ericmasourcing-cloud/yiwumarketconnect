import { MessageCircle, Mail, Clock, MapPin } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const quickLinks = ['Home', 'Why Yiwu', 'Services', 'Categories', 'Process', 'About', 'Contact']
const serviceLinks = ['Product Sourcing', 'Supplier Verification', 'Quality Check', 'Sample Collection', 'Custom Packaging', 'Shipping Support']

export default function Footer() {
  const footerRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.footer-col',
    stagger: 0.05,
    y: 30,
    duration: 0.6,
  })

  const handleLinkClick = (link: string) => {
    const map: Record<string, string> = {
      'Home': '#',
      'Why Yiwu': '#why-yiwu',
      'Services': '#services',
      'Categories': '#categories',
      'Process': '#process',
      'About': '#about',
      'Contact': '#contact',
    }
    const href = map[link]
    if (href) {
      const el = document.querySelector(href)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      className="relative"
      style={{
        zIndex: 10,
        background: 'linear-gradient(135deg, var(--footer-start) 0%, var(--footer-end) 100%)',
      }}
    >
      <div ref={footerRef} className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-10 relative" style={{ zIndex: 11 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Brand */}
          <div className="footer-col">
            <p className="font-display text-[18px] font-medium text-white">
              YiwuMarket<span style={{ color: 'var(--orange)' }}>Connect</span>
            </p>
            <p className="font-body text-[14px] mt-3 max-w-[240px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Your eyes & hands in Yiwu Market. Personal sourcing for small businesses since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <p className="font-display text-[14px] font-medium text-white uppercase tracking-[0.1em] mb-4">
              Quick Links
            </p>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleLinkClick(link)}
                  className="font-body text-[15px] text-left transition-colors duration-300 hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="footer-col">
            <p className="font-display text-[14px] font-medium text-white uppercase tracking-[0.1em] mb-4">
              Services
            </p>
            <div className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <span
                  key={link}
                  className="font-body text-[15px]"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {link}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <p className="font-display text-[14px] font-medium text-white uppercase tracking-[0.1em] mb-4">
              Get in Touch
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: MessageCircle, text: '+86 186 8606 2666' },
                { icon: Mail, text: 'ericma.sourcing@gmail.com' },
                { icon: Clock, text: 'Mon–Sat, 9:00–18:00 (GMT+8)' },
                { icon: MapPin, text: 'Yiwu International Trade City, Zhejiang, China' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2">
                  <item.icon size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <span className="font-body text-[15px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 md:my-12 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © 2025 YiwuMarketConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-4 relative" style={{ zIndex: 20, pointerEvents: 'auto' }}>
            {/* Social Icons */}
            <a
              href="https://www.facebook.com/EricYiwuSourcing/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:text-white hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.5)', pointerEvents: 'auto' }}
              title="Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/eric.yiwu.sourcing/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:text-white hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.5)', pointerEvents: 'auto' }}
              title="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@yiwusourcing.eric"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:text-white hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.5)', pointerEvents: 'auto' }}
              title="TikTok"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            {['Privacy', 'Terms'].map((t) => (
              <span
                key={t}
                className="font-body text-[13px] cursor-pointer transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
