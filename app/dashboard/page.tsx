// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

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
      if (data.success) {
        const list = Array.isArray(data.data) ? data.data : data.data.orders || []
        // Transform order data to match dashboard expectations
        const transformedOrders = list.slice(0, 3).map((order: any) => ({
          id: order._id?.toString().slice(-8) || 'N/A',
          name: order.items?.[0]?.productName || 'Order',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
          amount: order.totalPrice || 0,
          status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'
        }))
        setOrders(transformedOrders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts
  const spendingData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 3908 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 3800 },
  ]

  const categoryData = [
    { name: 'Fragrance', value: 35 },
    { name: 'Jewelry', value: 25 },
    { name: 'Gift Sets', value: 20 },
    { name: 'Accessories', value: 20 },
  ]

  const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']

  if (!mounted) return null

  const profileData = {
    fullName: user ? `${user.firstName} ${user.lastName}` : 'User',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+1 (555) 000-1234',
    memberSince: '2023'
  }

  const recentOrders = orders.length > 0 ? orders : [
    {
      id: 'ORD-001',
      name: 'Signature Velvet Box',
      date: 'Oct 12, 2023',
      amount: 124.00,
      status: 'Delivered',
      image: '/images/product-1.jpg'
    },
    {
      id: 'ORD-002',
      name: 'Aurora Pearl Watch',
      date: 'Oct 10, 2023',
      amount: 450.00,
      status: 'Processing',
      image: '/images/product-2.jpg'
    },
    {
      id: 'ORD-003',
      name: 'No. 4 Sandalwood',
      date: 'Oct 8, 2023',
      amount: 45.00,
      status: 'Shipped',
      image: '/images/product-3.jpg'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.main 
      className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Welcome back, {profileData.fullName.split(' ')[0]}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Here's what's happening with your account today
            </p>
          </div>
          <motion.div 
            className="hidden md:flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <span className="material-symbols-outlined text-emerald-500">calendar_today</span>
            <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Orders', value: orders.length.toString(), icon: 'shopping_bag', change: '+12%', color: 'emerald' },
            { label: 'Total Spent', value: `₦${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString()}`, icon: 'wallet', change: '+5%', color: 'blue' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                  <span className={`material-symbols-outlined text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.icon}
                  </span>
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Chart */}
          <motion.div 
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#spendingGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Shopping Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
              <Link href="/dashboard/orders">
                <motion.span 
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  whileHover={{ x: 5 }}
                >
                  View All
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </motion.span>
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">
                      shopping_bag
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{order.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">₦{order.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: '/dashboard/payments', icon: 'credit_card', title: 'Payment Methods', desc: 'Manage your payment options', color: 'emerald' },
            { href: '/dashboard/shipping', icon: 'local_shipping', title: 'Shipping Info', desc: 'Update delivery addresses', color: 'blue' },
            { href: '/dashboard/wishlist', icon: 'favorite', title: 'Wishlist', desc: 'View saved items', color: 'rose' }
          ].map((action, index) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl cursor-pointer group"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-3 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-${action.color}-600 dark:text-${action.color}-400 text-2xl`}>
                    {action.icon}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.main>
  )
}