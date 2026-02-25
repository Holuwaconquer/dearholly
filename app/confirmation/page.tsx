'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ConfirmationPage() {
  const orderItems = [
    {
      id: 1,
      name: 'Midnight Shadow Oversized Hoodie',
      details: 'Onyx Black / Size L',
      price: 345.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4MPytEVaVV0akYCtgjzhgcH09vNfrn9IvpzaM8k7egzaxqNAgqMTHortMhBMnPlVdpnabdHUGPMThLIq6rBMO6gsGfzaPJEKkZXPmea88VwoPH84WgDSXw0vtC0G3NB3X5ZkikShBWUOin4WKcpDuPysd4NsOT6I46mfwQlFX4rWEwbE0Rz3NoYPEScpUi9bpCuDm0V71fGguWwnBbCOUXEZbBm7-tmkOn-h6iDohU8swtzKd8UK6j6WozaMaFFeqLeBQ1B0lnPif'
    },
    {
      id: 2,
      name: 'Modular Cargo Trousers',
      details: 'Olive Drab / Size 32',
      price: 420.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiapLWOplsE_lQv8x3bz2PTMPnqa9BSWZEtRNZB3qA8RSpTWHieolCQkjcAkJy7DhIxRWvYrqliNTO3CYziIIP5NP9Of0DvsPEX0R62JoTfHhKej3v2F4tGVbrCT7YFlyx8H4j25xc7oeKgnTlrcOKd8e1T84zVV05mSAXl9fvJCRyxdPknIkJtM8BkglmIXA5bWxRGNdV7c_5GMwXtke5AcUVohs8fyBuL89lbj_C0lBDMpiTSVFY_0UfsPlXDxpM4EnPNkd6qUyb'
    },
    {
      id: 3,
      name: 'Silk Embroidery Signature Cap',
      details: 'Deep Crimson / One Size',
      price: 125.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhv60W1taHGIJaFuIjcWouAdvBrPuFUZmyYY21arW3vbpRYSpRdGos0ro_YHoNhHzPaa1cyFOzdJloYHwrb17LZOR9yITtSCFKkTrp1OZpFpal2KAJRFcDlGdesFxhph7P_hcqmi-XHPI9Bjy7FhCk4f8IrvBHO4iOO6T_6FPSd0Qozhys_ohVfywi8HKMS3rE0My3XSY82_7RASmC_WydB0YgvIb2nkLVf6oC6RxbTeGpv_lFrz7OqYfAwQsDTLWsIFTY_yEhVbO_'
    }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 25.00
  const tax = 71.20
  const total = subtotal + shipping + tax

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap pb-2 animate-slide-down">
          <Link href="/cart" className="text-primary/60 text-sm font-medium hover:text-primary transition-colors">
            Cart
          </Link>
          <span className="material-symbols-outlined text-primary/30 text-sm">chevron_right</span>
          <Link href="/checkout" className="text-primary/60 text-sm font-medium hover:text-primary transition-colors">
            Shipping
          </Link>
          <span className="material-symbols-outlined text-primary/30 text-sm">chevron_right</span>
          <Link href="/payment" className="text-primary/60 text-sm font-medium hover:text-primary transition-colors">
            Payment
          </Link>
          <span className="material-symbols-outlined text-primary/30 text-sm">chevron_right</span>
          <span className="text-primary text-sm font-bold border-b-2 border-primary pb-1">Review & Confirm</span>
        </nav>

        <div className="mb-8 lg:mb-10 animate-slide-down">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2">Final Confirmation</h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl">
            One last look at your selection. Everything is prepared for your exclusive DearHolly pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-8 lg:space-y-10">
            {/* Shipping & Logistics */}
            <section className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-primary/5 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <h3 className="text-lg font-bold">Shipping & Logistics</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Delivery Address</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                    Johnathan Sterling<br />
                    452 Upper East Side Blvd, Ste 12A<br />
                    Manhattan, NY 10022<br />
                    United States
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Shipping Method</p>
                  <div className="bg-accent-green text-slate-800 p-3 rounded-lg border border-green-200">
                    <p className="font-bold text-sm">Express Priority</p>
                    <p className="text-xs">Estimated Delivery: 2-3 Business Days</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Details */}
            <section className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-primary/5 shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="text-lg font-bold">Payment Details</h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded border border-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600">credit_card</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Visa Platinum Selection</p>
                    <p className="text-xs text-slate-500">Ending in •••• 8892 • Exp 05/27</p>
                  </div>
                </div>
                <button className="text-primary text-xs font-bold underline hover:no-underline transition-colors">
                  EDIT
                </button>
              </div>
            </section>

            {/* Order Items */}
            <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                <h3 className="text-lg font-bold">Your Selection ({orderItems.length})</h3>
              </div>
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-primary/5 items-start sm:items-center hover:shadow-md transition-shadow animate-fade-in"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <img 
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-slate-100" 
                      src={item.image} 
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h4>
                      <p className="text-sm text-slate-500">{item.details}</p>
                      <p className="text-sm font-bold mt-1 text-primary">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 animate-slide-left" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white dark:bg-slate-800/80 p-6 lg:p-8 rounded-2xl border-2 border-primary/10 shadow-xl sticky top-28">
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-primary/10">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="text-sm font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="text-sm font-medium">Express Shipping</span>
                  <span className="text-sm font-bold">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="text-sm font-medium">Estimated Taxes</span>
                  <span className="text-sm font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-primary/10">
                  <span className="text-lg font-extrabold">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-black text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-accent-green/30 p-4 rounded-lg border border-green-100 mb-8">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-green-700 text-sm">verified_user</span>
                  <p className="text-xs text-green-800 font-medium leading-relaxed">
                    Your order is protected by our luxury guarantee. Authentic pieces, secure transaction, and premium handling included.
                  </p>
                </div>
              </div>

              <Link href="/success">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 sm:py-5 rounded-xl text-base sm:text-lg uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 group">
                  Place Order
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </Link>

              <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
                By placing this order, you agree to DearHolly's <br />
                <Link href="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="underline hover:text-primary transition-colors">Luxury Purchase Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="green" />
    </>
  )
}