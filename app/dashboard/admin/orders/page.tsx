// app/dashboard/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  Download,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const { user, token } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersData, setOrdersData] = useState<any[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingOrders, setLoadingOrders] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchOrders = async (page = 1) => {
    if (!token) return
    setLoadingOrders(true)
    try {
      const url = new URL('/api/admin/orders', location.origin)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', '10')
      if (selectedStatus !== 'all') url.searchParams.set('status', selectedStatus)
      if (searchQuery) url.searchParams.set('search', searchQuery)
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        // Transform order data to match dashboard expectations
        const transformedOrders = (data.data.orders || []).map((order: any) => ({
          id: order._id?.toString().slice(-8) || 'N/A',
          fullId: order._id?.toString() || '',
          customer: order.userId ? `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
          email: order.userId?.email || 'N/A',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
          items: order.totalQuantity || 0,
          total: order.totalPrice || 0,
          status: order.status || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          paymentMethod: order.paymentMethod || 'unknown',
          paymentProof: order.paymentProof,
          _id: order._id
        }))
        setOrdersData(transformedOrders)
        setTotalOrders(data.data.pagination?.total || 0)
        setTotalPages(data.data.pagination?.pages || 1)
      }
    } catch (err) {
      console.error('Error fetching orders', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (mounted) fetchOrders(currentPage)
  }, [mounted, token, selectedStatus, searchQuery, currentPage])

  // use fetched orders
  const orders = ordersData

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })


  if (!mounted) return null

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
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Order Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Track and manage all customer orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-11 px-4 text-white border border-gray-200 dark:border-gray-700 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {(() => {
            const total = totalOrders
            const pending = ordersData.filter(o => o.status === 'pending').length
            const processing = ordersData.filter(o => o.status === 'processing').length
            const delivered = ordersData.filter(o => o.status === 'delivered').length
            const stats = [
              { title: 'Total Orders', value: total.toLocaleString(), icon: ShoppingBag, color: 'emerald' },
              { title: 'Pending', value: pending.toString(), icon: Clock, color: 'amber' },
              { title: 'Processing', value: processing.toString(), icon: Package, color: 'blue' },
              { title: 'Delivered', value: delivered.toString(), icon: CheckCircle, color: 'purple' }
            ]
            return stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                      <Icon className={`w-6 h-6 text-white`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-100">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </motion.div>
              )
            })
          })()}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or customer..."
                className="w-full h-11 text-white pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Range */}
            <select
              className="h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        {loadingOrders ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-white">{order.customer}</p>
                        <p className="text-sm text-gray-300">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-white" />
                        {order.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 text-white py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        statusColors[order.status as keyof typeof statusColors]
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        order.paymentStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : order.paymentStatus === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {order.paymentMethod || 'unknown'}
                      </span>
                      {order.paymentProof && (
                        <span className="ml-2 text-xs text-emerald-300">Proof</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/orders/${order.fullId}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-100">
              Showing {(currentPage - 1) * 10 + 1} to {(currentPage - 1) * 10 + orders.length} of {totalOrders} orders
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-white rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <span className="text-sm text-gray-100">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-white rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </motion.div>
  )
}