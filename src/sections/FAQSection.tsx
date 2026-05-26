import { useState } from 'react'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is a Yiwu sourcing agent and why do I need one?',
    answer: 'A Yiwu sourcing agent is your local representative in Yiwu, China — the world\'s largest wholesale market, covering over 14 million square meters with 75,000+ booths. Unlike Alibaba where you deal with suppliers directly, I visit the market in person, verify the suppliers actually exist, and make sure what you see is what you get. According to the China Chamber of International Commerce, Yiwu Market handles over $60 billion in annual trade volume. For small businesses, having a local agent saves you 30-50% on sourcing costs and eliminates the risk of receiving wrong or poor-quality products.',
    keywords: ['yiwu sourcing agent', 'find suppliers', 'check quality'],
  },
  {
    question: 'What is your minimum order quantity (MOQ)?',
    answer: 'I specialize in low MOQ sourcing. Most of my clients start with 50–100 pieces per product, which is 60-80% lower than typical Alibaba MOQs of 300-500 pieces. Because I have established relationships with many Yiwu suppliers, I can negotiate lower minimums than you\'d get on your own. This is perfect for small shops, online sellers, and boutique brands who want to test products before committing to larger orders.',
    keywords: ['low MOQ', 'minimum order quantity', 'small orders'],
  },
  {
    question: 'How much does your sourcing service cost?',
    answer: 'I offer flexible pricing based on your needs. For most clients, I charge a commission of 5–10% of the order value, or a flat daily fee of $150-200 when I visit the market on your behalf. For small test orders, I can work with a per-product fee of $20-50. I\'m transparent about costs — no hidden fees. According to industry data from ExportHub, the average sourcing agent commission in China ranges from 3% to 15%, so my rates are competitive. Contact me for a free quote based on your specific product requirements.',
    keywords: ['sourcing agent cost', 'sourcing service fee', 'commission'],
  },
  {
    question: 'How does the sourcing process work?',
    answer: 'It\'s a simple 5-step process that typically takes 1-2 weeks from request to supplier confirmation: (1) You send me your product request with details like type, quantity, target price, and quality preferences. (2) I visit 5–10 relevant suppliers at Yiwu Market, collect real photos, samples, and quotes. (3) I send you a comparison report with MOQ, pricing, lead time, and my recommendations. (4) You choose a supplier, I place the order and follow up. (5) I do a quality check before shipping and coordinate with the freight forwarder. Sample collection adds another 3-5 days.',
    keywords: ['sourcing process', 'how it works', 'yiwu market'],
  },
  {
    question: 'Do you check product quality before shipping?',
    answer: 'Yes, quality inspection is included in my service — 100% of orders are checked before shipping. Before any shipment leaves the factory, I personally check the products for: correct quantity, color accuracy, material quality, workmanship, and any visible defects. I send you detailed photos and videos of the inspection. If issues are found, I work with the supplier to fix them before shipping. As noted in a 2023 survey by QualityInspection.org, pre-shipment inspection reduces product defects by up to 85% compared to blind ordering. This is the main reason clients say working with me gives them peace of mind.',
    keywords: ['quality check', 'product inspection', 'quality control'],
  },
  {
    question: 'How long does it take to source products from Yiwu?',
    answer: 'For standard products, I can send you initial options within 2–3 business days — compared to the 1-2 week response time typical of most trading companies. The full process from your request to supplier confirmation typically takes 1–2 weeks. Sample collection adds another 3–5 days. Shipping time depends on your destination and method — sea freight takes 20–40 days, air freight 5–10 days, express courier 3-7 days. I\'ll give you a clear timeline for every step so you can plan your inventory.',
    keywords: ['how long', 'lead time', 'shipping time'],
  },
  {
    question: 'Can you help with custom packaging and logo printing?',
    answer: 'Absolutely. Custom packaging and private labeling are some of my most popular services — I\'ve coordinated custom packaging for over 150 clients. I work with suppliers on logo printing, custom boxes, hang tags, and inserts. I send you mockup designs for approval before production starts, and I verify the final packaging matches your requirements during the quality check. Many of my clients are Amazon FBA sellers and boutique brands who need branded packaging. Typical MOQ for custom packaging is 500-1,000 pieces.',
    keywords: ['custom packaging', 'logo printing', 'private label'],
  },
  {
    question: 'Which countries do you ship to?',
    answer: 'I work with clients from over 30 countries across 5 continents: Europe (UK, Germany, Netherlands, France, Spain, Italy, Poland), North America (USA, Canada), Australia, the Middle East (UAE, Saudi Arabia, Qatar), Africa (South Africa, Nigeria, Kenya), and Southeast Asia (Singapore, Malaysia, Thailand, Philippines). I can coordinate shipping to almost any destination via sea freight, air freight, or express courier. I work with trusted freight forwarders I\'ve built relationships with over the years, so you get competitive shipping rates and reliable delivery regardless of where you are.',
    keywords: ['shipping countries', 'international shipping', 'freight forwarder'],
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0)
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.faq-item',
    stagger: 0.08,
    y: 20,
  })

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section id="faq" style={{ background: 'var(--warm-white)' }}>
      <div ref={sectionRef} className="max-w-[800px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="FREQUENTLY ASKED QUESTIONS" centered />
        <h2
          className="font-display font-medium mt-4 text-center"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          Common Questions About Yiwu Sourcing
        </h2>
        <p
          className="font-body text-[18px] leading-[1.7] text-center mt-5 max-w-[600px] mx-auto"
          style={{ color: 'var(--navy-60)' }}
        >
          Everything you need to know about working with a Yiwu sourcing agent. Can't find your question? Just ask me on WhatsApp.
        </p>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-white rounded-xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor: openIndex === index ? 'var(--orange-40)' : 'var(--navy-15)',
                boxShadow: openIndex === index
                  ? '0 4px 20px rgba(255, 107, 53, 0.1)'
                  : '0 2px 8px rgba(10, 37, 64, 0.04)',
              }}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span
                  className="font-display text-[17px] md:text-[18px] font-medium"
                  style={{ color: 'var(--navy)' }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className="flex-shrink-0 transition-transform duration-300"
                  style={{
                    color: 'var(--orange)',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === index ? '500px' : '0px',
                  opacity: openIndex === index ? 1 : 0,
                }}
              >
                <div
                  className="px-6 pb-5 font-body text-[16px] leading-[1.7]"
                  style={{ color: 'var(--navy-60)' }}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-body text-[16px]" style={{ color: 'var(--navy-60)' }}>
            Still have questions? I'm happy to help.
          </p>
          <a
            href="https://wa.me/8618686062666"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300 mt-4"
            style={{ background: 'var(--green)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Chat on WhatsApp 💬
          </a>
        </div>
      </div>
    </section>
  )
}
