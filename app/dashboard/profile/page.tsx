// app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { User as UserIcon, MapPin, Phone, Mail } from 'lucide-react'

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const { token } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && token) {
      fetchProfile()
    }
  }, [mounted, token])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok && data.data) {
        setProfileData(data.data)
      }
    } catch (err) {
      console.error('Profile fetch error', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })
      const data = await res.json()
      if (res.ok && data.data) {
        setProfileData(data.data)
        setIsEditing(false)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' })
      }
    } catch (err) {
      console.error('Profile update error', err)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  if (!mounted || loading) return null

  return (
    <motion.main 
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <UserIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your personal and shipping information
              </p>
            </div>
          </div>
          
          {!isEditing ? (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
          ) : null}
        </motion.div>

        {/* Success/Error Message */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${
              message.type === 'success' 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Profile Information */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-100 dark:border-emerald-900/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-emerald-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                      {profileData.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                      {profileData.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                    {profileData.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                      {profileData.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-200 dark:border-gray-700" />

            {/* Shipping Address */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Street Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="123 Main St"
                    />
                  ) : (
                    <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                      {profileData.address || 'Not provided'}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    ) : (
                      <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                        {profileData.city || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      State
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    ) : (
                      <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                        {profileData.state || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Postal Code
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="postalCode"
                        value={profileData.postalCode}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    ) : (
                      <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-white">
                        {profileData.postalCode || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Country
                    </label>
                    {isEditing ? (
                      <select
                        name="country"
                        value={profileData.country}
                        onChange={handleInputChange}
                        className="w-full text-white h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Uganda">Uganda</option>
                        <option value="South Africa">South Africa</option>
                      </select>
                    ) : (
                      <p className="h-11 flex items-center px-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                        {profileData.country || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsEditing(false)
                    fetchProfile()
                  }}
                  className="flex-1 text-white h-11 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}