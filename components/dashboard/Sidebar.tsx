// components/dashboard/Sidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  user: {
    name: string
    email: string
    membership: string
    avatar: string
  }
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user: authUser } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = authUser?.role === 'admin' ? [
    { href: '/dashboard/admin', label: 'Admin Overview', icon: 'dashboard', activeColor: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' },
    { href: '/dashboard/admin/users', label: 'Users', icon: 'group', activeColor: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' },
    { href: '/dashboard/admin/products', label: 'Products', icon: 'inventory', activeColor: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' },
    { href: '/dashboard/admin/categories', label: 'Categories', icon: 'category', activeColor: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' },
    { href: '/dashboard/admin/orders', label: 'Orders', icon: 'receipt', activeColor: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20' },
  ] : [
    { href: '/dashboard', label: 'Overview', icon: 'dashboard', activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20' },
    { href: '/dashboard/orders', label: 'Order History', icon: 'history', activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20' },
    { href: '/dashboard/wishlist', label: 'Wishlist', icon: 'favorite', activeColor: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20' },
    { href: '/dashboard/shipping', label: 'Shipping Info', icon: 'local_shipping', activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20' },
    { href: '/dashboard/profile', label: 'Profile', icon: 'person', activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20' },
    { href: '/dashboard/security', label: 'Security', icon: 'security', activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'settings', activeColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-emerald-500/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="material-symbols-outlined text-2xl">
          {isMobileOpen ? 'close' : 'menu'}
        </span>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`
          fixed md:sticky top-0 h-screen z-50
          bg-white dark:bg-gray-900
          border-r border-emerald-100 dark:border-emerald-900/30
          transition-all duration-500 ease-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto scrollbar-hide
          shadow-2xl shadow-emerald-500/5
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <motion.div 
            className="mb-8 flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-primary transition-transform duration-300 group-hover:rotate-12">
              <div className='w-[50px] h-[50px] overflow-hidden border-2 border-white/20'>
                <img src="/android-chrome-192x192.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            {!isCollapsed && (
              <motion.span 
                className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Dearholly
              </motion.span>
            )}
          </motion.div>

          {/* User Profile Section */}
          <motion.div 
            className={`
              mb-8 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 
              dark:from-emerald-950/30 dark:to-green-950/30 ${isCollapsed ? '' : 'border border-emerald-200'}
               dark:border-emerald-800/50
              flex items-center gap-4 transition-all duration-300
              ${isCollapsed ? 'justify-center' : ''}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2 }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="size-14 rounded-xl border-2 border-white dark:border-gray-800 bg-cover bg-center shadow-xl"
                style={{ backgroundImage: `url(${user.avatar})` }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
            </motion.div>
            
            {!isCollapsed && (
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item, index) => {
              const active = pathname === item.href
              const isHovered = hoveredItem === item.href
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                  onHoverStart={() => setHoveredItem(item.href)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-300 relative overflow-hidden group
                      ${isCollapsed ? 'justify-center' : ''}
                      ${active 
                        ? item.activeColor
                        : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }
                    `}
                  >
                    {!active && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10"
                        initial={{ x: '-100%' }}
                        animate={{ x: isHovered ? '0%' : '-100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    <span className="material-symbols-outlined relative z-10 text-xl">
                      {item.icon}
                    </span>
                    
                    {!isCollapsed && (
                      <>
                        <span className="font-medium relative z-10 flex-1">{item.label}</span>
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                          />
                        )}
                      </>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Sign Out Button */}
          <motion.div 
            className="mt-auto pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={handleLogout}
              className={`
                flex items-center gap-3 px-4 py-3 text-red-600
                hover:bg-red-50 dark:hover:bg-red-950/30 w-full rounded-xl 
                transition-all duration-300 relative overflow-hidden group
                ${isCollapsed ? 'justify-center' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="material-symbols-outlined relative z-10">logout</span>
              {!isCollapsed && <span className="font-medium relative z-10">Sign Out</span>}
            </motion.button>
          </motion.div>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex flex-col items-center justify-center absolute right-2 top-20 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full p-1.5 shadow-lg shadow-emerald-500/30 hover:shadow-xl"
            whileHover={{ scale: 1.1, rotate: isCollapsed ? 180 : -180 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <span className="material-symbols-outlined text-sm">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar