'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  Palette,
  Ruler,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function EditProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [thumbnailIndex, setThumbnailIndex] = useState(0)
  const [colors, setColors] = useState<string[]>([])
  const [newColor, setNewColor] = useState('')
  const [variants, setVariants] = useState([{
    size: 'S',
    price: '',
    stock: ''
  }])
  const { token } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    cost: '',
    sku: '',
    barcode: '',
    quantity: '',
    weight: '',
    isActive: true,
    isFeatured: false
  })
  const [productId, setProductId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchCategories()
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchCategories = async () => {
    if (!token) return
    setLoadingCategories(true)
    try {
      const res = await fetch('/api/admin/categories?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setCategories(data.data.categories)
      }
    } catch (err) {
      console.error('Error fetching categories', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const fetchProduct = async () => {
    if (!token || !slug) return
    try {
      const res = await fetch(`/api/admin/products?slug=${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success && data.data.products.length) {
        const p = data.data.products[0]
        setProductId(p._id || p.id)
        setFormData({
          name: p.name || '',
          description: p.description || '',
          category: p.category?._id || p.category || '',
          price: p.price?.toString() || '',
          comparePrice: p.comparePrice?.toString() || '',
          cost: p.cost?.toString() || '',
          sku: p.sku || '',
          barcode: p.barcode || '',
          quantity: p.quantity?.toString() || '',
          weight: p.weight?.toString() || '',
          isActive: p.isActive,
          isFeatured: p.isFeatured
        })
        setImages(p.images || [])
        setColors(p.colors || [])
        setVariants(p.variants || [{ size: 'S', price: '', stock: '' }])
      }
    } catch (err) {
      console.error('Error fetching product', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    if (thumbnailIndex === index) setThumbnailIndex(0)
  }

  const pickThumbnail = (index: number) => {
    setThumbnailIndex(index)
    setImages(prev => {
      const copy = [...prev]
      const [img] = copy.splice(index, 1)
      return [img, ...copy]
    })
  }

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor])
      setNewColor('')
    }
  }

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color))
  }

  const addVariant = () => {
    setVariants([...variants, { size: '', price: '', stock: '' }])
  }

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!productId) return
    setSaving(true)
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        quantity: parseInt(formData.quantity) || 0,
        weight: parseFloat(formData.weight) || 0,
        images,
        colors,
        variants: variants.filter(v => v.size && v.price)
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      const data = await res.json()

      if (data.success) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/admin/products')
        }, 2000)
      } else {
        alert(data.message || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
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
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin/products">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Edit Product
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-14">
                Update the product details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Product
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Product updated successfully! Redirecting...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {[
            { id: 'basic', label: 'Basic Info', icon: Package },
            { id: 'media', label: 'Media', icon: ImageIcon },
            { id: 'pricing', label: 'Pricing' },
            { id: 'inventory', label: 'Inventory', icon: Layers },
            { id: 'variants', label: 'Variants', icon: Ruler }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {Icon ? 
                  <Icon className="w-4 h-4" />
                : '₦ '
                }
                {tab.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., Signature Oversized Hoodie"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-200 mb-1 block">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 text-white py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Enter product description..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Images</h2>

                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                          <Upload className="w-8 h-8 text-emerald-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Upload Images
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Drag and drop or click to upload
                        </p>
                      </label>
                    </div>

                    {/* Preview Thumbnails */}
                    {images.length > 0 && (
                      <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-4">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              alt={`product image ${idx + 1}`}
                              className={`w-full h-24 object-cover rounded-lg ${
                                idx === thumbnailIndex ? 'ring-4 ring-emerald-500' : ''
                              }`}
                              onClick={() => pickThumbnail(idx)}
                            />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Price (₦) *
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Compare at (₦)
                      </label>
                      <input
                        type="text"
                        name="comparePrice"
                        value={formData.comparePrice}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Cost (₦)
                      </label>
                      <input
                        type="text"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Stock Keeping Unit"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Quantity
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-emerald-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-emerald-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Featured</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Variants Tab */}
              {activeTab === 'variants' && (
                <motion.div
                  key="variants"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Variants</h2>
                    {variants.map((v, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Size"
                          value={v.size}
                          onChange={e => updateVariant(idx, 'size', e.target.value)}
                          className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Price (₦)"
                          value={v.price}
                          onChange={e => updateVariant(idx, 'price', e.target.value)}
                          className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Stock"
                          value={v.stock}
                          onChange={e => updateVariant(idx, 'stock', e.target.value)}
                          className="w-full h-11 text-white px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-700 dark:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => removeVariant(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addVariant}
                      className="inline-flex items-center gap-2 text-emerald-600 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add variant
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
