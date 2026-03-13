// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Bell,
  Lock,
  Monitor,
  Globe,
  Clock,
  DollarSign,
  Moon,
  Sun,
  Palette,
  Eye,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Save,
  Sparkles
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/dashboard/Sidebar'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const [settings, setSettings] = useState({
    // General Settings
    language: 'english',
    timezone: 'EST',
    currency: 'USD',
    
    // Notification Settings
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: false,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showOrderHistory: true,
    allowMarketing: false,
    
    // Display Settings
    darkMode: 'system',
    fontSize: 'medium',
    compactView: false,
    
    // Additional Settings
    twoFactorAuth: false,
    autoLogout: '30',
    dataSaver: false
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const user = {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    membership: 'Premium Member',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0NssBtxRUKBX5fyhCnH7Jru0E0KRiZYb8vHEoNNEhWMtmtcBbZUFFBnnmvYqhnfzc0q_rbWAuq7kmyYjTG9mZZcfsuYbOP4M53F4IN2rqLtPE1vFJ5uW3uF6Tw3xGZRRTfSpuQE2LheZ-eg8L8xl0qnlwJxTHOsTh4DDNZDh_X4V5EcaFgRXqmXggydiOglc9E5Q_vSI1fW8OprbPXn5jgZrZOYbGY-RCjJ9Om0LrvkmBYrI4BnwQJQiea2PvOIIzESpGKPz_7MtA'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSave = () => {
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings, description: 'Basic preferences' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert settings' },
    { id: 'privacy', label: 'Privacy', icon: Lock, description: 'Security & privacy' },
    { id: 'display', label: 'Display', icon: Monitor, description: 'Appearance settings' }
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-4 md:p-8"
        >
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Settings className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Settings
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-14">
                  Manage your account preferences and configurations
                </p>
              </div>

              {/* Save Success Toast */}
              <AnimatePresence>
                {showSaveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Settings saved successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Settings Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative overflow-hidden p-4 rounded-xl text-left transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-emerald-100 dark:border-emerald-900/30 text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isActive ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-emerald-600'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {tab.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {tab.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden"
            >
              {/* Header with decorative element */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          General Preferences
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Configure your basic account settings
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Language */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-emerald-600" />
                            Language
                          </label>
                          <select
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="english">English (US)</option>
                            <option value="spanish">Español</option>
                            <option value="french">Français</option>
                            <option value="german">Deutsch</option>
                            <option value="italian">Italiano</option>
                          </select>
                        </div>

                        {/* Time Zone */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            Time Zone
                          </label>
                          <select
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="EST">Eastern Time (EST)</option>
                            <option value="CST">Central Time (CST)</option>
                            <option value="MST">Mountain Time (MST)</option>
                            <option value="PST">Pacific Time (PST)</option>
                            <option value="GMT">Greenwich Mean Time (GMT)</option>
                          </select>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="CAD">CAD ($)</option>
                          </select>
                        </div>

                        {/* Auto Logout */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Auto Logout
                          </label>
                          <select
                            name="autoLogout"
                            value={settings.autoLogout}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>

                      {/* Two Factor Authentication */}
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="twoFactorAuth"
                              checked={settings.twoFactorAuth}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Notification Preferences
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Choose how you want to receive updates
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Email Notifications */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <Mail className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                <p className="text-sm text-gray-500">Receive updates via email</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.emailNotifications}
                                onChange={handleChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          {settings.emailNotifications && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-3 pl-14"
                            >
                              {[
                                { id: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                                { id: 'promotions', label: 'Promotions', desc: 'Receive promotional offers and discounts' },
                                { id: 'newsletter', label: 'Newsletter', desc: 'Weekly newsletter with latest drops' }
                              ].map((item) => (
                                <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    name={item.id}
                                    checked={settings[item.id as keyof typeof settings] as boolean}
                                    onChange={handleChange}
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                  </div>
                                </label>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        {/* SMS Notifications */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <Phone className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">SMS Alerts</h3>
                                <p className="text-sm text-gray-500">Get text messages for urgent updates</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="smsAlerts"
                                checked={settings.smsAlerts}
                                onChange={handleChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Privacy Settings */}
                  {activeTab === 'privacy' && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Privacy & Security
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Control your privacy settings and data visibility
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Profile Visibility */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Profile Visibility
                          </label>
                          <select
                            name="profileVisibility"
                            value={settings.profileVisibility}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                          >
                            <option value="public">Public - Everyone can see</option>
                            <option value="members">Members Only - Only registered users</option>
                            <option value="private">Private - Only me</option>
                          </select>
                        </div>

                        {/* Privacy Options */}
                        <div className="space-y-3">
                          {[
                            { id: 'showEmail', label: 'Show email address on profile' },
                            { id: 'showOrderHistory', label: 'Make order history visible to others' },
                            { id: 'allowMarketing', label: 'Allow data for marketing purposes' }
                          ].map((item) => (
                            <label key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <input
                                type="checkbox"
                                name={item.id}
                                checked={settings[item.id as keyof typeof settings] as boolean}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.label}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                settings[item.id as keyof typeof settings]
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {settings[item.id as keyof typeof settings] ? 'Enabled' : 'Disabled'}
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Data Saver */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Data Saver Mode</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Reduce data usage by loading lower quality images
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="dataSaver"
                                checked={settings.dataSaver}
                                onChange={handleChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Display Settings */}
                  {activeTab === 'display' && (
                    <motion.div
                      key="display"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Display Preferences
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Customize your visual experience
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Theme */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-emerald-600" />
                            Theme
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'light', icon: Sun, label: 'Light' },
                              { value: 'dark', icon: Moon, label: 'Dark' },
                              { value: 'system', icon: Monitor, label: 'System' }
                            ].map((option) => {
                              const Icon = option.icon
                              const isSelected = settings.darkMode === option.value
                              return (
                                <button
                                  key={option.value}
                                  onClick={() => setSettings(prev => ({ ...prev, darkMode: option.value }))}
                                  className={`p-3 rounded-xl border-2 transition-all ${
                                    isSelected
                                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                                  }`}
                                >
                                  <Icon className={`w-5 h-5 mx-auto mb-1 ${
                                    isSelected ? 'text-emerald-600' : 'text-gray-500'
                                  }`} />
                                  <span className={`text-xs ${
                                    isSelected ? 'text-emerald-600 font-medium' : 'text-gray-500'
                                  }`}>
                                    {option.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-emerald-600" />
                            Font Size
                          </label>
                          <div className="flex gap-2">
                            {['small', 'medium', 'large'].map((size) => (
                              <button
                                key={size}
                                onClick={() => setSettings(prev => ({ ...prev, fontSize: size }))}
                                className={`flex-1 h-11 rounded-xl border-2 capitalize transition-all ${
                                  settings.fontSize === size
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-medium'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-emerald-300'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Compact View */}
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Compact View</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Show more items per page with condensed layout
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="compactView"
                              checked={settings.compactView}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save Button */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Changes are saved automatically
                    </p>
                    <motion.button
                      onClick={handleSave}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-rose-200 dark:border-rose-900/30 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-rose-500 to-red-500" />
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Irreversible account actions
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Export Data */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Download className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Download all your personal data including orders and preferences
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 border-2 border-rose-600 text-rose-600 rounded-xl font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                    >
                      Export
                    </motion.button>
                  </div>

                  {/* Delete Account */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Trash2 className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowDeleteModal(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-all"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Type 'DELETE' to confirm"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-gray-900 dark:text-white"
                />
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-11 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700"
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}