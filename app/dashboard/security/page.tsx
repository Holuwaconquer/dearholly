// app/dashboard/security/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SecurityPage() {
  const [mounted, setMounted] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const sessions = [
    {
      id: 1,
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      lastActive: 'Now',
      current: true
    },
    {
      id: 2,
      device: 'iPhone 14 - Safari',
      location: 'San Francisco, CA',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      current: false
    },
    {
      id: 3,
      device: 'iPad - Safari',
      location: 'New York, NY',
      ip: '192.168.1.3',
      lastActive: '3 days ago',
      current: false
    }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPasswordForm(false)
  }

  if (!mounted) return null

  return (
    <motion.main 
      className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="animate-slide-down"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Security
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account security</p>
        </motion.div>

        {/* Password Section */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">password</span>
              Password
            </h2>
            {!showPasswordForm && (
              <motion.button
                onClick={() => setShowPasswordForm(true)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change Password
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {showPasswordForm ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePasswordSubmit}
                className="space-y-4 overflow-hidden"
              >
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-emerald-500 h-12 px-4 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Update Password
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">lock</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Password last changed 3 months ago</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Strong password strength</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Two-Factor Authentication */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">verified_user</span>
              Two-Factor Authentication
            </h2>
            <motion.button
              onClick={() => setShow2FA(!show2FA)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                show2FA
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {show2FA ? 'Disable 2FA' : 'Enable 2FA'}
            </motion.button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Add an extra layer of security to your account. Once enabled, you'll need to enter a verification code from your authenticator app in addition to your password.
          </p>

          <AnimatePresence>
            {show2FA && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Setup Two-Factor Authentication</h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <motion.div 
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-mono text-2xl rounded-lg">
                        QR
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">Scan this QR code with your authenticator app:</p>
                      <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg font-mono text-xs text-gray-800 dark:text-gray-200">
                        SECRET-KEY-12345-ABCDE-67890
                      </div>
                      <motion.button 
                        className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
                        whileHover={{ x: 5 }}
                      >
                        Copy Secret Key
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Sessions */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-emerald-600">devices</span>
            Active Sessions
          </h2>

          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <span className="material-symbols-outlined text-2xl text-emerald-600">
                      {session.device.includes('iPhone') ? 'phone_iphone' : 
                       session.device.includes('iPad') ? 'tablet' : 'computer'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.device}
                      {session.current && (
                        <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.location} • {session.ip} • Last active: {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <motion.button 
                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="material-symbols-outlined text-rose-600">logout</span>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          <motion.button 
            className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
            whileHover={{ x: 5 }}
          >
            Sign out all other devices
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </motion.button>
        </motion.div>

        {/* Login History */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-emerald-600">history</span>
            Recent Login Activity
          </h2>

          <div className="space-y-3">
            {[
              { date: 'Today, 10:30 AM', device: 'MacBook Pro', location: 'San Francisco, CA', success: true },
              { date: 'Yesterday, 8:15 PM', device: 'iPhone 14', location: 'San Francisco, CA', success: true },
              { date: '3 days ago', device: 'Unknown Device', location: 'New York, NY', success: false }
            ].map((login, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${
                    login.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {login.success ? 'check_circle' : 'error'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{login.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{login.device} • {login.location}</p>
                  </div>
                </div>
                {!login.success && (
                  <span className="text-xs text-rose-600 font-medium">Failed Attempt</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}