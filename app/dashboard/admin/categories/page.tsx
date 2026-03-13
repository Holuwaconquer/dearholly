'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function CategoriesPage() {
  const [mounted, setMounted] = useState(false)
  const { user, token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [categoriesData, setCategoriesData] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // fetched categories from server
  const categories = categoriesData

  // build hierarchical tree from flat list
  const buildTree = (list: any[]) => {
    const map: Record<string, any> = {}
    list.forEach(cat => {
      map[cat._id] = { ...cat, id: cat._id, children: [] }
    })
    const roots: any[] = []
    list.forEach(cat => {
      if (cat.parent) {
        if (map[cat.parent]) {
          map[cat.parent].children.push(map[cat._id])
        }
      } else {
        roots.push(map[cat._id])
      }
    })
    return roots
  }

  const categoryTree = buildTree(categories)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const fetchCategories = async () => {
    if (!token) return
    setLoadingCategories(true)
    try {
      const res = await fetch('/api/admin/categories?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setCategoriesData(data.data.categories)
      }
    } catch (err) {
      console.error('Error fetching categories', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload: any = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      parent: formData.get('parent') || null,
      status: formData.get('active') ? 'active' : 'inactive',
    }
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
        setShowAddModal(false)
      } else {
        console.error('Create category failed', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token || !selectedCategory) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload: any = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      status: formData.get('edit-active') ? 'active' : 'inactive',
    }
    try {
      const res = await fetch(`/api/admin/categories/${selectedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
        setShowEditModal(false)
      } else {
        console.error('Update category failed', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!token) return
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        fetchCategories()
        setShowDeleteModal(false)
      } else {
        console.error('Delete category failed', data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (mounted) fetchCategories()
  }, [mounted, token])

  const renderCategory = (category: any, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.includes(category.id)

    return (
      <div key={category.id}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
            depth > 0 ? 'ml-8' : ''
          }`}
        >
          {hasChildren && (
            <button
              onClick={() => toggleCategory(category.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-lg flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-white">{category.name}</h3>
              <p className="text-sm text-gray-200">{category.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-200">{category.productCount} products</span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              category.status === 'active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {category.status}
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedCategory(category)
                  setShowEditModal(true)
                }}
                className="p-1 text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedCategory(category)
                  setShowDeleteModal(true)
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-emerald-200 dark:border-emerald-800 ml-8">
            {category.children.map((child: any) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

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
                <FolderTree className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Categories
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">
              Organize your products with categories
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="h-11 px-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </motion.button>
        </motion.div>


        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900/30"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full h-11 text-white pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </motion.div>

        {/* Categories Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden"
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loadingCategories ? (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400">No categories found.</p>
            ) : (
              categoryTree.map(category => renderCategory(category))
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Category</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleCreateCategory}>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Category Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g., Street Wears"
                    required
                  />
                </div>


                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full text-white resize-none px-4 text-white py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-200 dark:text-gray-300 mb-1 block">
                    Parent Category
                  </label>
                  <select
                    name="parent"
                    className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">None (Top Level)</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>


                <div className="flex items-center gap-2">
                  <input
                    name="active"
                    type="checkbox"
                    id="active"
                    className="w-4 h-4 rounded text-white border-gray-300  focus:ring-emerald-500"
                  />
                  <label htmlFor="active" className="text-sm text-gray-200 dark:text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium"
                  >
                    Create Category
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddModal(false)}
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

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditModal && selectedCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Category</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Category Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={selectedCategory.name}
                    className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>


                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={selectedCategory.description}
                    className="w-full px-4 text-white py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-active"
                    defaultChecked={selectedCategory.status === 'active'}
                    className="w-4 h-4 rounded  border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="edit-active" className="text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleUpdateCategory(e as any)
                    }}
                    className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium"
                  >
                    Update Category
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowEditModal(false)}
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
        {showDeleteModal && selectedCategory && (
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
                  Delete Category
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{selectedCategory.name}"? This will affect {selectedCategory.productCount} products in this category.
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
                    if (selectedCategory) {
                      handleDeleteCategory(selectedCategory._id)
                    }
                    setSelectedCategory(null)
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