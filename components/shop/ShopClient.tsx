// components/shop/ShopClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Star,
  ShoppingBag,
  Filter,
  Grid3x3,
  LayoutList,
  Sparkles
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  _id: string
  slug?: string
  name: string
  price: number
  category: string
  badge?: string
  image: string
  sizes?: string[]
  colors?: string[]
  stock: number
  description?: string
  rating?: number
  reviews?: number
}

interface ShopClientProps {
  products: Product[]
  total: number
  currentPage: number
  pageSize: number
  categories: string[]
  currentCategory: string
  currentSort: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export default function ShopClient({
  products,
  total,
  currentPage,
  pageSize,
  categories,
  currentCategory,
  currentSort,
  minPrice,
  maxPrice,
  search
}: ShopClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentCategory !== 'all' ? [currentCategory] : []
  )
  const [searchQuery, setSearchQuery] = useState(search || '')
  const [sortBy, setSortBy] = useState(currentSort)

  const totalPages = Math.ceil(total / pageSize)
  const { addItem, removeItem, isItemInCart } = useCart()

  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Update category
    if (selectedCategories.length === 1) {
      params.set('category', selectedCategories[0])
    } else if (selectedCategories.length === 0) {
      params.set('category', 'all')
    }

    // Update price range
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    else params.delete('minPrice')
    
    if (priceRange[1] < 1000) params.set('maxPrice', priceRange[1].toString())
    else params.delete('maxPrice')

    // Update sort
    if (sortBy !== 'newest') params.set('sort', sortBy)
    else params.delete('sort')

    // Update search
    if (searchQuery) params.set('search', searchQuery)
    else params.delete('search')

    // Reset to first page
    params.set('page', '1')

    router.push(`/shop?${params.toString()}`)
  }, [selectedCategories, priceRange, sortBy, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by useEffect
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setSortBy('newest')
    setSearchQuery('')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 pt-40 pb-5">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Discover Luxury
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Curated collection of premium products for the discerning customer
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 text-white pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden text-white h-12 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </form>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/30 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      onChange={() => setSelectedCategories([])}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([cat])
                          } else {
                            setSelectedCategories([])
                          }
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full h-10 px-3 text-white rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="w-full h-10 text-white px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full text-white accent-emerald-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 text-white px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween' }}
                  className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Same filter content as desktop */}
                    <button
                      onClick={clearFilters}
                      className="w-full h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg text-sm font-medium mb-6"
                    >
                      Clear All Filters
                    </button>

                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.length === 0}
                            onChange={() => setSelectedCategories([])}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">All Categories</span>
                        </label>
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories([cat])
                                } else {
                                  setSelectedCategories([])
                                }
                              }}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Range</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-full h-10 text-white px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                            placeholder="Min"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                            className="w-full h-10 text-white px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sort By</h3>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full h-10 px-3 text-white rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> of{' '}
                <span className="font-medium text-gray-900 dark:text-white">{total}</span> products
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Products */}
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl"
              >
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Link href={`/shop/${product.slug || product._id}`}>
                      <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden ${
                        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                      }`}>
                        {/* Product Image */}
                        <div className={`relative ${
                          viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                        }`}>
                          <div className="absolute inset-0 bg-linear-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-emerald-600/30" />
                              </div>
                            )}
                          </div>
                          {product.badge && (
                            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                              product.badge === 'New' 
                                ? 'bg-emerald-500 text-white'
                                : product.badge === 'Sale'
                                ? 'bg-rose-500 text-white'
                                : 'bg-amber-500 text-white'
                            }`}>
                              {product.badge}
                            </span>
                          )}
                          {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                              {product.category}
                            </span>
                            {product.rating && (
                              <div className="flex items-center gap-1 ml-auto">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {product.rating} ({product.reviews})
                                </span>
                              </div>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          {viewMode === 'list' && product.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              ₦{product.price.toLocaleString()}
                            </p>
                            {product.stock > 0 && (
                              <span className="text-xs text-green-600">
                                In Stock ({product.stock})
                              </span>
                            )}
                          </div>

                          {viewMode === 'grid' && (
                            <motion.button
                              className="w-full mt-4 h-10 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-medium opacity-0 opacity-100 transition-opacity"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.preventDefault()
                                const inCart = isItemInCart(product._id)
                                if (inCart) {
                                  removeItem(product._id)
                                  setToastMsg(`${product.name} removed from cart`)
                                } else {
                                  addItem({
                                    id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    slug: product.slug,
                                  })
                                  setToastMsg(`${product.name} added to cart`)
                                }
                                setTimeout(() => setToastMsg(null), 3000)
                              }}
                            >
                              {isItemInCart(product._id) ? 'Remove from Cart' : 'Add to Cart'}
                            </motion.button>
                          )}
                        </div>

                        {viewMode === 'list' && (
                          <div className="p-4 flex flex-col justify-center border-l border-gray-200 dark:border-gray-700">
                            <motion.button
                              className="w-32 h-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-medium"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.preventDefault()
                                const inCart = isItemInCart(product._id)
                                if (inCart) {
                                  removeItem(product._id)
                                  setToastMsg(`${product.name} removed from cart`)
                                } else {
                                  addItem({
                                    id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    slug: product.slug,
                                  })
                                  setToastMsg(`${product.name} added to cart`)
                                }
                                setTimeout(() => setToastMsg(null), 3000)
                              }}
                            >
                              {isItemInCart(product._id) ? 'Remove from Cart' : 'Add to Cart'}
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}


            {/* toast */}
            <AnimatePresence>
              {toastMsg && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{toastMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-center gap-2"
              >
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', Math.max(1, currentPage - 1).toString())
                    router.push(`/shop?${params.toString()}`)
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  const isCurrentPage = page === currentPage

                  return (
                    <button
                      key={page}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('page', page.toString())
                        router.push(`/shop?${params.toString()}`)
                      }}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        isCurrentPage
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', Math.min(totalPages, currentPage + 1).toString())
                    router.push(`/shop?${params.toString()}`)
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}