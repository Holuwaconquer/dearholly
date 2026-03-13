'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Sparkles, ArrowRight } from 'lucide-react'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  isFeatured: boolean
}

export default function AnnouncementBanner() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        // First try to get featured products, if none, get the most recent
        const res = await fetch('/api/products?limit=1&sort=-createdAt&isFeatured=true')
        const data = await res.json()

        if (data.success && data.data.products && data.data.products.length > 0) {
          setProduct(data.data.products[0])
        } else {
          // Fallback to most recent product
          const fallbackRes = await fetch('/api/products?limit=1&sort=-createdAt')
          const fallbackData = await fallbackRes.json()
          if (fallbackData.success && fallbackData.data.products && fallbackData.data.products.length > 0) {
            setProduct(fallbackData.data.products[0])
          } else {
            // Use a demo product if no real products exist
            setProduct({
              _id: 'demo',
              name: 'Premium Wireless Headphones',
              slug: 'premium-wireless-headphones',
              price: 25000,
              comparePrice: 35000,
              images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
              isFeatured: true
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch product for announcement:', error)
        // Fallback to demo product on error
        setProduct({
          _id: 'demo',
          name: 'Premium Wireless Headphones',
          slug: 'premium-wireless-headphones',
          price: 25000,
          comparePrice: 35000,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
          isFeatured: true
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProduct()
  }, [])

  if (loading) {
    // Show a loading placeholder
    return (
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="text-sm text-white/70">Loading announcement...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    // This should not happen now since we have a demo product fallback
    return null
  }

  if (dismissed) {
    return null
  }

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Content */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Product Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-white/20 flex-shrink-0">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white/60" />
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  New Arrival
                </span>
                {discount > 0 && (
                  <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold truncate mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-yellow-300">
                  ₦{product.price.toLocaleString('en-NG')}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-white/70 line-through">
                    ₦{product.comparePrice.toLocaleString('en-NG')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href={product._id === 'demo' ? '/shop' : `/shop/${product.slug}`}
              className="group bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 hover:scale-105 transform"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
            aria-label="Dismiss announcement"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}