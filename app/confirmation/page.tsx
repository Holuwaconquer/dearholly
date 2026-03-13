'use client'

import { useState, useEffect } from 'react'
// removed useSearchParams to avoid suspense warning
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react'

interface OrderData {
  _id: string
  items: Array<{
    productName: string
    price: number
    quantity: number
    size?: string
    color?: string
  }>
  totalPrice: number
  totalQuantity: number
  status: string
  paymentStatus: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  createdAt: string
}

export const dynamic = 'force-dynamic'

export default function ConfirmationPage() {
  const { token } = useAuth()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId'))
  }, [])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !token || !orderId) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok && data.data) {
          setOrder(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [mounted, token, orderId])

  if (!mounted) return null

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </main>
        <Footer variant="green" />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find your order. Please check the order ID and try again.</p>
            <Link href="/dashboard/orders">
              <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                View All Orders
              </button>
            </Link>
          </div>
        </main>
        <Footer variant="green" />
      </>
    )
  }

  const shipping = 0
  const tax = Math.round((order.totalPrice * 0.08) * 100) / 100
  const total = order.totalPrice + shipping + tax

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thank you for your order. Your items have been confirmed and will be prepared for shipment soon.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` | Color: ${item.color}`}
                          {` | Qty: ${item.quantity}`}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Shipping Address
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-1">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">📞 {order.shippingAddress.phone}</p>
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Order ID */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
                <p className="text-lg font-mono font-bold text-gray-900 dark:text-white break-all">{order._id}</p>
              </div>

              {/* Order Status */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Status</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Status</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium capitalize">
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      order.paymentStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl shadow-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">₦{order.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Shipping</span>
                    <span className="font-medium text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Tax (8%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">₦{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-emerald-200 dark:border-emerald-800 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-emerald-600">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <Link href="/dashboard/orders">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                  View All Orders
                </button>
              </Link>
              <Link href="/shop">
                <button className="w-full border border-gray-200 dark:border-gray-700 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <Footer variant="green" />
    </>
  )
}