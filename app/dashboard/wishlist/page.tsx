// app/dashboard/wishlist/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

interface WishlistItem {
  _id: string
  productName: string
  productImage: string
  productPrice: number
  productCategory: string
  inStock: boolean
  addedAt: string
}

export default function WishlistPage() {
  const { token } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setWishlist(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item._id !== id))
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const addToCart = async (item: WishlistItem) => {
    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem('cart')
      const cartItems = existingCart ? JSON.parse(existingCart) : []

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex((cartItem: any) => cartItem.id === item._id)

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Item doesn't exist, add new item
        const cartItem = {
          id: item._id,
          name: item.productName,
          price: item.productPrice,
          image: item.productImage,
          quantity: 1
        }
        cartItems.push(cartItem)
      }

      // Save back to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems))

      // Show success message
      setSuccessMessage(`${item.productName} added to cart!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      console.log('Added to cart:', item.productName)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <motion.main 
        className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </motion.main>
    )
  }

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
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {wishlist.length} items saved for later
            </p>
          </div>
          
          <motion.button 
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          </motion.button>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl mb-6"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {wishlist.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">🤍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start exploring our collection and add items you love
            </p>
            <Link href="/shop">
              <motion.button 
              className="bg-linear-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Products
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            {wishlist.map((item, index) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400">
                      shopping_bag
                    </span>
                  </motion.div>
                  
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <motion.button 
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="material-symbols-outlined text-rose-600">close</span>
                  </motion.button>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.productName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.productCategory}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${item.productPrice.toFixed(2)}
                    </p>
                    
                    {item.inStock ? (
                      <motion.button 
                        onClick={() => addToCart(item)}
                        className="bg-linear-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    ) : (
                      <motion.button 
                        className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-sm font-medium cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                      >
                        Notify Me
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}