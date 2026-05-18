import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const categories = [
  {
    image: '/images/cat-toys.jpg',
    name: 'Toys & Games',
    description: 'Educational toys, plushies, outdoor games, party supplies',
  },
  {
    image: '/images/cat-pet.jpg',
    name: 'Pet Products',
    description: 'Pet accessories, grooming tools, pet toys, feeders',
  },
  {
    image: '/images/cat-gifts.jpg',
    name: 'Gifts & Home Decor',
    description: 'Decorative items, candles, photo frames, seasonal gifts',
  },
  {
    image: '/images/cat-kitchen.jpg',
    name: 'Kitchen & Dining',
    description: 'Kitchen tools, tableware, storage containers, gadgets',
  },
  {
    image: '/images/cat-stationery.jpg',
    name: 'Stationery & Office',
    description: 'School supplies, office accessories, planners, art materials',
  },
  {
    image: '/images/cat-beauty.jpg',
    name: 'Beauty & Personal Care',
    description: 'Cosmetic tools, hair accessories, travel kits, beauty bags',
  },
  {
    image: '/images/cat-fashion.jpg',
    name: 'Fashion Accessories',
    description: 'Bags, jewelry, scarves, hats, seasonal accessories',
  },
  {
    image: '/images/cat-sports.jpg',
    name: 'Sports & Outdoor',
    description: 'Fitness gear, outdoor tools, camping accessories, water bottles',
  },
]

export default function CategoriesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.cat-card',
    stagger: 0.06,
    y: 40,
  })

  return (
    <section id="categories" style={{ background: 'var(--warm-white)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="PRODUCT CATEGORIES" />
        <h2
          className="font-display font-medium mt-4"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          What Can I Source for You?
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="cat-card bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: 'var(--navy-15)',
                boxShadow: '0 8px 32px rgba(10, 37, 64, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(10, 37, 64, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(10, 37, 64, 0.08)'
              }}
            >
              <div className="aspect-[16/10] overflow-hidden" style={{ background: 'var(--beige)' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4
                  className="font-display text-[18px] font-medium"
                  style={{ color: 'var(--navy)' }}
                >
                  {cat.name}
                </h4>
                <p
                  className="font-body text-[14px] mt-1.5"
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
