'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Legacy Oversized Hoodie',
      ref: 'DH-2024-001',
      price: 185.00,
      size: 'L',
      color: 'Off-White',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq9Uhbj4GOQ51vDw3NA8ReryzElsYOvvQUBaVmjaYU5jiILYOimcuh9OIBfva09wer8T_pQuB_owPir8eaa1nXX05WeP4OGpsXIvVuOINOF8-_5CTN4wIL0einm73hkVp80C1sBD7tKI_C5mfbD_oE8BpZrCgOkqNBRBv-Hseczll02uRZfg_a9JuAxBnfPj3yUvFTVi263derAzKi7_nwiDBkxzsKN9RbD-p3Md_DLoMdb8ZN45OPfvZpyd56rf62iSd17TekSUEi'
    },
    {
      id: 2,
      name: 'Signature Cargo Pants',
      ref: 'DH-2024-042',
      price: 220.00,
      size: '32',
      color: 'Sage Green',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWh9FdgS-3OtoTbQLy8K7HEU3lIYlmKyS6nQbJ1A-wUcNFBRMCJzqX2J-KMlhivUGPhpLZJzFp6lW93Ph8H3ceHxkZ-JDWlt5nmS1o1D4aqabbaw4qcMSaDcupGZGJVyY2IWhBU382fxm54KnYZRf2p_F0H95-_AspVbR7QWgnIOeTh4GUt82D5RE7CeFPWZuhZMF2fev4xCtdg31t_P_15hI0AcqWpzmxjBWXzSLvc7bx3gCVzYZyg8sKbOD9el_Gr_wMcizOXFKG'
    },
    {
      id: 3,
      name: 'Essential Boxy Tee',
      ref: 'DH-2024-009',
      price: 85.00,
      size: 'M',
      color: 'Pure White',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoh0Y6_oPN_I5-WYRGNHTCpnE3ZJHoTRt72QcYzJWG5ntpDL6haaOABCALxZyqIW692UJo3FAugg0cnnHhijBfAr4g6vmQGE-ATeNIcwOvnMU9TmF4xs85KluGVLNEeqtjEORI5tEWhN-nxyYj6TO_ACat3xTPNHtkY002oMrzTttZYy0h_mwe48e_8W8UD2lYs-EXz19sdXJH4pst5M_K5_8xRvzyyQO3UX57yU88M179OEJ4ietN5sfkWdqHB4TRbc4Y8V0PvMJy'
    }
  ])

  const [discountCode, setDiscountCode] = useState('')

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = 0
  const total = subtotal + shipping + tax

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Cart Items Section */}
          <div className="flex-1">
            <div className="mb-8 lg:mb-10">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-2 animate-slide-down">Shopping Bag</h1>
              <p className="text-slate-500 font-medium animate-slide-down animate-delay-100">
                Review your selection before checkout. ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </p>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 pb-6 lg:pb-8 border-b border-slate-100 dark:border-primary/10 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-full sm:w-32 lg:w-40 aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                        <p className="text-slate-500 text-sm mt-1">Ref: {item.ref}</p>
                        <div className="mt-4 flex flex-wrap gap-4 sm:gap-6 text-sm">
                          <p><span className="text-slate-400">Size:</span> <span className="font-semibold">{item.size}</span></p>
                          <p><span className="text-slate-400">Color:</span> <span className="font-semibold">{item.color}</span></p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                      <div className="flex items-center bg-slate-50 dark:bg-primary/5 rounded-full p-1 border border-slate-100 dark:border-primary/10 w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="size-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-primary/20 transition-all text-slate-600 hover:scale-110"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="px-4 font-bold text-sm min-w-[40px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="size-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-primary/20 transition-all text-slate-600 hover:scale-110"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-primary flex items-center gap-1 text-sm font-medium transition-all duration-300 hover:scale-105 w-fit"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-[400px] animate-slide-left">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-primary/5 p-6 lg:p-8 rounded-xl border border-slate-100 dark:border-primary/20 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-primary/10 flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</span>
                    <span className="text-2xl sm:text-3xl font-black text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6 lg:mb-8">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Discount Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 rounded-lg border-slate-200 dark:border-primary/20 bg-transparent focus:ring-primary focus:border-primary text-sm"
                      placeholder="Enter code"
                    />
                    <button className="px-4 sm:px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-lg text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95">
                      Apply
                    </button>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full py-4 sm:py-5 bg-primary text-white rounded-xl font-black text-base sm:text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                    Proceed to Checkout
                  </button>
                </Link>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-primary/10">
                  <div className="flex items-center gap-3 text-slate-500 mb-4">
                    <span className="material-symbols-outlined text-green-600">verified_user</span>
                    <span className="text-xs font-medium">Secure Checkout Powered by Remitly</span>
                  </div>
                  <div className="flex gap-4">
                    {['VISA', 'MASTER', 'AMEX', 'PAYPAL'].map((brand) => (
                      <div key={brand} className="h-6 w-10 bg-slate-50 dark:bg-white/10 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold">{brand}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="green" />
    </>
  )
}