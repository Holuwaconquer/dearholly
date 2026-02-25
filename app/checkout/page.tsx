'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle checkout logic
    console.log('Checkout data:', { formData, paymentMethod })
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Checkout Flow Section */}
          <div className="lg:col-span-8">
            {/* Breadcrumbs & Progress */}
            <div className="mb-8 lg:mb-10 animate-slide-down">
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Link href="/cart" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                  Cart
                </Link>
                <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span className="text-sm font-medium text-primary">Shipping</span>
                <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span className="text-sm font-medium text-slate-400">Payment</span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shipping Details</h1>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded w-fit">
                    Step 1 of 2
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-500 animate-pulse-slow" style={{ width: '50%' }}></div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Please provide your premium delivery details below.</p>
              </div>
            </div>

            {/* Form Sections */}
            <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
              {/* Contact Information */}
              <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">alternate_email</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary p-4 text-sm transition-all"
                      placeholder="holly@luxury.com"
                      required
                    />
                  </label>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary p-4 text-sm transition-all"
                      placeholder="Holly"
                      required
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary p-4 text-sm transition-all"
                      placeholder="Smith"
                      required
                    />
                  </label>
                  <label className="flex flex-col sm:col-span-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Address</span>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary p-4 text-sm transition-all"
                      placeholder="123 Streetwear Ave"
                      required
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">City</span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary p-4 text-sm transition-all"
                      placeholder="New York"
                      required
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Postal Code</span>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary p-4 text-sm transition-all"
                      placeholder="10001"
                      required
                    />
                  </label>
                </div>
              </section>

              {/* Payment Method Preview */}
              <section className="p-6 bg-accent-green/30 dark:bg-dark-green/10 rounded-xl border border-dark-green/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-dark-green">payments</span>
                  Secure Payment Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod('credit')}
                    className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      paymentMethod === 'credit'
                        ? 'border-primary bg-white dark:bg-slate-900'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <span className="material-symbols-outlined">credit_card</span>
                      <span className="font-bold text-sm">Credit Card</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('remitly')}
                    className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      paymentMethod === 'remitly'
                        ? 'border-primary bg-white dark:bg-slate-900'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'remitly'}
                      onChange={() => setPaymentMethod('remitly')}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <div className="ml-4 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-black italic tracking-tighter">Remitly</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">FAST</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Secure international transfer</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-4 rounded-lg font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Continue to Payment
                </button>
                <Link href="/cart" className="sm:w-1/3">
                  <button className="w-full border border-slate-200 dark:border-slate-800 py-4 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] active:scale-95">
                    Return to Shop
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 animate-slide-right" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 sticky top-28 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-8">
                {[
                  { name: 'Holly Signature Hoodie', details: 'Onyx Black / Large', price: 280.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGX9jKdc0HZjKZc3uzzktcFFr5y9C7D2n_kO8f21ruS_PfOzx5E2b-ezmwxl6WrP_qPzMoLL5jqTugGks8u0ayS4oAN5E9PzEURRSmVi7MYvrEOdLoekpiZoWEKq6YJ05L2h0sScoLWH7oq5OHExThbNYGvQpOaiDecJl5wcJ_NlkofV45ArgaMQ8bvR-8lZT3D9AYwArXisoKeCGuHRxX1-_xha18fLD-9j-nybPMVgubws5922shBvuREsFSL75mAFeQC1EnolP' },
                  { name: 'Crest High-Tops', details: 'Deep Red / 42', price: 450.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD6Iv9Ji6Zq-ymjnpy-bGyJAXg-lHVfv9EKvL9bOUor-1tfKQwzjZr88kVvngXL8Gl2MT_u4ug3XGbBe9HemHLi_uIkoaGQX_96z1nDXEuncKi4YaUc-h91tHMvn34N9gWPDtIst_ftLRH5-bP-ebEZLJiWqiM3euQk2SgIgq3QlwwSZ6dVsZB54A6hXGIetOBwNrvgrjJGQvvrG791-gpvPBrQhWro9bWT3Hq_1eEV8vLZqc-EIo4GGrS-8vOeKvTnNvVdxRAlnwW' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.details}</p>
                      <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold">$730.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-dark-green font-semibold">Free Express</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-semibold">$62.05</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-primary">$792.05</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-center gap-4 opacity-50 grayscale">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                  <span className="material-symbols-outlined text-3xl">lock</span>
                  <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
                </div>
                <p className="text-[10px] text-center mt-4 text-slate-400 uppercase tracking-widest font-bold">
                  Secure Checkout Powered by SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="green" />
    </>
  )
}