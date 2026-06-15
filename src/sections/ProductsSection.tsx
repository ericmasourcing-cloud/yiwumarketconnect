import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const products = [
  {
    image: '/images/prod-02.png',
    code: 'P01',
    name: 'Balloon Garland Kits',
    description: 'Theme balloon sets for Halloween, birthdays and seasonal event decoration. Best for party shops, online sellers and event decorators.',
    tags: ['Party shops', 'Theme packs', 'MOQ check'],
  },
  {
    image: '/images/prod-05.png',
    code: 'P02',
    name: 'Custom Printed Balloons',
    description: 'Logo or QR-code balloons for store openings, brand events and promotional campaigns. Strong B2B fit for repeat business.',
    tags: ['Logo', 'Promotion', 'Custom'],
  },
  {
    image: '/images/prod-09.png',
    code: 'P03',
    name: 'Foil Fringe Curtains',
    description: 'Metallic backdrop curtains for photo booths, retail displays, stages and party decoration. Lightweight and easy to bundle.',
    tags: ['Backdrop', 'Lightweight', 'Retail'],
  },
  {
    image: '/images/prod-11.png',
    code: 'P04',
    name: 'Balloon Stands & Columns',
    description: 'Balloon column stands, table stands and water-fill bases for weddings, birthdays and entrance displays.',
    tags: ['Event props', 'Accessories', 'Mix order'],
  },
  {
    image: '/images/prod-14.png',
    code: 'P05',
    name: 'Graduation Party Sets',
    description: 'Graduation balloons, banners and photo-scene decoration for seasonal retail and school-event orders.',
    tags: ['Seasonal', 'School events', 'Retail packs'],
  },
  {
    image: '/images/prod-16.png',
    code: 'P06',
    name: 'Christmas Party Balloons',
    description: 'Foil and latex balloon sets for Christmas retail displays, holiday parties and e-commerce seasonal listings.',
    tags: ['Holiday', 'Seasonal', 'Theme sets'],
  },
]

export default function ProductsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({
    childSelector: '.product-card',
    stagger: 0.08,
    y: 50,
  })

  return (
    <section id="products" className="relative py-[80px] md:py-[120px]" style={{ background: 'var(--warm-white)' }}>
      <div ref={sectionRef} className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-[720px] mx-auto">
          <SectionLabel text="SELECTED PRODUCTS" />
          <h2
            className="font-display font-medium mt-4"
            style={{
              fontSize: 'clamp(32px, 3.5vw, 56px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--navy)',
            }}
          >
            First product set for buyer inquiries
          </h2>
          <p
            className="font-body text-[17px] leading-[1.7] mt-5"
            style={{ color: 'var(--navy-60)' }}
          >
            Selected for B2B buyer fit: easy to explain, useful for events or retail packs, and suitable for checking MOQ, packing and customization before quotation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {products.map((product) => (
            <div
              key={product.code}
              className="product-card group bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-[6px]"
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
              <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--beige)' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute bottom-4 left-4 px-3 py-1 rounded-lg text-[13px] font-display font-bold"
                  style={{ background: 'var(--navy)', color: 'white' }}
                >
                  {product.code}
                </div>
              </div>
              <div className="p-6">
                <h4
                  className="font-display text-[19px] font-medium"
                  style={{ color: 'var(--navy)' }}
                >
                  {product.name}
                </h4>
                <p
                  className="font-body text-[15px] leading-[1.6] mt-2"
                  style={{ color: 'var(--navy-60)' }}
                >
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-[12px] px-3 py-1 rounded-full"
                      style={{
                        background: 'var(--ksa-green-light)',
                        color: 'var(--ksa-green)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
