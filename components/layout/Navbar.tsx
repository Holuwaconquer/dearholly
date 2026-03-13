'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, token, logout } = useAuth()
  const { getTotalItems } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Our Story' },
    { href: '/#', label: 'Music' },
    { href: '/shop', label: 'Collection' },
    { href: '/community', label: 'Community' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-deep-green/95 backdrop-blur-md border-b border-primary/20 py-2 shadow-lg' 
          : 'bg-deep-green py-3 md:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="text-primary transition-transform duration-300 group-hover:rotate-12">
              <div className='w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white/20'>
                <img src="/android-chrome-192x192.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tighter uppercase text-white transition-colors group-hover:text-primary">
                  DearHolly
                </h1>
                <p className="text-[10px] sm:text-xs font-medium text-white/70 -mt-1">wears by Amavu Paul Odiana</p>
              </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:text-primary group ${
                  isActive(link.href) ? 'text-accent-green' : 'text-white/90'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive(link.href) ? 'w-full bg-accent-green' : 'w-0 bg-primary group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-1.5 sm:p-2 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110 text-white/90 hover:text-primary">
              <span className="material-symbols-outlined text-xl sm:text-2xl">search</span>
            </button>
            
            <Link href="/cart" className="relative p-1.5 sm:p-2 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110 text-white/90 hover:text-primary group">
              <span className="material-symbols-outlined text-xl sm:text-2xl">shopping_bag</span>
              {getTotalItems() > 0 && (
                <>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full">
                    {getTotalItems()}
                  </span>
                </>
              )}
            </Link>

            {/* User Menu or Login */}
            {mounted && (
              token && user ? (
                <div className="relative hidden sm:block">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110 text-white/90 hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">person</span>
                    <span className="text-sm font-semibold hidden md:inline text-white/90">{user.firstName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-primary/10 py-2 z-50 animate-slide-down">
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link 
                        href="/dashboard/profile" 
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-all"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                        <span className="font-medium">Profile</span>
                      </Link>
                      <div className="border-t border-primary/10 my-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all"
                      >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="p-1.5 sm:p-2 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110 text-white/90 hover:text-primary hidden sm:block">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">person</span>
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-primary/20 rounded-full transition-all duration-300 text-white/90"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-2 py-4 border-t border-white/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-primary/20 hover:pl-6 rounded-lg ${
                  isActive(link.href) 
                    ? 'bg-primary/20 text-white' 
                    : 'text-white/90 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {mounted && (
              !token ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-primary/20 hover:pl-6 rounded-lg text-white/90 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-primary/20 hover:pl-6 rounded-lg text-white/90 hover:text-primary"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-primary/20 hover:pl-6 rounded-lg text-white/90 hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-red-500/20 hover:pl-6 rounded-lg text-red-400 hover:text-red-300 w-full text-left"
                >
                  Logout
                </button>
              </>
            )
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar