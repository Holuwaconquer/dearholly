// app/dashboard/shipping/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

interface ShippingAddress {
  _id: string
  type: string
  recipient: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

export default function ShippingPage() {
  const auth = useAuth()
  const token = auth.token
  const authLoading = auth.loading
  const [mounted, setMounted] = useState(false)
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    recipient: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Nigeria',
    phone: '',
    isDefault: false,
  })

  useEffect(() => {
    setMounted(true)
    // wait until token is available before fetching
    if (token) {
      fetchAddresses()
    }
  }, [token])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/shipping', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAddresses(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAddresses(prev => [data.data, ...prev])
          setShowAddForm(false)
          setFormData({
            type: '',
            recipient: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: 'Nigeria',
            phone: '',
            isDefault: false,
          })
        }
      }
    } catch (error) {
      console.error('Failed to add address:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/shipping/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setAddresses(prev => prev.filter(addr => addr._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // don't render on the server or while auth is loading
  if (!mounted || authLoading) return null

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
              Shipping Addresses
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your delivery addresses
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/30 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined">add</span>
            Add New Address
          </motion.button>
        </motion.div>

        {/* Add Address Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Address</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="type"
                      placeholder="Address Type (e.g., Home, Office)"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      name="recipient"
                      placeholder="Recipient Name"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="md:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                      required
                    />
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="isDefault" className="text-gray-700 dark:text-gray-300">Set as default address</label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {submitting ? 'Saving...' : 'Save Address'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Addresses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-400">location_off</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No shipping addresses</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first shipping address to get started</p>
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Address
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address._id}
                className={`
                  bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden
                  ${address.isDefault ? 'border-2 border-emerald-500' : 'border border-gray-200 dark:border-gray-700'}
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <motion.div
                    className="absolute top-0 right-0"
                    initial={{ rotate: 45, x: 50 }}
                    animate={{ rotate: 45, x: 30 }}
                  >
                    <div className="bg-emerald-500 text-white px-12 py-1 text-xs font-bold shadow-lg">
                      DEFAULT
                    </div>
                  </motion.div>
                )}

                {/* Address Type Icon */}
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-xl flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="material-symbols-outlined text-3xl text-emerald-600 dark:text-emerald-400">
                    {address.type === 'Home Office' ? 'business' : 'home'}
                  </span>
                </motion.div>

                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">{address.type}</h3>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="material-symbols-outlined text-emerald-600">edit</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="material-symbols-outlined text-rose-600">delete</span>
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white">{address.recipient}</p>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.country}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">{address.phone}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.main>
  )
}