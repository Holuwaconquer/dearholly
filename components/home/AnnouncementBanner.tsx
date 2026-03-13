'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import HollyDress from '@/public/dearholly-ladies.png'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  isFeatured: boolean
}

export default function AnnouncementModal() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

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
              name: 'Lady Hoodie and top',
              slug: 'Lady Hoodie and top',
              price: 25000,
              comparePrice: 35000,
              images: HollyDress ? [HollyDress.src] : [],
              isFeatured: true
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch product for announcement:', error)
        // Fallback to demo product on error
        setProduct({
          _id: 'demo',
          name: 'Lady Hoodie and top',
          slug: 'Lady Hoodie and top',
          price: 25000,
          comparePrice: 35000,
          images: HollyDress ? [HollyDress.src] : [],
          isFeatured: true
        })
      } finally {
        setLoading(false)
        // Show modal after a short delay for better UX
        setTimeout(() => setIsOpen(true), 1000)
      }
    }

    fetchFeaturedProduct()
  }, [])

  const closeModal = () => {
    setIsOpen(false)
  }

  const discount = product?.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  if (loading || !product || !isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          aria-label="Close announcement"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Product Image - Made bigger */}
        <div className="relative w-full h-64 bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="400px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-gray-400" />
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold uppercase tracking-wide text-gray-600">
              New Arrival
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-emerald-600">
              ₦{product.price.toLocaleString('en-NG')}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                ₦{product.comparePrice.toLocaleString('en-NG')}
              </span>
            )}
          </div>

          <Link
            href={product._id === 'demo' ? '/shop' : `/shop/${product.slug}`}
            onClick={closeModal}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
          >
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}