
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Star, ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface PageProps {
  params?: { slug: string }
}

interface ProductData {
  _id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  cost?: number
  category: any
  images: string[]
  colors: string[]
  variants: Array<{
    size: string
    price: number
    stock: number
  }>
  sku?: string
  weight?: number
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviews: number
  quantity: number
}

export default function ProductPage({ params }: PageProps) {
  const router = useRouter()
  // Extract slug from URL pathname in client component
  const [slug, setSlug] = useState<string>('')
  
  useEffect(() => {
    // Get slug from pathname: /shop/[slug]
    const pathparts = window.location.pathname.split('/')
    const slugFromPath = pathparts[pathparts.length - 1]
    setSlug(slugFromPath)
  }, [])
  
  const [product, setProduct] = useState<ProductData | null>(null)
  const [categoryName, setCategoryName] = useState('Unknown')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentComparePrice, setCurrentComparePrice] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem, removeItem, isItemInCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/by-slug/${slug}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = await response.json()

        if (!data.success) {
          throw new Error('Failed to fetch product')
        }

        const productData = data.data
        setProduct(productData)
        setCategoryName(productData.categoryName || 'Unknown')

        // Set default price (cost as normal price, original price as compare price)
        const defaultPrice = productData.cost || productData.price
        const defaultComparePrice = productData.price

        setCurrentPrice(defaultPrice)
        setCurrentComparePrice(defaultComparePrice)

        // Set default size if variants exist
        if (productData.variants && productData.variants.length > 0) {
          setSelectedSize(productData.variants[0].size)
        }

        // Set default color if colors exist
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
        }

      } catch (error) {
        console.error('Error fetching product:', error)
        // Handle not found
        if (error instanceof Error && error.message === 'Product not found') {
          notFound()
        }
      } finally {
        setLoading(false)
      }
    }

    if (!slug) return // Don't fetch if slug is empty
    
    fetchProduct()
  }, [slug])

  // Update price when size changes
  useEffect(() => {
    if (!product || !selectedSize) return

    const variant = product.variants?.find(v => v.size === selectedSize)
    if (variant) {
      setCurrentPrice(variant.price)
      // Keep the original price as compare price
      setCurrentComparePrice(product.price)
    }
  }, [selectedSize, product])

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  const handleAddToCart = async () => {
    if (!product) return

    setAddingToCart(true)
    try {
      // Check if item is in cart
      const itemKey = `${product._id}-${selectedSize}-${selectedColor}`
      const inCart = isItemInCart(product._id, selectedSize, selectedColor)
      
      if (inCart) {
        // Remove from cart
        removeItem(product._id, selectedSize, selectedColor)
        setAddedToCart(false)
      } else {
        // Add item to cart
        addItem({
          id: product._id,
          name: product.name,
          price: currentPrice,
          image: product.images?.[0] || '',
          size: selectedSize,
          color: selectedColor,
          slug: slug
        })
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-40 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
        <Footer variant="green" />
      </>
    )
  }

  if (!product) {
    return notFound()
  }

  const images = Array.isArray(product.images) && product.images.length ? product.images : []
  const mainImage = images[0] || ''
  const discount = currentComparePrice && currentPrice < currentComparePrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-emerald-500 transition-colors">
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                  {categoryName}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₦{currentPrice.toLocaleString()}
                  </span>
                  {currentComparePrice && currentComparePrice > currentPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ₦{currentComparePrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Save ₦{(currentComparePrice! - currentPrice).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <div
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                          selectedColor === color
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sizes</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSizeSelect(variant.size)}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
                          selectedSize === variant.size
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU & Weight */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {product.sku && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">SKU</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.sku}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Weight</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.weight} kg</p>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0 || addingToCart}
                className={`w-full h-12 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                  product.quantity > 0 && !addingToCart
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isItemInCart(product._id, selectedSize, selectedColor) ? 'Updating...' : 'Adding...'}
                  </>
                ) : isItemInCart(product._id, selectedSize, selectedColor) ? (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Remove from Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Info Tabs */}
          {(product.cost || product.isFeatured) && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.cost && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Cost</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₦{product.cost.toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">Status</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {product.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                {product.isFeatured && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-2">Featured</p>
                    <p className="text-lg font-semibold text-amber-600">★ Featured Product</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer variant="green" />
    </>
  )
}