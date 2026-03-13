'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: string
  originalPrice?: string
  category: string
  badge?: 'Limited' | 'New' | 'Sold Out'
  image: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-accent-green rounded-xl mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Wishlist button */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 p-2 bg-white/90 rounded-full transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          aria-label="Add to wishlist"
        >
          <span className={`material-symbols-outlined text-xl transition-colors ${
            isLiked ? 'text-primary fill-current' : 'text-primary'
          }`}>
            {isLiked ? 'favorite' : 'favorite'}
          </span>
        </button>

        {/* Quick add to cart */}
        <div 
          className={`absolute bottom-0 inset-x-0 p-4 transition-transform duration-500 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-colors hover:scale-105 active:scale-95">
            Add to Cart
          </button>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
              product.badge === 'Limited' 
                ? 'bg-white text-slate-900' 
                : product.badge === 'New'
                ? 'bg-primary text-white'
                : 'bg-black text-white'
            }`}>
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors uppercase tracking-tight">
            {product.name}
          </h4>
          <p className="text-slate-400 text-sm font-medium">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="text-primary font-black">₦{Number(product.price).toLocaleString()}</p>
          {product.originalPrice && (
            <p className="text-slate-400 text-xs line-through">{product.originalPrice}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard