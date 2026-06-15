import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    image: '/images/prod-01.png',
    icon: '🌙',
    code: 'ED',
    name: 'Eid & Ramadan Decorations',
    description: 'Hanging decor, table decor, lantern-style items, banners, gift display pieces and seasonal shop decoration items.',
  },
  {
    image: '/images/prod-08.png',
    icon: '🇸🇦',
    code: 'ND',
    name: 'Saudi National Day Supplies',
    description: 'Green-themed decorations, flags, small celebration goods, event props and retail display supplies.',
  },
  {
    image: '/images/prod-04.png',
    icon: '🎈',
    code: 'PD',
    name: 'Party Balloons & Decorations',
    description: 'Balloon sets, banners, hanging decorations, party backdrops and theme decoration kits for shops and events.',
  },
  {
    image: '/images/prod-18.png',
    icon: '🌿',
    code: 'FL',
    name: 'Artificial Flowers & Event Decor',
    description: 'Artificial flowers, greenery panels, decorative branches, table arrangements and venue decoration materials.',
  },
  {
    image: '/images/prod-12.png',
    icon: '🍽️',
    code: 'TW',
    name: 'Party Tableware',
    description: 'Disposable cups, plates, napkins, table covers, serving items and coordinated party table supplies.',
  },
  {
    image: '/images/prod-22.png',
    icon: '🎁',
    code: 'EG',
    name: 'Event Giveaway Gifts',
    description: 'Small promotional gifts, party favors, kids event gifts, retail add-on items and seasonal giveaway products.',
  },
]

export default function CategoriesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.cat-card',
    stagger: 0.08,
    y: 50,
  })

  return (
    <section id="categories" className="relative py-[80px] md:py-[120px]" style={{ background: 'var(--beige)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <SectionLabel text="PRODUCT LINES" />
            <h2
              className="font-display font-medium mt-4 max-w-[600px]"
              style={{
                fontSize: 'clamp(32px, 3.5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--navy)',
              }}
            >
              Focused categories for event and seasonal wholesale
            </h2>
          </div>
          <p
            className="font-body text-[17px] leading-[1.7] max-w-[440px]"
            style={{ color: 'var(--navy-60)' }}
          >
            The product catalog grows from real Yiwu market photos and item numbers. Buyers can ask by category first, then request item lists and prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="cat-card group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-[6px]"
              style={{
                borderColor: 'var(--navy-8)',
                boxShadow: '0 8px 32px rgba(10, 37, 64, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 24px 56px rgba(10, 37, 64, 0.14)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(10, 37, 64, 0.06)'
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden" style={{ background: 'var(--warm-white)' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.95)' }}
                >
                  {cat.icon}
                </div>
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-[12px] font-display font-bold tracking-wider"
                  style={{ background: 'var(--ksa-green)', color: 'white' }}
                >
                  {cat.code}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h4
                    className="font-display text-[19px] font-medium leading-tight"
                    style={{ color: 'var(--navy)' }}
                  >
                    {cat.name}
                  </h4>
                  <ArrowUpRight
                    size={20}
                    className="mt-1 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: 'var(--navy-40)' }}
                  />
                </div>
                <p
                  className="font-body text-[15px] leading-[1.6] mt-3"
                  style={{ color: 'var(--navy-60)' }}
                >
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
