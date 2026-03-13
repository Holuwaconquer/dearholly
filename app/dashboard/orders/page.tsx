// app/dashboard/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (token && mounted) {
      fetchOrders()
    }
  }, [token, mounted])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success && data.data?.orders) {
        setOrders(data.data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filters = [
    { value: 'all', label: 'All Orders', color: 'emerald' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'processing', label: 'Processing', color: 'blue' },
    { value: 'shipped', label: 'Shipped', color: 'purple' },
    { value: 'delivered', label: 'Delivered', color: 'emerald' },
    { value: 'cancelled', label: 'Cancelled', color: 'rose' }
  ]

  const filteredOrders = filter === 'all' 
    ? orders
    : orders.filter(order => order.status?.toLowerCase() === filter)

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  }

  if (!mounted) return null

  return (
    <motion.main 
      className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Order History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track and manage your orders
            </p>
          </div>
          
          {/* Filters */}
          <motion.div 
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filters.map((f, index) => (
              <motion.button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  whitespace-nowrap
                  ${filter === f.value
                    ? `bg-${f.color}-500 text-white shadow-lg shadow-${f.color}-500/30`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {f.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-emerald-600 dark:text-emerald-400">Loading your orders...</p>
              </div>
            </motion.div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="material-symbols-outlined text-7xl text-emerald-200 dark:text-emerald-900">
                  shopping_bag
                </span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">No orders found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Start shopping to see your orders here</p>
              <Link href="/shop">
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 10 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <Link href={`/dashboard/orders/${order._id}`}>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Order Image */}
                        <motion.div 
                          className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-xl flex items-center justify-center"
                          whileHover={{ rotate: 5, scale: 1.05 }}
                        >
                          {order.items?.[0]?.productImage ? (
                            <div 
                              className="w-full h-full rounded-xl bg-cover bg-center"
                              style={{ backgroundImage: `url(${order.items[0].productImage})` }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-3xl text-emerald-600 dark:text-emerald-400">
                              shopping_bag
                            </span>
                          )}
                        </motion.div>

                        {/* Order Details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                                #{order._id?.substring(0, 8).toUpperCase()}
                              </p>
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-1">
                                {order.items?.[0]?.productName || 'Order'} 
                                {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                              </h3>
                              <div className="flex items-center gap-4 mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ₦{order.totalPrice?.toLocaleString() || 0}
                              </p>
                              <motion.span 
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                                  statusColors[order.status?.toLowerCase() as keyof typeof statusColors] || 
                                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {order.status || 'pending'}
                              </motion.span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <motion.div 
                          className="hidden md:block text-emerald-600"
                          whileHover={{ x: 5 }}
                        >
                          <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  )
}