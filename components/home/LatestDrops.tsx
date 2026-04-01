'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface ProductPreview {
  name: string
  price: number
  comparePrice?: number
  slug: string
  image?: string
}

const FALLBACK_WEAR_PRODUCTS: ProductPreview[] = [
  { name: 'Classic Denim Jacket', price: 14500, comparePrice: 19000, slug: 'classic-denim-jacket', image: '/dearholly-ladies.png' },
  { name: 'Leather Bomber', price: 28500, comparePrice: 34000, slug: 'leather-bomber', image: '/dearholly-ladies.png' },
  { name: 'Slim Chino Pants', price: 10500, comparePrice: 13000, slug: 'slim-chino-pants', image: '/dearholly-ladies.png' },
  { name: 'Vintage Graphic Tee', price: 6500, comparePrice: 8500, slug: 'vintage-graphic-tee', image: '/dearholly-ladies.png' },
  { name: 'Wool Blend Overcoat', price: 37500, comparePrice: 42000, slug: 'wool-blend-overcoat', image: 'dearholly-ladies.png' },
  { name: 'Cashmere Crewneck', price: 22500, comparePrice: 27000, slug: 'cashmere-crewneck', image: '/dearholly-ladies.png' },
  { name: 'Tailored Sweatpants', price: 11500, comparePrice: 14500, slug: 'tailored-sweatpants', image: '/dearholly-ladies.png' },
  { name: 'Zip-Up Hoodie', price: 9500, comparePrice: 12000, slug: 'zip-up-hoodie', image: '/dearholly-ladies.png' },
  { name: 'Corduroy Shirt', price: 12500, comparePrice: 15500, slug: 'corduroy-shirt', image: '/dearholly-ladies.png' },
  { name: 'Suede Chelsea Boots', price: 32500, comparePrice: 38000, slug: 'suede-chelsea-boots', image: '/dearholly-ladies.png' },
]

interface Product {
  _id: string
  slug?: string
  name: string
  price: number
  comparePrice?: number
  category: string
  badge?: string
  image: string
}

const LatestDrops = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<ProductPreview[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=8&sort=-createdAt')
        const data = await res.json()
        if (data.success && Array.isArray(data.data.products) && data.data.products.length > 0) {
          const dbProducts = data.data.products
          const mapped: ProductPreview[] = dbProducts.map((p: any) => ({
            name: p.name,
            price: p.price,
            comparePrice: p.comparePrice,
            slug: p.slug || p._id || 'shop',
            image: p.image || '/dearholly-ladies.png', 
          }))

          // If we have fewer than 8 real products, pad with our demo wears
          const finalList = [...mapped]
          if (finalList.length < 8) {
            const missing = 8 - finalList.length
            const toAdd = FALLBACK_WEAR_PRODUCTS.filter((item) =>
              !finalList.some((p) => p.slug === item.slug)
            ).slice(0, missing)
            finalList.push(...toAdd)
          }

          setProducts(finalList)
        } else {
          // fallback to our demo catalog
          setProducts(FALLBACK_WEAR_PRODUCTS.slice(0, 8))
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        // Always show demo products
        setProducts(FALLBACK_WEAR_PRODUCTS.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.children
      Array.from(cards).forEach((card, index) => {
        ;(card as HTMLElement).style.transitionDelay = `${index * 0.1}s`
        observer.observe(card)
      })
    }

    return () => observer.disconnect()
  }, [])

  const getBadgeColor = (badge?: string) => {
    switch(badge) {
      case 'Limited':
        return 'bg-white text-slate-900'
      case 'New':
        return 'bg-primary text-white'
      case 'Sale':
        return 'bg-red-500 text-white'
      case 'Popular':
        return 'bg-amber-500 text-white'
      default:
        return ''
    }
  }

  // Show skeleton loaders while loading
  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-4 sm:gap-6">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2 sm:mb-4">Latest Drops</h3>
              <p className="text-slate-300 text-sm sm:text-base font-medium">Seasonal essentials designed for the modern auteur.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-4 sm:gap-6 ">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2 sm:mb-4 text-black">Latest Drops</h3>
          <p className="text-gray-600 text-sm sm:text-base font-medium">Seasonal essentials designed for the modern auteur.</p>
        </div>
        <Link 
          href="/shop" 
          className="group flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-gray-700 border-b-2 border-primary pb-1 w-fit hover:gap-3 transition-all"
        >
          View All Products
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-full">
        {products.length > 0 ? products.map((product, index) => (
          <div
            key={product.slug || index}
            className="group bg-white backdrop-blur-md rounded-xl overflow-hidden  hover:bg-white transition-all duration-300 hover:scale-101 shadow-lg hover:shadow-xl "
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <Link href={`/shop/${product.slug}`}>
              <div className="aspect-4/5 relative overflow-hidden">
                <img
                  src={product.image || '/dearholly-ladies.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.comparePrice && product.comparePrice > product.price && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <h4 className="text-slate-900 text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-primary font-bold text-lg">
                    ₦{product.price.toLocaleString('en-NG')}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-slate-400 text-sm line-through">
                      ₦{product.comparePrice.toLocaleString('en-NG')}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    addItem({
                      id: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.image || '/amarureal.jpeg',
                      slug: product.slug,
                    })
                    setToastMsg(`${product.name} added to cart`)
                    setTimeout(() => setToastMsg(null), 3000)
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold text-sm transition-colors"
                  aria-label="Add to cart"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No products available</p>
          </div>
        )}
      </div>
      </div>

      {/* Toast */}
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
    </section>
  )
}

export default LatestDrops