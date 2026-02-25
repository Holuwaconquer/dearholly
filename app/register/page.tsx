'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeTerms: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log('Registration attempt:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-2">Create your account</h2>
            <p className="text-slate-500 font-medium">Join our global community of fashion enthusiasts.</p>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-xl border border-primary/10">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 hover:bg-slate-50 transition-all duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-lg">brand_awareness</span>
                <span className="text-sm font-semibold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 hover:bg-slate-50 transition-all duration-300 hover:scale-105">
                <span className="material-symbols-outlined text-lg">account_circle</span>
                <span className="text-sm font-semibold">Apple</span>
              </button>
            </div>

            <div className="relative flex items-center py-2 mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or with email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full h-14 px-4 rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  placeholder="e.g. Holly Gold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-14 px-4 rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                  placeholder="name@luxury.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-14 px-4 rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-500 leading-tight">
                  I agree to the <Link href="/terms" className="text-slate-900 underline font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-slate-900 underline font-medium">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                <span>Get Started</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?
                <Link href="/login" className="font-bold text-white hover:underline ml-1">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="green" />
    </>
  )
}