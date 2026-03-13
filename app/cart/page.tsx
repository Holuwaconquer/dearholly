// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCartItems(JSON.parse(stored))
    }
    setMounted(true)
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'LUXURY20') {
      setDiscountApplied(true)
      setDiscountAmount(subtotal * 0.2)
    }
  }

  if (!mounted) return null

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 25
  const total = subtotal + shipping - discountAmount

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center justify-center p-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6"
            >
              <ShoppingBag className="w-12 h-12 text-emerald-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Add some luxury items to get started</p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </motion.main>
        <Footer variant="green" />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-40 pb-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="flex-1">
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 md:h-32 bg-linear-to-br from-emerald-100 to-green-100 rounded-xl overflow-hidden shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-emerald-600/30" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {item.size && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Size: <span className="font-medium text-gray-700 dark:text-gray-300">{item.size}</span>
                                </p>
                              )}
                              {item.color && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Color: <span className="font-medium text-gray-700 dark:text-gray-300">{item.color}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₦{item.price.toLocaleString('en-NG')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                          <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1 text-red-300 hover:text-rose-700 text-sm font-medium w-fit"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Link href="/shop">
                  <motion.button
                    whileHover={{ x: -5 }}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Continue Shopping
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-96"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                {/* Discount Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Discount code"
                      className="flex-1 h-10 px-3 text-white rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={applyDiscount}
                      disabled={discountApplied}
                      className="px-4 h-10 bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Apply
                    </motion.button>
                  </div>
                  {discountApplied && (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      20% discount applied!
                    </p>
                  )}
                </div>

                {/* Calculations */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">₦{subtotal.toLocaleString('en-NG')}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount (20%)</span>
                      <span className="font-medium text-emerald-600">-₦{discountAmount.toLocaleString('en-NG')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-medium text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">₦{shipping.toLocaleString('en-NG')}</span>
                    )}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{total.toLocaleString('en-NG')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 mb-4"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <Footer variant="green" />
    </>
  )
}