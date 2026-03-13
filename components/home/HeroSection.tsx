'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Star } from 'lucide-react'

interface ProductPreview {
  name: string
  price: number
  comparePrice?: number
  slug: string
}

const FALLBACK_WEAR_PRODUCTS: ProductPreview[] = [
  { name: 'Classic Denim Jacket', price: 14500, comparePrice: 19000, slug: 'classic-denim-jacket' },
  { name: 'Leather Bomber', price: 28500, comparePrice: 34000, slug: 'leather-bomber' },
  { name: 'Slim Chino Pants', price: 10500, comparePrice: 13000, slug: 'slim-chino-pants' },
  { name: 'Vintage Graphic Tee', price: 6500, comparePrice: 8500, slug: 'vintage-graphic-tee' },
  { name: 'Wool Blend Overcoat', price: 37500, comparePrice: 42000, slug: 'wool-blend-overcoat' },
  { name: 'Cashmere Crewneck', price: 22500, comparePrice: 27000, slug: 'cashmere-crewneck' },
  { name: 'Tailored Sweatpants', price: 11500, comparePrice: 14500, slug: 'tailored-sweatpants' },
  { name: 'Zip-Up Hoodie', price: 9500, comparePrice: 12000, slug: 'zip-up-hoodie' },
  { name: 'Corduroy Shirt', price: 12500, comparePrice: 15500, slug: 'corduroy-shirt' },
  { name: 'Suede Chelsea Boots', price: 32500, comparePrice: 38000, slug: 'suede-chelsea-boots' },
]

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [recent, setRecent] = useState<ProductPreview[]>([])
  const [topDeal, setTopDeal] = useState<string | null>(null)
  const { addItem, isItemInCart } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // fetch 10 most recent products for hero display
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/products?limit=10&sort=-createdAt')
        const data = await res.json()
        if (data.success && Array.isArray(data.data.products)) {
          const products = data.data.products
          const mapped: ProductPreview[] = products.map((p: any) => ({
            name: p.name,
            price: p.price,
            comparePrice: p.comparePrice,
            slug: p.slug || p._id || 'shop',
          }))

          // If we have fewer than 10 real products, pad with our demo wears
          const finalList = [...mapped]
          if (finalList.length < 10) {
            const missing = 10 - finalList.length
            const toAdd = FALLBACK_WEAR_PRODUCTS.filter((item) =>
              !finalList.some((p) => p.slug === item.slug)
            ).slice(0, missing)
            finalList.push(...toAdd)
          }

          setRecent(finalList)

          // compute highest discount among what we have
          let best: any = null
          finalList.forEach((p: ProductPreview) => {
            if (p.comparePrice && p.comparePrice > p.price) {
              const diff = p.comparePrice - p.price
              if (!best || diff > best.diff) {
                best = { name: p.name, diff }
              }
            }
          })
          if (best) {
            setTopDeal(best.name)
          }
        } else {
          // fallback to our demo catalog
          setRecent(FALLBACK_WEAR_PRODUCTS)
          setTopDeal(FALLBACK_WEAR_PRODUCTS[0].name)
        }
      } catch (err) {
        console.error('failed to fetch recent products', err)
        setRecent(FALLBACK_WEAR_PRODUCTS)
        setTopDeal(FALLBACK_WEAR_PRODUCTS[0].name)
      }
    }
    fetchRecent()
  }, [])

  // when recent data updates we could also compute top deal but we'll compute in fetch

  useEffect(() => {
    if (!mounted) return

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

    return () => observer.disconnect()
  }, [mounted])



  // Public domain videos that definitely work
  const videoSources = [
    {
      url: "https://archive.org/download/SampleVideo_201806/SampleVideo_1280x720_1mb.mp4",
      type: "video/mp4"
    },
    {
      url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
      type: "video/mp4"
    }
  ]

  if (!mounted) {
    return (
      <section className="relative min-h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070)',
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase mb-3 sm:mb-4 text-white">
                RHYTHM & REFINEMENT
              </h1>
              <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-xl">
                Seasonal essentials designed for the modern auteur.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Background with sticky effect */}
      <div className="fixed inset-0 -z-10 min-h-screen w-full pointer-events-none">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            {videoSources.map((video, index) => (
              <source key={index} src={video.url} type={video.type} />
            ))}
            Your browser does not support the video tag.
          </video>
        ) : (
          // Fallback image
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070)',
            }}
          />
        )}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
        <div ref={sectionRef} className="grid md:grid-cols-2 items-center justify-center gap-8 lg:gap-12 animate-on-scroll">
          {/* Left side - Main content */}
          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase mb-3 sm:mb-4 text-white animate-slide-down">
              RHYTHM & REFINEMENT
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-xl animate-slide-up animate-delay-200">
              Seasonal essentials designed for the modern auteur. Experience the intersection of acoustic inspiration and high-end tailoring.
            </p>
          </div>

          {/* Right side - Featured Product */}
          {recent.length > 0 && (
            <div className="w-full shrink-0 animate-slide-up animate-delay-300">
              <div className="group relative bg-linear-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl overflow-hidden hover:from-white/30 hover:to-white/10 transition-all duration-500 hover:scale-105 w-3/4 shadow-2xl border border-white/20">
                <Link href={`/shop/${recent[0].slug}`}>
                  <div className="aspect-3/4 relative overflow-hidden">
                    <Image
                      src="/dearholly-ladies.png"
                      alt={recent[0].name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    {recent[0].comparePrice && recent[0].comparePrice > recent[0].price && (
                      <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                        -{Math.round(((recent[0].comparePrice - recent[0].price) / recent[0].comparePrice) * 100)}%
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white text-2xl font-bold mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors drop-shadow-lg">
                        {recent[0].name}
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-300 font-black text-3xl drop-shadow-lg">
                          ₦{recent[0].price.toLocaleString('en-NG')}
                        </span>
                        {recent[0].comparePrice && recent[0].comparePrice > recent[0].price && (
                          <span className="text-white/80 text-xl line-through drop-shadow">
                            ₦{recent[0].comparePrice.toLocaleString('en-NG')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-8">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      addItem({
                        id: recent[0].slug,
                        name: recent[0].name,
                        price: recent[0].price,
                        image: '/dearholly-ladies.png',
                        slug: recent[0].slug,
                      })
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    aria-label="Add to cart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 animate-slide-up animate-delay-400 lg:hidden">
            <Link
              href="/shop"
              className="group bg-primary text-white px-5 sm:px-6 py-3 font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-soft-green transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              Shop Collection
            </Link>
            <Link
              href="/shop"
              className="group flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-widest text-white border-b-2 border-white pb-1 hover:border-primary transition-colors"
            >
              Browse Latest
              <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform duration-300">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
