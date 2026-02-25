'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', { email, password })
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-2">Welcome Back</h2>
            <p className="text-gray-400 font-medium">Enter the DearHolly collective</p>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-xl border border-primary/10">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.96.95-2.21 1.72-3.72 1.72-1.47 0-2.52-.77-3.61-.77-1.12 0-2.3.75-3.56.75-2.58 0-4.9-3.41-4.9-7.15 0-3.66 2.3-5.59 4.45-5.59 1.12 0 2.04.59 3.12.59 1.04 0 1.83-.59 3.16-.59 1.43 0 2.7.75 3.51 1.83-2.9 1.47-2.43 5.42.45 6.64-.72 1.94-1.9 3.57-2.9 4.57zm-3.03-15.02c0-2.34 1.92-4.24 4.24-4.24.11 0 .22.01.32.02-.09 2.38-2.08 4.21-4.32 4.21-.08 0-.16-.01-.24-.01v.02z"></path>
                </svg>
                Apple
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-800/50 px-2 text-slate-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-primary/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-14 px-4 transition-all outline-none"
                  placeholder="amaru@dearholly.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-gray-300 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-primary/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-14 px-4 transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary transition-colors"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                  Stay signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-4 text-white font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                New to the collective?
                <Link href="/register" className="font-bold text-white hover:underline ml-1">
                  Join the Collective
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