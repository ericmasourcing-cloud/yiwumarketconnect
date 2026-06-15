import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Do you supply Eid and Ramadan decorations for Saudi buyers?',
    answer: 'Yes. We collect lantern-style decor, banners, table decor, gift display pieces and seasonal shop decorations from Yiwu market for Saudi importers, retailers and event businesses.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer: 'MOQ depends on the item and packing. Many decorations and party supplies can start from a few cartons per SKU. We check MOQ, packing details and customization options before quotation.',
  },
  {
    question: 'Can you help with custom packaging or logo printing?',
    answer: 'Yes. We coordinate with suppliers on logo printing, custom balloons, branded packaging and event giveaways. We send mockups and confirm samples before production.',
  },
  {
    question: 'How long does sourcing take?',
    answer: 'For standard event supplies, we can send category options and item lists within 2-3 days. Full quotation with MOQ, packing and samples typically takes 1-2 weeks.',
  },
  {
    question: 'Do you check product quality before shipping?',
    answer: 'Yes. We do a basic quality inspection before every shipment, checking quantity, colors, materials and obvious defects. We send photos and videos so you can see the products before they leave China.',
  },
  {
    question: 'Which destinations do you ship to?',
    answer: 'We primarily serve Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman. We can coordinate sea freight, air freight or express depending on your order size and timeline.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />
      <main className="pt-[120px] pb-[80px]">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="font-body text-[14px] font-medium tracking-wider" style={{ color: 'var(--ksa-green)' }}>
              FAQ
            </span>
            <h1
              className="font-display font-medium mt-3"
              style={{
                fontSize: 'clamp(36px, 4vw, 64px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--navy)',
              }}
            >
              Common questions
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border overflow-hidden transition-all duration-300"
                style={{
                  borderColor: openIndex === index ? 'var(--ksa-green)' : 'var(--navy-8)',
                  boxShadow: openIndex === index
                    ? '0 4px 20px rgba(0, 108, 53, 0.1)'
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
                      color: 'var(--ksa-green)',
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openIndex === index ? '300px' : '0px',
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

          <div className="mt-12 text-center">
            <p className="font-body text-[16px]" style={{ color: 'var(--navy-60)' }}>
              Still have questions? We are happy to help.
            </p>
            <a
              href="https://wa.me/8618686062666"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300 mt-4"
              style={{ background: 'var(--ksa-green)' }}
            >
              Chat on WhatsApp 💬
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
