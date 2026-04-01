'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 2000)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-900/60 to-slate-900/80 z-10"></div>
          </div>
          <div className="relative z-20 text-center px-4 max-w-4xl animate-fade-in">
            <h1 className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[0.9] tracking-tighter animate-slide-up">
              Get In <span className="text-red-500 italic">Touch.</span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-slide-up animate-delay-200">
              Have questions about our collections, need styling advice, or want to collaborate? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background-light">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Info */}
              <div className="space-y-8 lg:space-y-12 animate-slide-right">
                <div>
                  <h2 className="text-primary text-lg font-bold uppercase tracking-[0.3em] mb-4">Contact Information</h2>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl text-slate-800 font-bold leading-tight mb-6">
                    Let's Start a Conversation
                  </h3>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                    Whether you're interested in our latest drops, have questions about sizing, or want to discuss a potential partnership, our team is here to help.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Visit Our Store</h4>
                      <p className="text-slate-600">123 Fashion Street<br />Paris, France 75001</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">phone</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Call Us</h4>
                      <p className="text-slate-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">mail</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Email Us</h4>
                      <p className="text-slate-600">hello@dearholly.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Business Hours</h4>
                      <p className="text-slate-600">Mon - Fri: 9AM - 6PM<br />Sat: 10AM - 4PM<br />Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="animate-slide-left">
                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>

                  {isSubmitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">Thank you for your message! We'll get back to you within 24 hours.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined animate-spin">refresh</span>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="green" />
    </>
  )
}