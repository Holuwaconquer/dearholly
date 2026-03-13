// app/dashboard/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false)
  const { user, token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usersData, setUsersData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // dynamic fetch users
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchUsers = async (page = 1) => {
    if (!token) return
    setLoadingUsers(true)
    try {
      const url = new URL('/api/admin/users', location.origin)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', '10')
      if (selectedRole !== 'all') url.searchParams.set('role', selectedRole)
      if (selectedStatus !== 'all') url.searchParams.set('status', selectedStatus)
      if (searchQuery) url.searchParams.set('search', searchQuery)
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const normalizedUsers = data.data.users.map((u: any) => ({
          ...u,
          id: u._id || u.id,
          joined: u.joined ? new Date(u.joined).toLocaleString() : (u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'),
          lastActive: u.lastActive ? new Date(u.lastActive).toLocaleString() : '-',
          orders: u.ordersCount ?? u.orders ?? 0,
          spent: u.totalSpent ?? u.spent ?? 0,
        }))
        setUsersData(normalizedUsers)
        setTotalPages(data.data.pagination.pages)
        setTotalUsers(data.data.pagination.total)
      }
    } catch (err) {
      console.error('Error fetching users', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        fetchUsers(currentPage)
        setShowDeleteModal(false)
      } else {
        console.error('Failed to delete user', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      role: formData.get('role'),
      status: formData.get('status')
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        fetchUsers(currentPage)
        setShowUserModal(false)
        setSelectedUser(null)
      } else {
        console.error('Create user failed', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token || !selectedUser) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload: any = {
      role: formData.get('role'),
      status: formData.get('status'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    }
    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        fetchUsers(currentPage)
        setShowUserModal(false)
        setSelectedUser(null)
      } else {
        console.error('Update user failed', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (mounted) fetchUsers(currentPage)
  }, [mounted, token, selectedRole, selectedStatus, searchQuery, currentPage])

  const filteredUsers = usersData
  const totalPagesDisplay = totalPages

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
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                User Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Manage and monitor all platform users
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserModal(true)}
              className="h-11 px-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-11 px-4 border text-white border-gray-200 dark:border-gray-700 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
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
                placeholder="Search users by name or email..."
                className="w-full h-11 text-white pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-11 px-4 text-white rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* Users Table */}
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-xl flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold">
                            {((user.name || (user.firstName+" "+user.lastName)) || ' ')[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {user.role === 'admin' ? (
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Admin
                          </div>
                        ) : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {user.joined || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.spent ? `$${user.spent.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.lastActive || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedUser(user)
                            setShowViewModal(true)
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteModal(true)
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * 10 + 1} to {(currentPage - 1) * 10 + filteredUsers.length} of {totalUsers} users
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
              <span className="text-sm text-gray-700 dark:text-gray-300">
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
      </div>

      {/* View User Modal */}
      <AnimatePresence>
        {showViewModal && selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-xl">
                    {(selectedUser.firstName?.charAt(0) || '') + (selectedUser.lastName?.charAt(0) || '')}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white">Contact Information</h5>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{selectedUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white">Account Information</h5>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedUser.ordersCount || 0} orders
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ₦{selectedUser.totalSpent?.toLocaleString() || 0} spent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {selectedUser.address && (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white">Shipping Address</h5>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUser.address}<br />
                        {selectedUser.city}, {selectedUser.state} {selectedUser.postalCode}<br />
                        {selectedUser.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowViewModal(false)
                      setSelectedUser(selectedUser)
                      setShowUserModal(true)
                    }}
                    className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium"
                  >
                    Edit User
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowUserModal(false)
                    setSelectedUser(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      defaultValue={selectedUser?.firstName || ''}
                      className="w-full text-white h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required={!selectedUser}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      defaultValue={selectedUser?.lastName || ''}
                      className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required={!selectedUser}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={selectedUser?.email || ''}
                    className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required={!selectedUser}
                    disabled={!!selectedUser}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={selectedUser?.phone || ''}
                    className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Role
                    </label>
                    <select
                      name="role"
                      defaultValue={selectedUser?.role || 'user'}
                      className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="user">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedUser?.status || 'active'}
                      className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {!selectedUser && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium"
                  >
                    {selectedUser ? 'Update User' : 'Create User'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowUserModal(false)
                      setSelectedUser(null)
                    }}
                    className="flex-1 h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Handle delete
                    setShowDeleteModal(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 h-11 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}