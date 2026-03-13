// app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  Shield, 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

interface OrderPayload {
  items: Array<{ productId: string; quantity: number; size?: string; color?: string }>
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: 'wallet' | 'korapay'
  totalPrice: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'korapay'>("korapay")
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: user?.address || '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria'
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    setMounted(true)
  }, [token, router])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCartItems(JSON.parse(stored))
    } else {
      router.push('/cart')
    }
  }, [router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }
    if (token) fetchProfile()
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 25
  const total = subtotal + shipping

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone
  }

  const validateStep2 = () => {
    return formData.address && formData.city && formData.state && formData.postalCode
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!validateStep1() || !validateStep2()) {
        setError('Please fill all required fields')
        setLoading(false)
        return
      }


      const orderPayload: OrderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          ...formData,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod,
        totalPrice: total
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to create order')
        return
      }

      const orderId = data.data.order.id

      if (paymentMethod === 'korapay') {
        const paymentRes = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ orderId, amount: total, email: formData.email })
        })

        const paymentData = await paymentRes.json()
        if (!paymentRes.ok) {
          setError(paymentData.message || 'Failed to initiate payment')
          return
        }

        if (paymentData.data?.checkoutURL) {
          window.location.href = paymentData.data.checkoutURL
        }
      } else {
        localStorage.removeItem('cart')
        router.push(`/confirmation?orderId=${orderId}`)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !token) return null

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cart is empty</h1>
            <p className="text-gray-500 mb-8">Add items to your cart before checking out</p>
            <Link href="/shop">
              <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg">Back to Shop</button>
            </Link>
          </div>
        </main>
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
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your purchase securely
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Step 1: Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">1</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full h-11 text-white pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-9 text-white pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          placeholder='example@email.com'
                          onChange={handleInputChange}
                          className="w-full h-11 pl-9 text-white pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder='09025140981'
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-9 text-white pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {currentStep === 1 && (
                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!validateStep1()}
                      className="mt-6 w-full h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Continue to Shipping
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>

                {/* Step 2: Shipping Address */}
                <AnimatePresence>
                  {currentStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold">2</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Shipping Address
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Street Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full h-11 text-white pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full h-11 text-white px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full h-11 text-white px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className="w-full h-11 text-white px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              Country
                            </label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full h-11 text-white pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              >
                                <option>Nigeria</option>
                                <option>Ghana</option>
                                <option>Kenya</option>
                                <option>South Africa</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {currentStep === 2 && (
                        <div className="flex gap-3 mt-6">
                          <motion.button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="px-6 h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            disabled={!validateStep2()}
                            className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            Continue to Payment
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Payment Method */}
                <AnimatePresence>
                  {currentStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold">3</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Payment Method
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <motion.label
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === 'korapay'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="korapay"
                            checked={paymentMethod === 'korapay'}
                            onChange={(e) => setPaymentMethod(e.target.value as 'korapay')}
                            className="w-4 h-4 text-emerald-600"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-emerald-600" />
                              <span className="font-medium text-gray-900 dark:text-white">Korapay</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Pay with Card, Bank Transfer, or USSD</p>
                          </div>
                        </motion.label>

                        <motion.label
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === 'wallet'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="wallet"
                            checked={paymentMethod === 'wallet'}
                            onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
                            className="w-4 h-4 text-emerald-600"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-5 h-5 text-emerald-600" />
                              <span className="font-medium text-gray-900 dark:text-white">Wallet</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                            </p>
                          </div>
                        </motion.label>
                      </div>

                      {currentStep === 3 && (
                        <div className="flex gap-3 mt-6">
                          <motion.button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="px-6 h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </motion.button>
                          <motion.button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            {loading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Complete Order
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-lg flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-emerald-600/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                        </p>
                        <p className="text-sm font-semibold text-emerald-600 mt-1">
                          ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₦{subtotal.toLocaleString('en-NG')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-medium text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₦{shipping.toLocaleString('en-NG')}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₦{total.toLocaleString('en-NG')}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Secure Checkout
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Your payment info is encrypted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <Footer variant="green" />
    </>
  )
}