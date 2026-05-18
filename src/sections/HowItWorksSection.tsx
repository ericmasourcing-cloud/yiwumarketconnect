import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const steps = [
  {
    number: '1',
    title: 'Send Your Request',
    body: "Tell me what product you're looking for, your target price range, desired quantity, and any quality or design preferences. Photos or reference links help a lot.",
  },
  {
    number: '2',
    title: 'I Source & Compare',
    body: 'I visit the market, check 5–10 relevant suppliers, collect real product photos and samples, and send you a comparison report with MOQ, price, and lead time.',
  },
  {
    number: '3',
    title: 'You Choose & Confirm',
    body: 'Review the options, pick your preferred supplier. I help confirm the order, discuss custom packaging or logo printing, and verify the final quotation.',
  },
  {
    number: '4',
    title: 'I Inspect & Ship',
    body: 'Before the goods leave the factory, I do a quality check. Then I coordinate with the freight forwarder to get your shipment on its way.',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.step-card',
    stagger: 0.15,
    y: 40,
  })

  return (
    <section id="process" style={{ background: 'var(--beige)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="HOW IT WORKS" />
        <h2
          className="font-display font-medium mt-4"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          From Idea to Shipment in 4 Steps
        </h2>

        <div className="relative mt-16">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-0 border-t-2 border-dashed"
            style={{ borderColor: 'var(--navy-15)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step) => (
              <div key={step.number} className="step-card flex flex-col items-center text-center relative">
                {/* Step number circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-[20px] font-medium text-white relative z-10 flex-shrink-0"
                  style={{ background: 'var(--orange)' }}
                >
                  {step.number}
                </div>
                <h4
                  className="font-display text-[22px] font-medium mt-6"
                  style={{ color: 'var(--navy)' }}
                >
                  {step.title}
                </h4>
                <p
                  className="font-body text-[16px] mt-3 leading-[1.6]"
                  style={{ color: 'var(--navy-60)' }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
