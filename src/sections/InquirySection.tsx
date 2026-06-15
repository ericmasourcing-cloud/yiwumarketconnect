import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const FORM_API_URL = 'https://script.google.com/macros/s/AKfycbxaFHipnK8vIpqurqoxh-V8dQVIL9ClwmPefrGn58sb6qXGJzoUBP9_mAKHWmeUHDi7Jw/exec'

export default function InquirySection() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    quantity: '',
    destination: '',
    customization: 'No',
    message: '',
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const iframe = document.getElementById('hidden-iframe') as HTMLIFrameElement
    const form = e.target as HTMLFormElement
    if (iframe) {
      form.submit()
      setSubmitted(true)
      setFormData({ category: '', quantity: '', destination: '', customization: 'No', message: '', email: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  return (
    <section id="inquiry" className="relative py-[80px] md:py-[120px]" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}>
              <span className="text-base">📩</span>
              <span className="font-body text-[14px] font-medium text-white">Get a wholesale quote in 24h</span>
            </div>
            <h2
              className="font-display font-medium text-white"
              style={{
                fontSize: 'clamp(32px, 3.5vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Send your inquiry
            </h2>
            <p
              className="font-body text-[18px] leading-[1.7] mt-5"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              For the fastest reply, include your product category, target quantity, destination city and whether you need plain stock or customized packing.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'Real Yiwu market photos and item numbers',
                'MOQ, packing and customization checked',
                'Reply within 24 hours on business days',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={20} style={{ color: 'var(--gold)' }} />
                  <span className="font-body text-[16px] text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="relative rounded-3xl p-8 md:p-10 border"
            style={{
              background: 'var(--pure-white)',
              borderColor: 'rgba(255,255,255,0.1)',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.25)',
            }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--ksa-green-light)' }}
                >
                  <CheckCircle size={32} style={{ color: 'var(--ksa-green)' }} />
                </div>
                <h3 className="font-display text-[24px] font-medium" style={{ color: 'var(--navy)' }}>
                  Inquiry sent!
                </h3>
                <p className="font-body text-[16px] mt-2" style={{ color: 'var(--navy-60)' }}>
                  We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                action={FORM_API_URL}
                method="POST"
                target="hidden-iframe"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-[13px] font-medium block mb-1.5" style={{ color: 'var(--navy-80)' }}>
                      Product category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Eid decorations"
                      required
                      className="w-full px-4 py-3 rounded-xl border font-body text-[15px] focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: 'var(--navy-15)',
                        color: 'var(--navy)',
                        background: 'var(--warm-white)',
                        '--tw-ring-color': 'var(--ksa-green)',
                      } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="font-body text-[13px] font-medium block mb-1.5" style={{ color: 'var(--navy-80)' }}>
                      Target quantity
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 500 sets"
                      required
                      className="w-full px-4 py-3 rounded-xl border font-body text-[15px] focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: 'var(--navy-15)',
                        color: 'var(--navy)',
                        background: 'var(--warm-white)',
                        '--tw-ring-color': 'var(--ksa-green)',
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-[13px] font-medium block mb-1.5" style={{ color: 'var(--navy-80)' }}>
                      Destination city
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g. Riyadh"
                      required
                      className="w-full px-4 py-3 rounded-xl border font-body text-[15px] focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: 'var(--navy-15)',
                        color: 'var(--navy)',
                        background: 'var(--warm-white)',
                        '--tw-ring-color': 'var(--ksa-green)',
                      } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="font-body text-[13px] font-medium block mb-1.5" style={{ color: 'var(--navy-80)' }}>
                      Custom packing / logo
                    </label>
                    <select
                      name="customization"
                      value={formData.customization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border font-body text-[15px] focus:outline-none focus:ring-2 transition-all appearance-none"
                      style={{
                        borderColor: 'var(--navy-15)',
                        color: 'var(--navy)',
                        background: 'var(--warm-white)',
                        '--tw-ring-color': 'var(--ksa-green)',
                      } as React.CSSProperties}
                    >
                      <option value="No">No, plain stock</option>
                      <option value="Yes">Yes, custom packing / logo</option>
                      <option value="Not sure">Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-body text-[13px] font-medium block mb-1.5" style={{ color: 'var(--navy-80)' }}>
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border font-body text-[15px] focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: 'var(--navy-15)',
                      color: 'var(--navy)',
                      background: 'var(--warm-white)',
                      '--tw-ring-color': 'var(--ksa-green)',
                    } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="font-body text-[13px] font-medium block mb-1.5" style={{ color: 'var(--navy-80)' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us more about what you are looking for..."
                    className="w-full px-4 py-3 rounded-xl border font-body text-[15px] focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      borderColor: 'var(--navy-15)',
                      color: 'var(--navy)',
                      background: 'var(--warm-white)',
                      '--tw-ring-color': 'var(--ksa-green)',
                    } as React.CSSProperties}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group inline-flex items-center justify-center gap-2 font-display text-[16px] font-medium px-8 py-[14px] rounded-xl text-white transition-all duration-300"
                  style={{ background: 'var(--ksa-green)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--ksa-green-dark)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 108, 53, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--ksa-green)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Send size={18} />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <iframe name="hidden-iframe" id="hidden-iframe" style={{ display: 'none' }} title="hidden-form-target" />
    </section>
  )
}
