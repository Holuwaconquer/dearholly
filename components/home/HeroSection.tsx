'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [topDeal, setTopDeal] = useState<string | null>(null)

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
          setRecent(products.map((p: any) => p.name))
          // compute highest discount
          let best: any = null
          products.forEach((p: any) => {
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
        }
      } catch (err) {
        console.error('failed to fetch recent products', err)
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

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div ref={sectionRef} className="flex flex-col gap-3 sm:gap-4 animate-on-scroll">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase mb-3 sm:mb-4 text-white animate-slide-down">
              RHYTHM & REFINEMENT
            </h1>
            <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-xl animate-slide-up animate-delay-200">
              Seasonal essentials designed for the modern auteur. Experience the intersection of acoustic inspiration and high-end tailoring.
            </p>
          {recent.length > 0 && (
            <p className="mt-6 text-sm text-white/70 animate-slide-up animate-delay-400">
              Latest: {recent.join(' • ')}
            </p>
          )}
          {topDeal && (
            <p className="mt-2 text-sm text-yellow-300 animate-slide-up animate-delay-600">
              🔥 Biggest deal: {topDeal}
            </p>
          )}          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 animate-slide-up animate-delay-400">
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

        {/* Featured Products */}
        <div 
          ref={productsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 lg:mt-16"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="group cursor-pointer animate-on-scroll"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500"></div>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white truncate">{product.name}</h4>
              <span className="font-black text-primary text-xs sm:text-sm">{product.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce-slow">
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
