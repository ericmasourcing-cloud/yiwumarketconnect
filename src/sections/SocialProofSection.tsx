import { useState, useEffect } from 'react'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ChevronLeft, ChevronRight, Star, Download, CheckCircle } from 'lucide-react'

const testimonials = [
  {
    quote: "I was ready to give up on finding a low-MOQ supplier for my toy shop when a fellow seller recommended Eric. Within 3 days, he sent me photos from 8 different suppliers with detailed comparison sheets. I ended up choosing one with a MOQ of just 100 pieces — that's 70% lower than the 300-piece minimum I kept hitting on Alibaba. Over the past year, I've placed 3 repeat orders and my return rate is under 2%. He's now my go-to for every new product launch.",
    name: 'Sarah K.',
    role: 'Toy Store Owner',
    location: 'Hamburg, Germany',
    initials: 'SK',
    rating: 5,
  },
  {
    quote: "I'll be honest — I was skeptical about sending money to someone in China I'd never met. But Eric changed my mind. He was incredibly responsive on WhatsApp, usually replying within 2 hours even on weekends. He showed me exactly what the supplier charged ($2.40 per unit) versus his fee (8% commission), so there were no surprises. The samples he collected matched his video descriptions perfectly. He saved me a 15-hour flight to Yiwu and probably $3,000 in travel costs. Worth every penny.",
    name: 'Marcus T.',
    role: 'Online Seller (eBay & Etsy)',
    location: 'Amsterdam, Netherlands',
    initials: 'MT',
    rating: 5,
  },
  {
    quote: "We needed custom gift boxes with our logo for our boutique shop in Tokyo. Eric handled the back-and-forth with the supplier for three rounds of mockups — each time sending me high-res photos and a 3-minute video walkthrough within 24 hours. When the final boxes arrived, the color match was 95% accurate to my Pantone spec. He caught a minor alignment issue during his pre-shipment inspection that I would have completely missed. That attention to detail is why I keep working with him.",
    name: 'Aiko N.',
    role: 'Boutique Gift Shop Owner',
    location: 'Tokyo, Japan',
    initials: 'AN',
    rating: 5,
  },
  {
    quote: "As a first-time importer with zero experience, I was overwhelmed. Eric walked me through the entire process step by step — from finding pet product suppliers to understanding Incoterms and shipping costs. He sent me a detailed cost breakdown before I committed to anything: product cost $1,200, shipping $340, his commission $96. Total transparency. After 6 months and 4 successful orders, he's saved me at least $2,000 compared to the quotes I was getting from trading companies directly.",
    name: 'David R.',
    role: 'Pet Shop Owner',
    location: 'Melbourne, Australia',
    initials: 'DR',
    rating: 5,
  },
]

const guideBenefits = [
  'Step-by-step guide to buying from Yiwu Market',
  'How to avoid scams and bad suppliers',
  'Understanding MOQ, pricing & negotiation',
  'Shipping options: sea vs. air vs. express',
  'Quality inspection checklist you can use',
]

export default function SocialProofSection() {
  const [current, setCurrent] = useState(0)
  const leadRef = useScrollReveal<HTMLDivElement>({ y: 40 })

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((current + 1) % testimonials.length)

  return (
    <section id="reviews" style={{ background: 'var(--beige)' }}>
      {/* Testimonials */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-[80px] md:pt-[120px]">
        <SectionLabel text="CLIENT REVIEWS" centered />
        <h2
          className="font-display font-medium mt-4 text-center"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          Trusted by Small Business Owners Worldwide
        </h2>
        <p
          className="font-body text-[18px] leading-[1.7] text-center mt-4 max-w-[600px] mx-auto"
          style={{ color: 'var(--navy-60)' }}
        >
          Don't just take my word for it — here's what my clients say about working with me.
        </p>

        {/* Carousel */}
        <div className="relative mt-12 max-w-[800px] mx-auto">
          <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: 'var(--navy-15)' }}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 p-8 md:p-12"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} size={18} fill="var(--orange)" style={{ color: 'var(--orange)' }} />
                    ))}
                  </div>
                  <p
                    className="font-body text-[18px] leading-[1.7] italic"
                    style={{ color: 'var(--navy-60)' }}
                  >
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-display text-[16px] font-medium text-white flex-shrink-0"
                      style={{ background: 'var(--navy)' }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-display text-[16px] font-medium" style={{ color: 'var(--navy)' }}>
                        {t.name}
                      </p>
                      <p className="font-body text-[14px]" style={{ color: 'var(--navy-60)' }}>
                        {t.role} · {t.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border flex items-center justify-center transition-all duration-300 hover:shadow-lg"
            style={{ borderColor: 'var(--navy-15)' }}
          >
            <ChevronLeft size={20} style={{ color: 'var(--navy)' }} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border flex items-center justify-center transition-all duration-300 hover:shadow-lg"
            style={{ borderColor: 'var(--navy-15)' }}
          >
            <ChevronRight size={20} style={{ color: 'var(--navy)' }} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: i === current ? 'var(--orange)' : 'var(--navy-15)',
                  transform: i === current ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lead Magnet - Free Guide */}
      <div ref={leadRef} className="max-w-[1000px] mx-auto px-6 md:px-12 py-[80px] md:py-[100px]">
        <div
          className="rounded-2xl border overflow-hidden flex flex-col md:flex-row"
          style={{
            background: 'var(--navy)',
            borderColor: 'var(--navy-15)',
          }}
        >
          {/* Left: Content */}
          <div className="flex-1 p-8 md:p-12">
            <SectionLabel text="FREE GUIDE" light />
            <h3
              className="font-display font-medium mt-4 text-white"
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              How to Buy from Yiwu Market: A Beginner's Guide
            </h3>
            <p className="font-body text-[16px] leading-[1.6] mt-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Download this free 15-page guide and learn everything you need to know about sourcing products from Yiwu — even if you've never imported from China before.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              {guideBenefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} style={{ color: 'var(--orange)' }} />
                  <span className="font-body text-[15px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <div
            className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center text-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--orange)' }}
            >
              <Download size={36} className="text-white" />
            </div>
            <p className="font-display text-[20px] font-medium text-white">
              Get the Free Guide
            </p>
            <p className="font-body text-[14px] mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              The complete beginner's roadmap
            </p>
            <a
              href="/yiwu-market-guide.pdf"
              download
              className="inline-flex items-center justify-center font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300 mt-6 w-full max-w-[280px]"
              style={{ background: 'var(--orange)' }}
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
              Download Free PDF →
            </a>
            <p className="font-body text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              17 pages · Instant download · No signup required
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
