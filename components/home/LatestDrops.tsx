'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const LatestDrops = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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

  const products = [
    {
      id: 1,
      name: 'Red Velvet Parka',
      price: '$850',
      category: 'Amaru Studio Edition',
      badge: 'Limited',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBE_jH7r6yjzoGUcCH400xzB2cfSBxLNEKS3zbKmkbIF7Fz8p9MTN_aaRdw2gfpNCKMr1VzwldjutZq2PZBGWRP8D-Dei_1i99ImRtAJnsmFsghNJ5bfpSpOm7tgdMPC94shEZH3V6LvHmE0EzL1Cg7b9R3n0c4E_-83-BsfZDmkal6yVKyEtmLfTmx58bfinFEwAE9dk6JUFchfXKsucTz4hfjL9U5gF3Mgf0HsQLFHyElGFIHGaN_jPTlqP_l-qUnVYPejC8upz9'
    },
    {
      id: 2,
      name: 'Sage Silk Cargo',
      price: '$620',
      category: 'Luxury Utility',
      badge: 'New',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjYV37nIYXCsGUc7H5QgvkmYCT3J2CYXOBmdv3KZwfl9E2VdFGUEmFpMZWgCenHqxyWU_Ox-Qk3fM_63v4es7WpXmqA9Vc0gwCPKqqRmzn6L51fWRRdAr-m42cpHTzuLbMqN83vOZUJ00mQ66purXzAe0SCiRBCyXdeZhPa-YvM9I0hBM2M-2IK7EbZSDoebBnXiKHlqtlQ6cReNlcc_oboVFlEPGyqJzF91Zvd7-shog37-jQYjc1T0TKkgJ_pXY1oE4Me54f-E7H'
    },
    {
      id: 3,
      name: 'Crimson Hoodie',
      price: '$450',
      category: 'Essential Silhouette',
      badge: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9sfFfmxbzIw1n1FmA1NpXH2ku9LgJBa4AjLkL8dC3IfcfXeiE87WwRSQ_EZSO8xzGQush8ow4o-EpEGJdpof_PuMo4TwjTptjVLCzLWkUfK8hVFZFyFZajWrOtrJs7oB2Tr0zWdHjNQm1zdDTblSXYohCv0_ajsH0XXomCFVgFlRnXXF2yOgC2QM74jenBICJbXigdgSaqH1rxMed__KMQGyYbv8naKqEKQmhLsCyVi1zxrjSn2LoFZX5Jp3-rm_pQvIlzn9VdId_'
    },
    {
      id: 4,
      name: 'Holly Knit Sweater',
      price: '$580',
      category: 'Jacquard Pattern',
      badge: 'Sold Out',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpQTR3FmXoABt2qQiwZVv90h-79A5V3xWzWu_nfBOfVLlVu_2vwPZZoHGIheLTWYaFVOm65lW4yY_CXmeTKgCerhxJkunX705Tmsq0DNCckupAut50L0lWzK2rZ25sWhT_naCSkB7D4kqKLlCpJQjYoQrnoj0JIT0VO2aMMCNR76MafX5qDwj4U__Klhm2LWusFqXuhdXteTxFHyu9LK1wZiSbRxYgHKNvVHu4uJeZgnKkKTUgRHhn_w7P2n61mnebcA21Z1cmgaTn'
    }
  ]

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Limited':
        return 'bg-white text-slate-900'
      case 'New':
        return 'bg-primary text-white'
      case 'Sold Out':
        return 'bg-black text-white'
      default:
        return ''
    }
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 lg:mb-16 gap-4 sm:gap-6 animate-on-scroll">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2 sm:mb-4">Latest Drops</h3>
          <p className="text-slate-300 text-sm sm:text-base font-medium">Seasonal essentials designed for the modern auteur.</p>
        </div>
        <Link 
          href="/collections" 
          className="group flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-gray-400 border-b-2 border-primary pb-1 w-fit hover:gap-3 transition-all"
        >
          View All Collections
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group cursor-pointer animate-on-scroll hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 sm:mb-6 bg-slate-100">
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
              <span className="font-black text-gray-300 text-base sm:text-lg">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LatestDrops