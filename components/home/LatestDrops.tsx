'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

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
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=4&sort=-createdAt')
        const data = await res.json()
        if (data.success) {
          setProducts(data.data.products)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
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
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-4 sm:gap-6">
          <div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2 sm:mb-4">Latest Drops</h3>
            <p className="text-slate-300 text-sm sm:text-base font-medium">Seasonal essentials designed for the modern auteur.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-300 dark:bg-gray-700 rounded-xl mb-4 sm:mb-6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-4 sm:gap-6 animate-on-scroll">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2 sm:mb-4">Latest Drops</h3>
          <p className="text-slate-300 text-sm sm:text-base font-medium">Seasonal essentials designed for the modern auteur.</p>
        </div>
        <Link 
          href="/shop" 
          className="group flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-gray-400 border-b-2 border-primary pb-1 w-fit hover:gap-3 transition-all"
        >
          View All Products
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.length > 0 ? products.map((product) => (
          <Link 
            key={product._id} 
            href={`/shop/${product.slug || product._id}`}
            className="group cursor-pointer animate-on-scroll hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 sm:mb-6 bg-slate-100 dark:bg-slate-800">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {product.badge && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest shadow-sm ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h4 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors">
                  {product.name}
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-tighter">
                  {product.category}
                </p>
              </div>
              <span className="font-black text-gray-300 text-base sm:text-lg">
                ₦{product.price.toLocaleString()}
                {product.comparePrice && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    ₦{product.comparePrice.toLocaleString()}
                  </span>
                )}
              </span>
            </div>
          </Link>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No products available</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default LatestDrops