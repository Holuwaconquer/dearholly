'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
  slug?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isItemInCart: (id: string, size?: string, color?: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      )

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1
        return updatedItems
      } else {
        // Add new item
        return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }]
      }
    })
  }

  const removeItem = (id: string, size?: string, color?: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item =>
          !(item.id === id && item.size === size && item.color === color)
      )
    )
  }

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) {
      removeItem(id, size, color)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const isItemInCart = (id: string, size?: string, color?: string) => {
    return items.some(
      item => item.id === id && item.size === size && item.color === color
    )
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isItemInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}