import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    slug: 'how-to-find-yiwu-sourcing-agent-small-orders',
    title: 'How to Find a Reliable Yiwu Sourcing Agent for Small Orders (Under $5,000)',
    date: 'May 26, 2026',
    readTime: '8 min read',
    excerpt: 'If you\'re a small business owner trying to source products from China for the first time, finding the right agent can make or break your experience. Here\'s what I\'ve learned from 5 years on the ground in Yiwu.',
  },
]

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog | YiwuMarketConnect'
    return () => {
      document.title = 'Yiwu Sourcing Agent | Eric — Low MOQ Product Sourcing for Small Business'
    }
  }, [])

  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />

      {/* Header */}
      <section className="pt-[120px] pb-[40px]" style={{ background: 'var(--navy)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <p className="font-body text-[14px] mb-3" style={{ color: 'var(--orange)' }}>
            YIWUMARKETCONNECT BLOG
          </p>
          <h1
            className="font-display font-medium text-white"
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Sourcing Tips & Market Insights
          </h1>
          <p className="font-body text-[18px] mt-4 max-w-[600px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Practical guides for importing from China, straight from someone who walks Yiwu Market 5 days a week.
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-[80px] md:py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl border p-8 transition-all duration-300"
                style={{ borderColor: 'var(--navy-15)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--orange-40)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(10, 37, 64, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--navy-15)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="flex flex-wrap items-center gap-4 text-[14px] mb-4" style={{ color: 'var(--navy-60)' }}>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {post.readTime}
                  </span>
                </div>
                <h2
                  className="font-display text-[24px] md:text-[28px] font-medium group-hover:transition-colors"
                  style={{ color: 'var(--navy)', lineHeight: 1.2 }}
                >
                  {post.title}
                </h2>
                <p className="font-body text-[16px] leading-[1.7] mt-4" style={{ color: 'var(--navy-60)' }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-6 font-display text-[15px] font-medium" style={{ color: 'var(--orange)' }}>
                  Read Article <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
