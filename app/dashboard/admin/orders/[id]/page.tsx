'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  User,
  ShoppingBag,
  Edit,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  size?: string
  color?: string
}

interface Order {
  _id: string
  items: OrderItem[]
  totalPrice: number
  totalQuantity: number
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentProof?: string
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  userId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const { user, token } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingStatus, setEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchOrder = async () => {
      try {
        if (!id) {
          setError('Invalid order ID')
          setLoading(false)
          return
        }

        const res = await fetch(`/api/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) {
          if (res.status === 404) {
            setError('Order not found')
          } else if (res.status === 403) {
            setError('Access denied')
          } else {
            setError('Failed to load order')
          }
          return
        }

        const data = await res.json()
        if (data.success) {
          setOrder(data.data)
          setNewStatus(data.data.status)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, token, router])

  const handleStatusUpdate = async () => {
    if (!order || !token) return

    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
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

      const data = await res.json()
      if (data.success) {
        setOrder(prev => prev ? { ...prev, status: newStatus } : null)
        setEditingStatus(false)
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      setError('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
          <p className="text-gray-500 mb-8">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
          <Link href="/dashboard/admin/orders">
            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg">Back to Orders</button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <motion.main
        initial={{ opacity: 100 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/dashboard/admin/orders" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Order #{order._id.slice(-8)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.userId.firstName} {order.userId.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.userId.email}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status</h2>
                  {!editingStatus ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingStatus(true)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStatusUpdate}
                        disabled={updating}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {updating ? 'Saving...' : 'Save'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingStatus(false)
                          setNewStatus(order.status)
                        }}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>

                {!editingStatus ? (
                  <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                ) : (
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">₦{item.price.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary & Customer Info */}
            <div className="space-y-6">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">₦{order.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-emerald-600">₦{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Customer Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.userId.firstName} {order.userId.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: {order.userId._id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{order.userId.email}</span>
                  </div>
                  {order.userId.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{order.userId.phone}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Shipping Address</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{order.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="text-gray-900 dark:text-white">
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Proof (if manual payment) */}
              {order.paymentMethod === 'manual' && order.paymentProof && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Proof</h2>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Proof of payment uploaded</p>
                    <button
                      onClick={() => window.open(order.paymentProof, '_blank')}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View Proof →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.main>
    </>
  )
}