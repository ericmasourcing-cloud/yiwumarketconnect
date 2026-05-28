import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'

const blogPosts: Record<string, {
  title: string
  date: string
  readTime: string
  author: string
  description: string
}> = {
  'how-to-find-yiwu-sourcing-agent-small-orders': {
    title: 'How to Find a Reliable Yiwu Sourcing Agent for Small Orders (Under $5,000)',
    date: 'May 26, 2026',
    readTime: '8 min read',
    author: 'Eric Ma',
    description: 'Learn how to find a reliable Yiwu sourcing agent for small orders under $5,000. Avoid common traps with this practical guide and checklist.',
  },
}

// Inline article content to avoid fetch issues
const articleContent = `<p>If you're a small business owner trying to source products from China for the first time, finding the right agent can make or break your experience. Here's what I've learned from 5 years on the ground in Yiwu — and what you should watch out for.</p>

<h2>Why Small Orders Are Harder Than You Think</h2>

<p>Most sourcing agents in China prefer large orders. A $50,000 order? Everyone wants your business. A $3,000 order? Many agents won't even reply to your email.</p>

<p>This is the reality I deal with every day at Yiwu Market. I've helped clients with orders as small as $800, and I've seen what goes wrong when small business owners pick the wrong agent.</p>

<p>The good news: <strong>finding a reliable agent for small orders is possible</strong> — you just need to know what to look for (and what to avoid).</p>

<h2>3 Common Traps When Choosing a Sourcing Agent</h2>

<h3>Trap #1: The "Hidden Fee" Agent</h3>

<p>You find an agent who quotes a low commission rate — say 3% — and you think you've got a great deal. Then the invoice arrives:</p>

<ul>
<li>"Inspection fee": $150</li>
<li>"Supplier communication fee": $100</li>
<li>"Documentation fee": $80</li>
<li>"Photo/video report fee": $120</li>
<li>"Sample collection fee": $200</li>
</ul>

<p>Suddenly that 3% commission is actually costing you 12-15% of your order value.</p>

<p><strong>Red flag:</strong> Any agent who can't give you a clear, all-inclusive cost breakdown upfront is hiding something. A trustworthy agent tells you exactly what you'll pay before you send a single dollar.</p>

<p><strong>What I do:</strong> I charge a straightforward 5-10% commission depending on order complexity. No hidden fees. No surprise charges. I send a cost estimate before we start, and that's what you pay.</p>

<h3>Trap #2: The "Never at the Market" Agent</h3>

<p>This is more common than you'd think. Someone sets up a nice website, lists "10 years experience," and claims they're "based in Yiwu" — but they actually work from an apartment in another city, or worse, they've never set foot in Yiwu Market.</p>

<p>They take your request, post it on 1688.com (China's wholesale platform), add a markup, and relay the information. They're essentially a middleman — not someone who actually checks products in person.</p>

<p><strong>How to spot this:</strong></p>

<ul>
<li>Ask for a <strong>live video call from inside Yiwu Market</strong> — not a pre-recorded video, a real-time call showing the date and current market activity</li>
<li>Request <strong>photos with the current date visible</strong> — screenshots from their phone camera showing today's date</li>
<li>Ask specific questions about market districts — a real agent knows that District 1 is different from District 4 and can tell you why</li>
</ul>

<p><strong>What I do:</strong> I'm at Yiwu Market 5 days a week. When you work with me, you get real-time WhatsApp updates with photos and short videos taken the same day. I show you the actual supplier booth, the actual product samples, and the actual comparison sheets I create while walking the aisles.</p>

<h3>Trap #3: The "100% Payment Upfront" Scam</h3>

<p>This is the most dangerous trap. An agent demands full payment before production starts, promises fast delivery, and then disappears.</p>

<p>I've had three clients come to me after losing money to scams like this. One lost $4,200. Another lost $2,800. Both thought they were being "efficient" by paying everything upfront to "speed things up."</p>

<p><strong>How the scam works:</strong></p>

<ol>
<li>Agent quotes an attractive price</li>
<li>Pressures you to pay 100% upfront "to secure production slot"</li>
<li>Sends a few fake "production progress photos" (often stolen from other factories)</li>
<li>Stops responding</li>
<li>Website goes offline, WhatsApp number changes</li>
</ol>

<p><strong>Industry standard payment structure:</strong></p>

<table>
<thead>
<tr><th>Stage</th><th>Payment</th><th>When</th></tr>
</thead>
<tbody>
<tr><td>Order confirmation</td><td>30% deposit</td><td>After you approve samples and supplier</td></tr>
<tr><td>Pre-shipment</td><td>70% balance</td><td>After quality inspection, before shipping</td></tr>
<tr><td>Large orders ($10K+)</td><td>Letter of Credit</td><td>Through your bank</td></tr>
</tbody>
</table>

<p><strong>What I do:</strong> I follow the standard 30/70 split. I don't rush you to pay everything upfront — in fact, I advise against it. The inspection happens before you pay the balance, so you know exactly what you're getting.</p>

<h2>The Self-Check Checklist: Is This Agent Legitimate?</h2>

<p>Before you send money to any sourcing agent, go through this checklist:</p>

<h3>Communication</h3>

<ul>
<li>Do they respond within 24 hours? (A real business doesn't take 3 days to reply)</li>
<li>Can they do a live video call from the market? (Not a pre-recorded video)</li>
<li>Do they answer specific questions about your product? (Generic responses = copied/pasted)</li>
<li>Do they use professional translation tools? (If their English is unclear, that's a communication risk)</li>
</ul>

<h3>Pricing Transparency</h3>

<ul>
<li>Did they give you a written cost breakdown? (Not just "around $X,XXX")</li>
<li>Are all fees listed, or are there "we'll see" charges?</li>
<li>Is their commission rate within industry standard (3-15%)? (Too low = hidden fees, too high = overcharging)</li>
<li>Do they show you the supplier's actual price vs. their fee? (I always do this — transparency builds trust)</li>
</ul>

<h3>Verification</h3>

<ul>
<li>Can they provide supplier business license photos?</li>
<li>Do they have a real website (not just a Facebook page)?</li>
<li>Can you find them mentioned anywhere online? (Google their name + "Yiwu" + "review")</li>
<li>Do they have any client testimonials with specific details? (Vague testimonials = fake)</li>
</ul>

<h3>Process &amp; Protection</h3>

<ul>
<li>Do they offer pre-shipment inspection? (Any agent who skips this is cutting corners)</li>
<li>Do they send inspection photos/videos? (Not just "trust me, it's fine")</li>
<li>Is the payment structure 30/70 or similar? (100% upfront = red flag)</li>
<li>Do they have a clear process for handling defective products?</li>
</ul>

<h3>Market Knowledge</h3>

<ul>
<li>Can they name specific market districts for your product?</li>
<li>Do they know approximate MOQs for your product category?</li>
<li>Can they explain sea vs. air freight options for your country? (A real agent knows logistics)</li>
</ul>

<h2>What a Good Small-Order Agent Looks Like</h2>

<p>Based on my 5 years helping small businesses, here's what separates a great agent from an average one:</p>

<p><strong>Great agents for small orders:</strong></p>
<ul>
<li>Accept low MOQ (50-200 pieces) without pressuring you to increase</li>
<li>Respond fast, even for small questions</li>
<li>Send detailed comparison reports with photos</li>
<li>Are transparent about costs and processes</li>
<li>Actually visit the market regularly (not just coordinate via phone)</li>
<li>Care about your long-term success (repeat business is better than one big order)</li>
</ul>

<p><strong>Average agents:</strong></p>
<ul>
<li>Push you to increase MOQ</li>
<li>Take days to reply</li>
<li>Send vague price lists without context</li>
<li>Hide fees</li>
<li>Rarely visit suppliers in person</li>
</ul>

<h2>Bottom Line</h2>

<p>Finding a reliable Yiwu sourcing agent for small orders isn't impossible — but it requires asking the right questions and watching for red flags.</p>

<p>The three biggest things to remember:</p>

<ol>
<li><strong>Get a clear, all-inclusive cost breakdown before you pay anything</strong></li>
<li><strong>Verify they're actually at Yiwu Market — ask for live video</strong></li>
<li><strong>Never pay 100% upfront — 30/70 is the industry standard</strong></li>
</ol>

<p>If you follow the checklist above, you'll avoid 90% of the scams and bad experiences that first-time importers run into.</p>

<h2>Still Comparing Agents? Let's Talk</h2>

<p>Choosing a sourcing agent is a big decision — especially if this is your first time importing from China. I get it.</p>

<p>If you're still in the research phase and want a second opinion on a supplier quote, or if you're not sure whether your product idea is feasible at a low MOQ, <strong>I'm happy to help</strong>.</p>

<p>I offer a <strong>free 15-minute consultation</strong> where I can:</p>

<ul>
<li>Review a supplier quote you've already received and tell you if the pricing is reasonable</li>
<li>Give you a realistic MOQ estimate for your specific product</li>
<li>Answer questions about shipping costs and timelines to your country</li>
<li>Tell you honestly whether Yiwu Market is the right sourcing channel for what you're trying to buy (sometimes it isn't — and I'll tell you if that's the case)</li>
</ul>

<p><strong>No pressure, no commitment.</strong> Just practical advice from someone who's at the market 5 days a week.</p>

<p>📱 <strong>WhatsApp:</strong> +86 186 8606 2666<br>
📧 <strong>Email:</strong> ericma.sourcing@gmail.com</p>

<p>Or fill out the <a href="https://www.ericyiwusourcing.com/#contact">inquiry form on my website</a> and I'll get back to you within 24 hours.</p>

<hr>

<p><em>Eric Ma is a Yiwu-based sourcing agent who specializes in helping small businesses and online sellers source products from China's largest wholesale market with low MOQ and quality assurance.</em></p>`

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? blogPosts[slug] : null

  useEffect(() => {
    if (post) {
      document.title = `${post.title}`
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
          <article
            className="blog-content font-body text-[17px] leading-[1.8]"
            style={{ color: 'var(--navy-80)' }}
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />

          {/* CTA Box */}
          <div className="mt-12 p-8 rounded-2xl" style={{ background: 'var(--navy)' }}>
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
                href="https://www.ericyiwusourcing.com/#contact"
                className="inline-flex items-center justify-center font-display text-[15px] font-medium px-6 py-3 rounded-xl transition-all"
                style={{ background: 'var(--orange)', color: 'white' }}
              >
                Send Inquiry →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
