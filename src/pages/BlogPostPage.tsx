import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'

const blogPosts: Record<string, {
  title: string
  slug: string
  date: string
  readTime: string
  author: string
  file: string
  description: string
  keywords: string
}> = {
  'how-to-find-yiwu-sourcing-agent-small-orders': {
    title: 'How to Find a Reliable Yiwu Sourcing Agent for Small Orders (Under $5,000)',
    slug: 'how-to-find-yiwu-sourcing-agent-small-orders',
    date: 'May 26, 2026',
    readTime: '8 min read',
    author: 'Eric Ma',
    file: '/blog-yiwu-sourcing-agent-small-orders.md',
    description: 'Learn how to find a reliable Yiwu sourcing agent for small orders under $5,000. Avoid common traps with this practical guide and checklist.',
    keywords: 'yiwu sourcing agent, small orders, under 5000, reliable agent, yiwu market, low MOQ',
  },
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const post = slug ? blogPosts[slug] : null

  useEffect(() => {
    if (!post) return
    fetch(post.file)
      .then((res) => res.text())
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => {
        setContent('# Article not found')
        setLoading(false)
      })
  }, [post])

  // Update page title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | YiwuMarketConnect Blog`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', post.description)
    }
    return () => {
      document.title = 'Yiwu Sourcing Agent | Eric — Low MOQ Product Sourcing for Small Business'
    }
  }, [post])

  if (!post) {
    return (
      <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
        <Navigation />
        <div className="max-w-[800px] mx-auto px-6 py-[120px] text-center">
          <h1 className="font-display text-[32px]" style={{ color: 'var(--navy)' }}>
            Article not found
          </h1>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 font-body" style={{ color: 'var(--orange)' }}>
            <ArrowLeft size={18} /> Back to home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      <Navigation />

      {/* Blog Header */}
      <section className="pt-[120px] pb-[40px]" style={{ background: 'var(--navy)' }}>
        <div className="max-w-[800px] mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-[14px] mb-6 transition-opacity hover:opacity-80"
            style={{ color: 'var(--orange)' }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <h1
            className="font-display font-medium text-white"
            style={{
              fontSize: 'clamp(24px, 3vw, 40px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-[14px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="flex items-center gap-1.5">
              <User size={14} /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-[60px] md:py-[80px]">
        <div className="max-w-[800px] mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--orange)', borderTopColor: 'transparent' }} />
              <p className="font-body mt-4" style={{ color: 'var(--navy-60)' }}>Loading article...</p>
            </div>
          ) : (
            <article
              className="blog-content font-body text-[17px] leading-[1.8]"
              style={{ color: 'var(--navy-80)' }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-display font-bold text-[28px] md:text-[32px] mt-12 mb-6" style={{ color: 'var(--navy)', lineHeight: 1.2 }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-display font-bold text-[22px] md:text-[24px] mt-10 mb-4" style={{ color: 'var(--navy)', lineHeight: 1.3 }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-display font-semibold text-[18px] mt-8 mb-3" style={{ color: 'var(--navy)' }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-5" style={{ color: 'var(--navy-80)' }}>{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-6 pl-6 space-y-2" style={{ listStyleType: 'disc' }}>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-6 pl-6 space-y-2" style={{ listStyleType: 'decimal' }}>{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold" style={{ color: 'var(--navy)' }}>{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="underline transition-colors" style={{ color: 'var(--orange)' }} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="my-10" style={{ borderColor: 'var(--navy-15)' }} />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-[15px] border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ background: 'var(--beige)' }}>{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="text-left px-4 py-3 font-display font-semibold text-[15px]" style={{ color: 'var(--navy)', borderBottom: '2px solid var(--navy)' }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--navy-15)' }}>{children}</td>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="pl-5 py-3 my-6 rounded-r-lg" style={{ borderLeft: '4px solid var(--orange)', background: 'var(--beige)' }}>
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded text-[14px]" style={{ background: 'var(--beige)', color: 'var(--navy)' }}>
                      {children}
                    </code>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>

              {/* CTA Box */}
              <div
                className="mt-12 p-8 rounded-2xl"
                style={{ background: 'var(--navy)' }}
              >
                <h3 className="font-display text-[20px] font-bold text-white mb-3">
                  Need Help Finding the Right Supplier?
                </h3>
                <p className="text-[16px] mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  I offer a free 15-minute consultation. Send me a supplier quote you've received, 
                  and I'll tell you if the pricing is reasonable — no strings attached.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/8618686062666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-display text-[15px] font-medium px-6 py-3 rounded-xl text-white transition-all"
                    style={{ background: 'var(--green)' }}
                  >
                    Chat on WhatsApp 💬
                  </a>
                  <a
                    href="/#contact"
                    className="inline-flex items-center justify-center font-display text-[15px] font-medium px-6 py-3 rounded-xl transition-all"
                    style={{ background: 'var(--orange)', color: 'white' }}
                  >
                    Send Inquiry →
                  </a>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
