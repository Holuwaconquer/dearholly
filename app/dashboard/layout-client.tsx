'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/dashboard/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { token, user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Ensure we don't render until after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login')
    }
  }, [token, loading, router])

  useEffect(() => {
    if (!loading && token && user && user.role !== 'admin') {
      if (pathname.startsWith('/dashboard/admin')) {
        router.push('/dashboard')
      }
    }
  }, [token, loading, user, router, pathname])

  // Show nothing until after hydration to prevent mismatch
  if (!mounted) {
    return null
  }

  if (loading || !token) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">Loading your dashboard...</p>
        </motion.div>
      </motion.div>
    )
  }

  const sidebarUser = user ? {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    membership: user.role === 'admin' ? 'Executive Member' : 'Premium Member',
    avatar: 'https://via.placeholder.com/150'
  } : {
    name: 'User',
    email: 'user@example.com',
    membership: 'Member',
    avatar: ''
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar user={sidebarUser} />
      <motion.main 
        className="flex-1 overflow-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  )
}
