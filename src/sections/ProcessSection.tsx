import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { MessageSquare, Search, FileText, PackageCheck, Ship } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    color: 'var(--ksa-green)',
    bg: 'var(--ksa-green-light)',
    title: 'Send Your Request',
    body: 'Tell us your product category, target quantity, destination city and whether you need plain stock or custom packing.',
  },
  {
    icon: Search,
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
    title: 'We Source in Yiwu',
    body: 'We visit booths, collect photos, item numbers and check MOQ and packing details for your target products.',
  },
  {
    icon: FileText,
    color: 'var(--gold)',
    bg: 'var(--gold-light)',
    title: 'Receive Item List & Prices',
    body: 'You get a clear comparison with product photos, specs, MOQ, unit price and estimated lead time.',
  },
  {
    icon: PackageCheck,
    color: 'var(--blue)',
    bg: 'var(--blue-light)',
    title: 'Confirm & Customize',
    body: 'Choose the items you want. We coordinate samples, custom packaging or logo printing before production.',
  },
  {
    icon: Ship,
    color: 'var(--green)',
    bg: 'var(--green-light)',
    title: 'Quality Check & Ship',
    body: 'We do a basic quality check, confirm quantities and help coordinate handoff to your freight forwarder.',
  },
]

export default function ProcessSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.process-step',
    stagger: 0.1,
    y: 40,
  })

  return (
    <section className="relative py-[80px] md:py-[120px]" style={{ background: 'var(--cream)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-[720px] mx-auto">
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
            From Yiwu market to your container
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Connector line - desktop */}
          <div
            className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px]"
            style={{ background: 'var(--navy-8)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="process-step relative flex flex-col items-center text-center"
              >
                <div
                  className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-5 border-4"
                  style={{
                    background: 'var(--pure-white)',
                    borderColor: step.bg,
                  }}
                >
                  <step.icon size={26} style={{ color: step.color }} strokeWidth={2} />
                </div>
                <div
                  className="font-display text-[13px] font-bold tracking-wider mb-2"
                  style={{ color: step.color }}
                >
                  STEP {index + 1}
                </div>
                <h4
                  className="font-display text-[18px] font-medium"
                  style={{ color: 'var(--navy)' }}
                >
                  {step.title}
                </h4>
                <p
                  className="font-body text-[15px] leading-[1.6] mt-2"
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
