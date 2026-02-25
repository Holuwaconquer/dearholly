'use client'

import Link from 'next/link'
import { useState } from 'react'

interface FooterProps {
  variant?: 'default' | 'green' | 'dark'
}

const Footer = ({ variant = 'green' }: FooterProps) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const footerVariants = {
    default: {
      bg: 'bg-slate-900',
      text: 'text-white',
      textMuted: 'text-slate-400',
      border: 'border-slate-800',
      accent: 'text-primary',
    },
    green: {
      bg: 'bg-deep-green',
      text: 'text-white',
      textMuted: 'text-white/60',
      border: 'border-white/10',
      accent: 'text-accent-green',
    },
    dark: {
      bg: 'bg-background-dark',
      text: 'text-white',
      textMuted: 'text-slate-400',
      border: 'border-white/5',
      accent: 'text-primary',
    },
  }

  const styles = footerVariants[variant] || footerVariants.default

  return (
    <footer className={`${styles.bg} ${styles.text} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`${styles.accent} transition-transform duration-300 group-hover:rotate-12`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold uppercase tracking-tighter">DearHolly</h2>
            </Link>
            <p className={`${styles.textMuted} text-sm leading-relaxed max-w-xs`}>
              Redefining luxury through the lens of modern street culture. Founded in Paris, designed for the world.
            </p>
            <div className="flex gap-4">
              {['public', 'share', 'mail'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className={`${styles.textMuted} hover:${styles.accent} transition-all duration-300 hover:scale-110`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${styles.accent}`}>Shop</h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Outerwear', 'Footwear', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link
                    href="/shop"
                    className={`${styles.textMuted} hover:${styles.accent} transition-all duration-300 hover:translate-x-2 inline-block`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${styles.accent}`}>Support</h4>
            <ul className="space-y-4">
              {['Shipping & Returns', 'Size Guide', 'Contact Us', 'Sustainability'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className={`${styles.textMuted} hover:${styles.accent} transition-all duration-300 hover:translate-x-2 inline-block`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${styles.accent}`}>Newsletter</h4>
            <p className={`${styles.textMuted} text-sm mb-6`}>
              Join the list for exclusive early access to drops.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className={`w-full bg-white/5 border ${styles.border} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${styles.text}`}
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-400 text-xs mt-2 animate-fade-in">
                ✓ Successfully subscribed!
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-16 pt-8 border-t ${styles.border} flex flex-col md:flex-row justify-between items-center gap-6`}>
          <p className={`${styles.textMuted} text-[10px] sm:text-xs uppercase tracking-widest text-center md:text-left`}>
            © {new Date().getFullYear()} DEARHOLLY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 sm:gap-8 text-[10px] font-black uppercase tracking-widest">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <Link
                key={item}
                href="#"
                className={`${styles.textMuted} hover:${styles.accent} transition-colors`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer