'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function ShopPage() {
  const [sortBy, setSortBy] = useState('newest')
  const [selectedSize, setSelectedSize] = useState('S')

  const products = [
    {
      id: 1,
      name: 'Red Velvet Hoodie',
      price: '$450.00',
      category: 'Signature Series',
      badge: 'Limited',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3cyAsafVwJ-i2_FeJjjmOcFheNlvYjCpUU32lew_fMOAWd5Uno26HtqXUj12RpFnSGBHsbfTSqeOauenGyab1eS5PwuCHJ__sKrlSIokf56Qh8wfFOoMgxdsqwCWQJUNrHgt25HBi1N5_s8KxoFrwPufHejHGMlzce-QmPNQwgubpAe1s014fYj9HvDs1w5CrOkx7Ej0kOPEvv_xWsPZpUW_JQx7WWGfODTmFAsVKPHpsydhmsFoEfxryCk0en34ZUlfAwqTvZnv'
    },
    {
      id: 2,
      name: 'Script Logo Tee',
      price: '$180.00',
      category: 'Essential',
      badge: 'New',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPVmtPHRXAZNMFMm_i0FiBwphx7TFVbG2TgEjxo-oj0RKZi5apYZ9wziysypxAaxRaZCKh-WIYTsp2QFCuu95bTYbdQp5FoOz3oeUIQ6EvYCOGtzVfPTrLC4RgeEzRLDkuFVZjYwxmv3v-YOwhCcIgmuYLV8KnRWlLGtsMKphAiDbLX5lvRc-vVmEB3jzn0itxB50CV8lgHBrTGxasRfvt5Qu-4jbMWjtNWasCz2YM_cnlvF5jziATLq16uIItO8CYWy4YbQqOwoCA'
    },
    {
      id: 3,
      name: 'Tailored Forest Cargo',
      price: '$620.00',
      category: 'Signature Series',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEMczPW2WF8ItK6fb1wLIe9vQt0xoC_rAdmPKeUmkMQEfk1gOIyiUwcwmSHyPzf2GraFJAh4cvQuELIKtFm6DOb0J2DubcxRciFav0WHNqepAThnSR_QQXDQoonfPAdHv0snExSGGf_9REDDz0SQNrl13wi380pkxCNLyZSh7Xy8kAG46CHD8-6o9EaqJEIL1VBCldIHynQlO4V9hFV_SCYm64FCr_k5DEFcH8KOiggqr3lqBsS6nMj1nG2RmVZaszrvy_mek58e-M'
    },
    {
      id: 4,
      name: 'Moto Leather Bomber',
      price: '$1,250.00',
      category: 'Premium',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0toVHk1KmyW_pWD-mVKwEQsshzke7lx9HFGUttebOpe_dTqgFwSkm66OMWF_GsAT3frByTwclZ7Q8SL2-lTb_mo2cunIJgr_7PHPkBGM9_FKGPbZ9FSVX7zxU0zPGNKvvj-RzI7QwZeCONZVEyQezcjWs6GiOeRozbIFM8XSt4m9_5QLOp5T0F0iug56dTKzVUqUlrgXyKSlpKA0p2kcp3F6f2Vz9svJqTJHI3UUep_QUP5b1cdE_orJhEb6n26hvt_QVhTVgi3Ln'
    },
    {
      id: 5,
      name: 'Oversized Cashmere Knit',
      price: '$890.00',
      category: 'Premium',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIIBFL9hS48MMCYMc1qgeplYXjNl2L-oai-dxD4jNKs1pAyyYTIfzI76mTITRUiWeE0nZWiYjdz21DDijOgUyQNNsJtMFb639qWGlZOvAC0AxaCogEKnB4szY2FvyRmb-CwPChrtWrTFQi1p9zBqzYt6bfrMaB6n0iJb1Blv61yTQXrz_TQfgGUDyyma3Kqc4cO1-QBfhtNRfIImBITQL-EQ-fzbOI3Haiay7VVxMRZO-w5GpADp9q_ed0nEAeYsdymzSGNKklZ8Z_'
    },
    {
      id: 6,
      name: 'Signature Utility Bag',
      price: '$320.00',
      category: 'Accessories',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRJnEbt0p2EAdSf-HKCaICPSvZKTG2quL0B7qrBY-EuNkIeOGLfS8Qlq3MOGBS0X_x7k75HC7Ssx-kQNy6bOHUZ7WWiv6f8N4JPVztQnVuTc29EYS71_a2KxfB-Bk4DQqdoI8cpdffvFbqi8jGckURVcPjjwBAeQ5YsGUclngi0Xm8Q00cLPkjtGliTNi2sVyGYWkxpmcX_IeK9SdnUCu6a-nVtxtvf_GT8Gzx-qexnwYwNPNbPQX-1eyfPHEQyXcSnXdiGQ1WJW8X'
    }
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'OS']

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Editorial Header */}
        <section className="mb-12 animate-slide-down">
          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqTnpVKwZBZpds9lRV3sTXwI2lTX3CgQ5zoXppE0gsiLACAZu1mzQrL8ZvxtInSlARXKV-3c4CAfi2KxeaDzTW8uDJSda4mZFdnfk6L9Ly4ob3Vdaj07PuPdZrIALdYhXZxnh7UjyWPAIMNpYSOFk-yz7y_x8khRbDmV45MoA23czf3clsQho0glDI30Lt_W07mur116UrfwhIkL5j8IIErDsdj2rwTPVhjEj91lKiFAcD4mmdDZef7YBqyoL1oOQeUq5yWZLVE_iw" 
              alt="Luxury streetwear collection"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-12">
              <span className="text-accent-green text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2 sm:mb-4">Summer '24 Drop</span>
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter max-w-2xl mb-4 sm:mb-6">THE VELVET REVOLUTION</h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-md font-light leading-relaxed">Experience the intersection of high-couture aesthetics and raw street culture.</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8 lg:space-y-10 animate-slide-left">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 lg:mb-6">Collections</h3>
              <ul className="space-y-3 lg:space-y-4">
                {[
                  { name: 'All Pieces', count: 84 },
                  { name: 'Signature Series', count: 12, active: true },
                  { name: 'Limited Drop', count: 8 },
                  { name: 'Archive', count: 24 },
                ].map((item) => (
                  <li key={item.name}>
                    <a 
                      href="#" 
                      className={`flex justify-between items-center text-sm transition-colors hover:text-primary ${
                        item.active ? 'font-bold text-primary' : 'font-medium'
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className={`${item.active ? 'text-primary' : 'text-slate-400'} font-normal`}>{item.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 lg:mb-6">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 text-xs font-bold transition-all duration-300 hover:scale-105 ${
                      selectedSize === size
                        ? 'border border-primary bg-primary text-white'
                        : 'border border-slate-200 hover:border-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 lg:mb-6">Price Range</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  className="w-full h-1.5 bg-accent-green rounded-lg appearance-none cursor-pointer accent-primary" 
                  min="100"
                  max="2500"
                />
                <div className="flex justify-between mt-4 text-sm font-bold">
                  <span>$100</span>
                  <span>$2,500</span>
                </div>
              </div>
            </div>

            <div className="pt-4 lg:pt-6">
              <button className="w-full py-3 lg:py-4 bg-deep-green text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary transition-colors hover:scale-[1.02] active:scale-95">
                Apply Filters
              </button>
              <button className="w-full mt-3 lg:mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary underline transition-colors">
                Clear All
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 animate-slide-right">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 border-b border-slate-100 pb-4 lg:pb-6 gap-4">
              <p className="text-slate-500 text-sm">Showing <span className="text-slate-900 font-bold">12</span> of <span className="text-slate-900 font-bold">84</span> products</p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none text-sm font-bold focus:ring-0 bg-transparent py-0 w-full sm:w-auto"
                >
                  <option value="newest">Newest First</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-x-8 lg:gap-y-12">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-accent-green rounded-xl mb-4">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      src={product.image} 
                      alt={product.name}
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                      <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                    </button>
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm">
                      <button className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-colors hover:scale-[1.02] active:scale-95">
                        Add to Cart
                      </button>
                    </div>
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                          product.badge === 'Limited' ? 'bg-white text-slate-900' : 'bg-primary text-white'
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-primary font-black">{product.price}</p>
                    <p className="text-xs text-slate-400">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-16 lg:mt-20 gap-2 sm:gap-4">
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold transition-all duration-300 hover:scale-110 ${
                    page === 1
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 hover:bg-accent-green'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="green" />
    </>
  )
}