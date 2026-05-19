import { useState } from 'react'
import SectionLabel from '@/components/SectionLabel'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const FORM_API_URL = 'https://script.google.com/macros/s/AKfycbwGpjayrb00aNF_5nF5Nn5SP7Nl7U9qv6eGZIoV2lcQz_iZ1817hRiTdlDg33YljCYpOA/exec'

export default function InquiryFormSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({ y: 40 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    businessType: '',
    productDescription: '',
    orderVolume: '',
    shippingCountry: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(FORM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Website'
        }),
      })
      const result = await response.json()
      if (result.success) {
        setSubmitted(true)
        setFormData({ name: '', email: '', whatsapp: '', businessType: '', productDescription: '', orderVolume: '', shippingCountry: '' })
      } else {
        setError(result.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again or contact me on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses = "w-full h-[52px] px-4 rounded-lg border-[1.5px] font-body text-[16px] outline-none transition-all duration-200 focus:border-[var(--orange)] focus:shadow-[0_0_0_3px_var(--orange-light)]"
  const inputStyle = {
    borderColor: 'var(--navy-15)',
    background: 'var(--pure-white)',
    color: 'var(--navy)',
  }

  return (
    <section id="contact" style={{ background: 'var(--beige)' }}>
      <div ref={sectionRef} className="max-w-[720px] mx-auto px-6 md:px-12 py-[80px] md:py-[120px]">
        <SectionLabel text="GET STARTED" centered />
        <h2
          className="font-display font-medium mt-4 text-center"
          style={{
            fontSize: 'clamp(32px, 3.5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--navy)',
          }}
        >
          Tell Me What You're Looking For
        </h2>
        <p
          className="font-body text-[16px] leading-[1.6] text-center mt-4 max-w-[560px] mx-auto"
          style={{ color: 'var(--navy-60)' }}
        >
          Fill out the form below and I'll get back to you within 24 hours with initial feedback and questions. Or chat with me directly on WhatsApp for a quicker response.
        </p>

        <div
          className="mt-12 bg-white rounded-2xl p-8 md:p-12 border"
          style={{
            borderColor: 'var(--navy-15)',
            boxShadow: '0 8px 32px rgba(10, 37, 64, 0.08)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@yourshop.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                WhatsApp Number (optional)
              </label>
              <input
                type="tel"
                name="whatsapp"
                placeholder="+31 6 1234 5678"
                value={formData.whatsapp}
                onChange={handleChange}
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                What type of business are you?
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className={inputClasses}
                style={inputStyle}
              >
                <option value="">Select your business type...</option>
                <option value="online">Online Seller (Amazon, eBay, Etsy, etc.)</option>
                <option value="gift">Gift Store / Toy Store</option>
                <option value="pet">Pet Shop</option>
                <option value="boutique">Boutique / Retail Store</option>
                <option value="social">Instagram / TikTok Seller</option>
                <option value="importer">Small Importer / Distributor</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Product Description */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                What products are you looking for? *
              </label>
              <textarea
                name="productDescription"
                required
                rows={5}
                placeholder="Describe the products you're looking for, including type, quantity, target price range, quality preferences, and any design or packaging requirements. You can also paste links to reference products."
                value={formData.productDescription}
                onChange={handleChange}
                className={inputClasses + " py-4 min-h-[140px] resize-y"}
                style={inputStyle}
              />
            </div>

            {/* Order Volume */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                Approximate order quantity?
              </label>
              <select
                name="orderVolume"
                value={formData.orderVolume}
                onChange={handleChange}
                className={inputClasses}
                style={inputStyle}
              >
                <option value="">Select quantity range...</option>
                <option value="50-100">50–100 pieces</option>
                <option value="100-500">100–500 pieces</option>
                <option value="500-1000">500–1,000 pieces</option>
                <option value="1000-5000">1,000–5,000 pieces</option>
                <option value="5000+">5,000+ pieces</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>

            {/* Shipping Country */}
            <div>
              <label className="font-body text-[14px] font-medium block mb-2" style={{ color: 'var(--navy)' }}>
                Which country are you shipping to?
              </label>
              <input
                type="text"
                name="shippingCountry"
                placeholder="e.g., Germany, USA, Australia"
                value={formData.shippingCountry}
                onChange={handleChange}
                className={inputClasses}
                style={inputStyle}
              />
            </div>

            {/* Submit */}
            {submitted ? (
              <div className="text-center py-6 rounded-xl" style={{ background: 'var(--green-light)' }}>
                <p className="font-display text-[20px] font-medium" style={{ color: 'var(--green)' }}>
                  ✅ Thank you!
                </p>
                <p className="font-body text-[16px] mt-2" style={{ color: 'var(--navy-60)' }}>
                  I've received your inquiry and will reply within 24 hours. Check your email or WhatsApp!
                </p>
              </div>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-display text-[16px] font-medium py-4 rounded-xl text-white transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'var(--orange)' }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.background = '#E55A2B'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.35)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--orange)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {submitting ? 'Sending...' : 'Send Inquiry →'}
                </button>
                {error && (
                  <p className="font-body text-[14px] text-center mt-3" style={{ color: '#dc2626' }}>
                    {error}
                  </p>
                )}
                <p
                  className="font-body text-[13px] text-center mt-2"
                  style={{ color: 'var(--navy-40)' }}
                >
                  I'll reply within 24 hours. Your information is kept confidential.
                </p>
              </>
            )}
          </form>
        </div>

        {/* WhatsApp Alternative */}
        <div className="flex flex-col items-center mt-10">
          <span className="font-body text-[16px]" style={{ color: 'var(--navy-60)' }}>
            Prefer to chat?
          </span>
          <a
            href="https://wa.me/8618686062666"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300"
            style={{ background: 'var(--green)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Chat on WhatsApp 💬
          </a>
        </div>
      </div>
    </section>
  )
}
