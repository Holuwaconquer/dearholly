'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  Sparkles,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState('week')
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    avgOrderValue: 0,
    conversionRate: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect non-admin users
  useEffect(() => {
    if (mounted && user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [mounted, user, router])

  const fetchStats = async () => {
    if (!token) return
    setLoading(true)
    try {
      // Fetch users count
      const usersRes = await fetch('/api/admin/users?limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const usersData = await usersRes.json()
      const totalCustomers = usersData.success ? usersData.data.pagination.total : 0

      // Fetch orders count and revenue
      const ordersRes = await fetch('/api/admin/orders?limit=1000', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const ordersData = await ordersRes.json()
      const orders = ordersData.success ? ordersData.data.orders : []
      const totalOrders = ordersData.success ? ordersData.data.pagination.total : 0
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Fetch products count
      const productsRes = await fetch('/api/admin/products?limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const productsData = await productsRes.json()
      const totalProducts = productsData.success ? productsData.data.pagination.total : 0

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        avgOrderValue,
        conversionRate: 3.2 // placeholder
      })

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5).map((order: any) => ({
        id: order._id,
        customer: order.customerName || 'Unknown',
        amount: order.totalAmount || 0,
        status: order.status || 'pending',
        date: new Date(order.createdAt).toLocaleDateString()
      })))

    } catch (err) {
      console.error('Error fetching stats', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/dashboard/admin/orders/${orderId}`)
  }

  const handleEditStatus = (order: any) => {
    setSelectedOrder(order)
    setShowStatusModal(true)
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder || !token) return

    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) {
        throw new Error('Failed to update order status')
      }

      // Update the order in the recent orders list
      setRecentOrders(prev => prev.map(order =>
        order.id === selectedOrder.id
          ? { ...order, status: newStatus }
          : order
      ))

      setShowStatusModal(false)
      setSelectedOrder(null)
    } catch (err) {
      console.error('Error updating order status:', err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  useEffect(() => {
    if (mounted && token) fetchStats()
  }, [mounted, token])

  if (!mounted || (user && user.role !== 'admin')) return null


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Welcome back, Admin. Here's what's happening with your store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-10 px-3 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-sm"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { title: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'emerald', change: '+12.5%', trend: 'up' },
            { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'blue', change: '+8.2%', trend: 'up' },
            { title: 'Total Customers', value: stats.totalCustomers.toLocaleString(), icon: Users, color: 'purple', change: '+15.3%', trend: 'up' },
            { title: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: Package, color: 'amber', change: '+5.1%', trend: 'up' }
          ].map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown
            const trendColor = stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <span className={`flex items-center gap-1 text-sm ${trendColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </motion.div>
            )
          })}
        </motion.div>



        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <Link href="/dashboard/admin/orders">
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUp className="w-4 h-4 rotate-90" />
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        order.status === 'processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditStatus(order)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Order Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: 'Add Product', icon: Package, color: 'emerald' },
            { title: 'View Orders', icon: ShoppingBag, color: 'blue' },
            { title: 'Manage Users', icon: Users, color: 'purple' },
            { title: 'Analytics', icon: TrendingUp, color: 'amber' }
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 bg-${action.color}-50 dark:bg-${action.color}-900/20 rounded-xl border border-${action.color}-200 dark:border-${action.color}-800 flex items-center gap-3`}
              >
                <div className={`p-2 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className={`font-medium text-${action.color}-700 dark:text-${action.color}-300`}>
                  {action.title}
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowStatusModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Update Order Status
              </h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Order ID: {selectedOrder.id}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Customer: {selectedOrder.customer}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Status: <span className="font-medium capitalize">{selectedOrder.status}</span></p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Select New Status:</h4>
                {[
                  { value: 'pending', label: 'Payment Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                  { value: 'processing', label: 'Order Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
                  { value: 'shipped', label: 'Order Shipped', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
                  { value: 'delivered', label: 'Order Delivered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
                  { value: 'cancelled', label: 'Order Cancelled', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' }
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusUpdate(status.value)}
                    disabled={updatingStatus}
                    className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      selectedOrder.status === status.value
                        ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{status.label}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                        {status.value}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {updatingStatus && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
                    Updating status...
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}