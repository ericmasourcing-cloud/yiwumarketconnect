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
  'cost-to-import-small-order-from-china': {
    title: 'How Much Does It Really Cost to Import a Small Order from China? (Complete 2026 Breakdown)',
    date: 'June 1, 2026',
    readTime: '12 min read',
    author: 'Eric Ma',
    description: 'Complete cost breakdown for importing small orders from China in 2026. Product cost, shipping, customs duty, VAT, agent fees, and hidden costs — with real numbers and examples.',
  },
}

const articleContents: Record<string, string> = {
  'how-to-find-yiwu-sourcing-agent-small-orders': `<p>If you're a small business owner trying to source products from China for the first time, finding the right agent can make or break your experience. Here's what I've learned from 5 years on the ground in Yiwu — and what you should watch out for.</p>
<h2>Why Small Orders Are Harder Than You Think</h2>
<p>Most sourcing agents in China prefer large orders. A $50,000 order? Everyone wants your business. A $3,000 order? Many agents won't even reply to your email.</p>
<p>This is the reality I deal with every day at Yiwu Market. I've helped clients with orders as small as $800, and I've seen what goes wrong when small business owners pick the wrong agent.</p>
<p>The good news: <strong>finding a reliable agent for small orders is possible</strong> — you just need to know what to look for (and what to avoid).</p>
<h2>3 Common Traps When Choosing a Sourcing Agent</h2>
<h3>Trap #1: The "Hidden Fee" Agent</h3>
<p>You find an agent who quotes a low commission rate — say 3% — and you think you've got a great deal. Then the invoice arrives:</p>
<ul><li>"Inspection fee": $150</li><li>"Supplier communication fee": $100</li><li>"Documentation fee": $80</li><li>"Photo/video report fee": $120</li><li>"Sample collection fee": $200</li></ul>
<p>Suddenly that 3% commission is actually costing you 12-15% of your order value.</p>
<p><strong>Red flag:</strong> Any agent who can't give you a clear, all-inclusive cost breakdown upfront is hiding something. A trustworthy agent tells you exactly what you'll pay before you send a single dollar.</p>
<p><strong>What I do:</strong> I charge a straightforward 5-10% commission depending on order complexity. No hidden fees. No surprise charges. I send a cost estimate before we start, and that's what you pay.</p>
<h3>Trap #2: The "Never at the Market" Agent</h3>
<p>This is more common than you'd think. Someone sets up a nice website, lists "10 years experience," and claims they're "based in Yiwu" — but they actually work from an apartment in another city, or worse, they've never set foot in Yiwu Market.</p>
<p>They take your request, post it on 1688.com (China's wholesale platform), add a markup, and relay the information. They're essentially a middleman — not someone who actually checks products in person.</p>
<p><strong>How to spot this:</strong></p>
<ul><li>Ask for a <strong>live video call from inside Yiwu Market</strong> — not a pre-recorded video, a real-time call showing the date and current market activity</li><li>Request <strong>photos with the current date visible</strong> — screenshots from their phone camera showing today's date</li><li>Ask specific questions about market districts — a real agent knows that District 1 is different from District 4 and can tell you why</li></ul>
<p><strong>What I do:</strong> I'm at Yiwu Market 5 days a week. When you work with me, you get real-time WhatsApp updates with photos and short videos taken the same day. I show you the actual supplier booth, the actual product samples, and the actual comparison sheets I create while walking the aisles.</p>
<h3>Trap #3: The "100% Payment Upfront" Scam</h3>
<p>This is the most dangerous trap. An agent demands full payment before production starts, promises fast delivery, and then disappears.</p>
<p>I've had three clients come to me after losing money to scams like this. One lost $4,200. Another lost $2,800. Both thought they were being "efficient" by paying everything upfront to "speed things up."</p>
<p><strong>How the scam works:</strong></p>
<ol><li>Agent quotes an attractive price</li><li>Pressures you to pay 100% upfront "to secure production slot"</li><li>Sends a few fake "production progress photos" (often stolen from other factories)</li><li>Stops responding</li><li>Website goes offline, WhatsApp number changes</li></ol>
<p><strong>Industry standard payment structure:</strong></p>
<table><thead><tr><th>Stage</th><th>Payment</th><th>When</th></tr></thead><tbody><tr><td>Order confirmation</td><td>30% deposit</td><td>After you approve samples and supplier</td></tr><tr><td>Pre-shipment</td><td>70% balance</td><td>After quality inspection, before shipping</td></tr><tr><td>Large orders ($10K+)</td><td>Letter of Credit</td><td>Through your bank</td></tr></tbody></table>
<p><strong>What I do:</strong> I follow the standard 30/70 split. I don't rush you to pay everything upfront — in fact, I advise against it. The inspection happens before you pay the balance, so you know exactly what you're getting.</p>
<h2>The Self-Check Checklist: Is This Agent Legitimate?</h2>
<p>Before you send money to any sourcing agent, go through this checklist:</p>
<h3>Communication</h3>
<ul><li>Do they respond within 24 hours? (A real business doesn't take 3 days to reply)</li><li>Can they do a live video call from the market? (Not a pre-recorded video)</li><li>Do they answer specific questions about your product? (Generic responses = copied/pasted)</li><li>Do they use professional translation tools? (If their English is unclear, that's a communication risk)</li></ul>
<h3>Pricing Transparency</h3>
<ul><li>Did they give you a written cost breakdown? (Not just "around $X,XXX")</li><li>Are all fees listed, or are there "we'll see" charges?</li><li>Is their commission rate within industry standard (3-15%)? (Too low = hidden fees, too high = overcharging)</li><li>Do they show you the supplier's actual price vs. their fee? (I always do this — transparency builds trust)</li></ul>
<h3>Verification</h3>
<ul><li>Can they provide supplier business license photos?</li><li>Do they have a real website (not just a Facebook page)?</li><li>Can you find them mentioned anywhere online? (Google their name + "Yiwu" + "review")</li><li>Do they have any client testimonials with specific details? (Vague testimonials = fake)</li></ul>
<h3>Process &amp; Protection</h3>
<ul><li>Do they offer pre-shipment inspection? (Any agent who skips this is cutting corners)</li><li>Do they send inspection photos/videos? (Not just "trust me, it's fine")</li><li>Is the payment structure 30/70 or similar? (100% upfront = red flag)</li><li>Do they have a clear process for handling defective products?</li></ul>
<h3>Market Knowledge</h3>
<ul><li>Can they name specific market districts for your product?</li><li>Do they know approximate MOQs for your product category?</li><li>Can they explain sea vs. air freight options for your country? (A real agent knows logistics)</li></ul>
<h2>What a Good Small-Order Agent Looks Like</h2>
<p>Based on my 5 years helping small businesses, here's what separates a great agent from an average one:</p>
<p><strong>Great agents for small orders:</strong></p>
<ul><li>Accept low MOQ (50-200 pieces) without pressuring you to increase</li><li>Respond fast, even for small questions</li><li>Send detailed comparison reports with photos</li><li>Are transparent about costs and processes</li><li>Actually visit the market regularly (not just coordinate via phone)</li><li>Care about your long-term success (repeat business is better than one big order)</li></ul>
<p><strong>Average agents:</strong></p>
<ul><li>Push you to increase MOQ</li><li>Take days to reply</li><li>Send vague price lists without context</li><li>Hide fees</li><li>Rarely visit suppliers in person</li></ul>
<h2>Bottom Line</h2>
<p>Finding a reliable Yiwu sourcing agent for small orders isn't impossible — but it requires asking the right questions and watching for red flags.</p>
<p>The three biggest things to remember:</p>
<ol><li><strong>Get a clear, all-inclusive cost breakdown before you pay anything</strong></li><li><strong>Verify they're actually at Yiwu Market — ask for live video</strong></li><li><strong>Never pay 100% upfront — 30/70 is the industry standard</strong></li></ol>
<p>If you follow the checklist above, you'll avoid 90% of the scams and bad experiences that first-time importers run into.</p>
<h2>Still Comparing Agents? Let's Talk</h2>
<p>Choosing a sourcing agent is a big decision — especially if this is your first time importing from China. I get it.</p>
<p>If you're still in the research phase and want a second opinion on a supplier quote, or if you're not sure whether your product idea is feasible at a low MOQ, <strong>I'm happy to help</strong>.</p>
<p>I offer a <strong>free 15-minute consultation</strong> where I can:</p>
<ul><li>Review a supplier quote you've already received and tell you if the pricing is reasonable</li><li>Give you a realistic MOQ estimate for your specific product</li><li>Answer questions about shipping costs and timelines to your country</li><li>Tell you honestly whether Yiwu Market is the right sourcing channel for what you're trying to buy (sometimes it isn't — and I'll tell you if that's the case)</li></ul>
<p><strong>No pressure, no commitment.</strong> Just practical advice from someone who's at the market 5 days a week.</p>
<p>📱 <strong>WhatsApp:</strong> +86 186 8606 2666<br>📧 <strong>Email:</strong> ericma.sourcing@gmail.com</p>
<p>Or fill out the <a href="https://www.ericyiwusourcing.com/#contact">inquiry form on my website</a> and I'll get back to you within 24 hours.</p>
<hr>
<p><em>Eric Ma is a Yiwu-based sourcing agent who specializes in helping small businesses and online sellers source products from China's largest wholesale market with low MOQ and quality assurance.</em></p>`,

  'cost-to-import-small-order-from-china': `<p>If you're a small business owner trying to import your first order from China, the numbers can be confusing. Here's every cost line item — from product price to customs duty — so you know exactly what to budget for.</p>
<h2>The Big Picture: What You're Actually Paying For</h2>
<p>When most people Google "how much to import from China," they think about the product price. That's just the beginning.</p>
<p>A $2,000 product order can easily become a $3,200 total investment once you add shipping, customs, agent fees, and other costs. The difference between a profitable first import and an expensive lesson is knowing these numbers <strong>before</strong> you send money.</p>
<p>Here's the complete cost stack for a typical small order (under $5,000):</p>
<table><thead><tr><th>Cost Category</th><th>Typical Range</th><th>What It Covers</th></tr></thead><tbody><tr><td>Product cost</td><td>40-55% of total</td><td>The actual goods you're buying</td></tr><tr><td>Shipping (sea/air)</td><td>15-30% of total</td><td>Freight from China to your country</td></tr><tr><td>Customs duty + VAT</td><td>5-20% of product value</td><td>Import tax charged by your government</td></tr><tr><td>Agent commission</td><td>5-10% of order value</td><td>Sourcing agent fee</td></tr><tr><td>Quality inspection</td><td>$50-150 per shipment</td><td>Pre-shipment check</td></tr><tr><td>Bank/transfer fees</td><td>$25-75</td><td>Wire transfer, currency conversion</td></tr><tr><td>Packaging/customization</td><td>$50-300</td><td>Custom boxes, labels, inserts</td></tr><tr><td><strong>Total landed cost</strong></td><td><strong>Product cost × 1.5-1.8</strong></td><td>Everything above combined</td></tr></tbody></table>
<h2>Product Cost: The Foundation</h2>
<p>This is the easiest number to understand — but also the easiest to get wrong.</p>
<h3>What the supplier quotes vs. what you actually pay</h3>
<p>Most suppliers quote an <strong>EXW</strong> (Ex Works) price. This means:</p>
<ul><li>✅ The product is ready at their factory</li><li>❌ You pay for everything else (packaging, shipping to port, export clearance)</li></ul>
<p>Some quote <strong>FOB</strong> (Free on Board), which includes delivery to the port in China. It's usually $200-500 more than EXW, but saves you the headache of inland logistics.</p>
<p><strong>Rule of thumb:</strong> Whatever price the supplier gives you, assume you'll pay <strong>15-25% more</strong> for the actual "get it to my warehouse" cost.</p>
<h3>MOQ reality check</h3>
<p>At Yiwu Market, most products have a <strong>MOQ of 50-200 pieces</strong>. But here's what suppliers don't always tell you:</p>
<ul><li><strong>MOQ for stock items:</strong> 50-100 pieces (easy)</li><li><strong>MOQ for custom colors:</strong> 200-500 pieces (negotiable down to 100-200)</li><li><strong>MOQ for custom packaging:</strong> 500-1,000 pieces (hard to push lower)</li><li><strong>MOQ for custom product design:</strong> 1,000+ pieces (usually not worth it for small orders)</li></ul>
<p><strong>If your order is under $3,000, stick to stock products with minimal customization.</strong> Custom packaging and logo printing add complexity and cost that small orders can't absorb.</p>
<h2>Shipping: Sea vs. Air vs. Express</h2>
<p>This is where most first-time importers make expensive mistakes. The shipping method you choose can change your total cost by 50% or more.</p>
<h3>Sea freight (LCL - Less than Container Load)</h3>
<table><thead><tr><th>Detail</th><th>Cost</th></tr></thead><tbody><tr><td>Price per CBM</td><td>$80-150</td></tr><tr><td>Minimum charge</td><td>1 CBM</td></tr><tr><td>Transit time</td><td>25-40 days</td></tr><tr><td>Best for</td><td>Orders over $2,000 or bulky items</td></tr></tbody></table>
<p><strong>Example:</strong> A 0.5 CBM shipment of toys from Yiwu to Hamburg, Germany:</p>
<ul><li>Sea freight: ~$120</li><li>Port fees + handling: ~$150</li><li><strong>Total sea shipping: ~$270</strong></li></ul>
<h3>Air freight</h3>
<table><thead><tr><th>Detail</th><th>Cost</th></tr></thead><tbody><tr><td>Price per kg</td><td>$4-8</td></tr><tr><td>Minimum charge</td><td>45 kg</td></tr><tr><td>Transit time</td><td>7-12 days</td></tr><tr><td>Best for</td><td>$1,000-5,000 orders, medium weight</td></tr></tbody></table>
<p><strong>Example:</strong> 30 kg of pet accessories from Yiwu to Amsterdam:</p>
<ul><li>Air freight: ~$180</li><li>Airport handling: ~$80</li><li><strong>Total air shipping: ~$260</strong></li></ul>
<h3>Express courier (DHL/FedEx/UPS)</h3>
<table><thead><tr><th>Detail</th><th>Cost</th></tr></thead><tbody><tr><td>Price per kg</td><td>$6-12</td></tr><tr><td>Minimum charge</td><td>0.5 kg</td></tr><tr><td>Transit time</td><td>3-7 days</td></tr><tr><td>Best for</td><td>Samples, urgent orders under $1,000</td></tr></tbody></table>
<p><strong>Example:</strong> 5 kg sample package to London:</p>
<ul><li>Express: ~$55</li><li><strong>Total express: ~$55</strong></li></ul>
<h3>My recommendation for small orders</h3>
<table><thead><tr><th>Order value</th><th>Best method</th><th>Why</th></tr></thead><tbody><tr><td>Under $500</td><td>Express</td><td>Sea/air minimum charges eat your margin</td></tr><tr><td>$500-2,000</td><td>Air freight</td><td>Faster than sea, cheaper than express at this weight</td></tr><tr><td>$2,000-5,000</td><td>Sea (LCL)</td><td>Biggest cost savings at this volume</td></tr><tr><td>Over $5,000</td><td>Sea (FCL)</td><td>Full container becomes cost-effective</td></tr></tbody></table>
<h2>Customs Duty &amp; VAT: The Government's Cut</h2>
<p>This is the cost most people forget to budget for. And it's not optional.</p>
<h3>How to calculate it</h3>
<p>Every product has an <strong>HS code</strong> (Harmonized System code) that determines the duty rate. Your supplier should provide this, or you can look it up yourself.</p>
<p><strong>Formula:</strong></p>
<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:14px;">Customs value = Product cost + Shipping cost to destination port
Duty = Customs value × Duty rate (usually 0-15%)
VAT = (Customs value + Duty) × VAT rate
Total tax = Duty + VAT</pre>
<h3>Real examples (2026 rates)</h3>
<table><thead><tr><th>Product</th><th>Destination</th><th>Duty Rate</th><th>VAT Rate</th><th>Total Tax on $2,000 order</th></tr></thead><tbody><tr><td>Toys (HS 9503)</td><td>Germany</td><td>0%</td><td>19%</td><td>~$380</td></tr><tr><td>Kitchen tools (HS 8205)</td><td>UK</td><td>4.5%</td><td>20%</td><td>~$490</td></tr><tr><td>Pet accessories (HS 4201)</td><td>USA</td><td>0-6.5%</td><td>No federal VAT</td><td>~$0-130</td></tr><tr><td>Beauty tools (HS 8214)</td><td>Australia</td><td>5%</td><td>10%</td><td>~$300</td></tr><tr><td>Gift boxes (HS 4819)</td><td>Netherlands</td><td>0%</td><td>21%</td><td>~$420</td></tr></tbody></table>
<p><strong>Important:</strong> These rates change. Always check the current rate with your customs authority before ordering.</p>
<h2>Sourcing Agent Fees: What Should You Actually Pay?</h2>
<p>If you're working with a sourcing agent (which I strongly recommend for first-time buyers), here's what fair pricing looks like:</p>
<h3>Fee structures</h3>
<table><thead><tr><th>Type</th><th>Rate</th><th>Best for</th></tr></thead><tbody><tr><td>Commission (% of order)</td><td>5-10%</td><td>Most common, scales with order size</td></tr><tr><td>Flat fee per project</td><td>$300-800</td><td>Small, simple orders</td></tr><tr><td>Daily rate</td><td>$150-300/day</td><td>Market visits and complex sourcing</td></tr></tbody></table>
<h3>What's included vs. extra</h3>
<p><strong>Usually included in commission:</strong></p>
<ul><li>Supplier research and comparison</li><li>Price negotiation</li><li>Sample collection</li><li>Order coordination</li><li>Pre-shipment inspection (basic)</li></ul>
<p><strong>Usually extra:</strong></p>
<ul><li>Custom packaging design</li><li>Third-party lab testing</li><li>Full container loading supervision</li><li>Warehousing in China</li><li>Re-inspection if defects found</li></ul>
<p><strong>Red flag:</strong> Any agent who won't give you a written cost breakdown upfront. A trustworthy agent tells you exactly what you'll pay before you start.</p>
<h2>Hidden Costs Most People Miss</h2>
<h3>1. Bank transfer fees</h3>
<table><thead><tr><th>Transfer method</th><th>Cost</th><th>Speed</th></tr></thead><tbody><tr><td>Wire transfer (SWIFT)</td><td>$25-50</td><td>2-5 days</td></tr><tr><td>Wise (formerly TransferWise)</td><td>0.5-1%</td><td>1-2 days</td></tr><tr><td>PayPal</td><td>4-5%</td><td>Instant</td></tr><tr><td>Alibaba Trade Assurance</td><td>2-3%</td><td>Instant</td></tr></tbody></table>
<p><strong>My advice:</strong> Use Wise for orders under $5,000. It saves you $100-200 in fees compared to bank wires and PayPal.</p>
<h3>2. Currency exchange loss</h3>
<p>When you pay in USD but your bank account is in EUR or GBP, you lose 1-3% on the exchange rate. This is hidden in the spread — not shown as a separate fee.</p>
<p><strong>Example:</strong> Paying $2,000 to a supplier:</p>
<ul><li>At mid-market rate: €1,840</li><li>At bank rate: €1,790</li><li><strong>Hidden loss: €50 ($54)</strong></li></ul>
<h3>3. Insurance</h3>
<p>Sea freight insurance costs about 0.3-0.5% of the shipment value. For a $2,000 order, that's $6-10. Skip it and you're gambling.</p>
<h3>4. Storage fees</h3>
<p>If your shipment arrives at the port and you don't clear customs quickly, storage fees pile up fast:</p>
<ul><li>Port storage: $5-15/day after free period (usually 3-7 days)</li><li>Warehouse storage: $10-30/day</li></ul>
<p><strong>Plan ahead:</strong> Know your customs clearance process before the shipment arrives.</p>
<h3>5. Product defects and replacements</h3>
<p>Even with inspection, 2-5% of products might have defects. Budget for it:</p>
<ul><li>Minor defects you can sell at discount: absorb the loss</li><li>Major defects requiring replacement: add 5-10% to your product budget as a buffer</li></ul>
<h2>Complete Example: A Real $2,500 Order</h2>
<p>Here's what a realistic order looks like for a German online seller buying toys from Yiwu:</p>
<table><thead><tr><th>Cost item</th><th>Amount</th></tr></thead><tbody><tr><td>Product cost (200 plush toys @ $6.50 each)</td><td>$1,300</td></tr><tr><td>Custom packaging (simple printed boxes)</td><td>$180</td></tr><tr><td>Sourcing agent commission (7%)</td><td>$91</td></tr><tr><td>Quality inspection</td><td>$80</td></tr><tr><td>Shipping to Hamburg (sea LCL, 0.8 CBM)</td><td>$320</td></tr><tr><td>Insurance (0.4%)</td><td>$5</td></tr><tr><td>Customs duty (0% for toys to EU)</td><td>$0</td></tr><tr><td>VAT (19% on product + shipping)</td><td>$307</td></tr><tr><td>Bank transfer fee</td><td>$35</td></tr><tr><td><strong>Total landed cost</strong></td><td><strong>$2,318</strong></td></tr><tr><td><strong>Cost per unit (landed)</strong></td><td><strong>$11.59</strong></td></tr></tbody></table>
<p><strong>Key insight:</strong> The product cost was $6.50, but the real cost to get each toy to your warehouse is $11.59. That's what you need to price your retail at — not $6.50.</p>
<h2>How to Reduce Your Import Costs</h2>
<h3>1. Combine orders</h3>
<p>Shipping 0.5 CBM costs almost the same as 1.0 CBM because of minimum charges. If you can wait, combine two small orders into one shipment.</p>
<h3>2. Ship sea freight when possible</h3>
<p>For orders over $2,000, sea freight typically saves you $200-500 vs. air freight. The 30-day wait is worth it if you're not in a rush.</p>
<h3>3. Skip custom packaging on first orders</h3>
<p>Use the supplier's standard packaging for your first 2-3 orders. Once you know the product sells, then invest in branded packaging.</p>
<h3>4. Negotiate with your agent</h3>
<p>For repeat orders, most agents will reduce their commission from 10% to 5-7%. Build a relationship first, then ask.</p>
<h3>5. Check HS codes carefully</h3>
<p>A small difference in product classification can change your duty rate from 15% to 0%. Ask your agent or a customs broker to confirm the right code.</p>
<h2>The Bottom Line</h2>
<p>Importing a small order from China isn't free, and it's not as cheap as the supplier's price suggests. But it's still profitable if you budget correctly.</p>
<p><strong>Remember the formula:</strong></p>
<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:14px;">Landed cost per unit = (Product cost + Shipping + Customs + Agent + Other fees) ÷ Quantity</pre>
<p>If your landed cost is $11.59 and you can sell for $24.99, that's a healthy margin. If you thought your cost was $6.50 and priced at $12.99, you're losing money.</p>
<p><strong>The biggest mistake I see:</strong> First-time importers price their products based on the supplier's quote, not the real landed cost. Don't be that person.</p>
<h2>Want a Custom Cost Breakdown for Your Product?</h2>
<p>Every product is different. A 0.5 kg beauty tool ships by air for $40. A 5 kg kitchen gadget set ships by sea for $90. The math changes based on weight, volume, product category, and destination.</p>
<p>If you're planning your first import and want a realistic cost estimate for your specific product, <strong>I can help</strong>.</p>
<p>I offer a free 15-minute consultation where I can:</p>
<ul><li>Calculate the landed cost for your product based on current shipping rates</li><li>Tell you whether sea or air freight makes more sense for your order size</li><li>Estimate your customs duty and VAT based on your country and product type</li><li>Identify the hidden costs you might not have budgeted for</li></ul>
<p><strong>No commitment, no pressure.</strong> Just real numbers from someone who handles these shipments every week.</p>
<p>📱 <strong>WhatsApp:</strong> +86 186 8606 2666<br>📧 <strong>Email:</strong> ericma.sourcing@gmail.com</p>
<p>Or fill out the <a href="https://www.ericyiwusourcing.com/#contact">inquiry form on my website</a> and I'll get back to you within 24 hours with a detailed cost breakdown.</p>
<hr>
<p><em>Eric Ma is a Yiwu-based sourcing agent who helps small businesses import products from China with transparent pricing, low MOQ, and full cost visibility from day one.</em></p>`,
}

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
            dangerouslySetInnerHTML={{ __html: articleContents[slug || ''] || '' }}
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
