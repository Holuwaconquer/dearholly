import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WishlistItem from '@/models/WishlistItem'
import Product from '@/models/Product'
import { verifyToken } from '@/lib/auth'
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    await dbConnect()
    const wishlistItems = await WishlistItem.find({ userId: decoded.userId })
      .populate('productId', 'isActive quantity')
      .sort({ addedAt: -1 })

    // Filter out items where product is no longer active or in stock
    const activeItems = wishlistItems.filter(item => {
      const product = item.productId as any
      return product && product.isActive && product.quantity > 0
    })

    return successResponse(activeItems)
  } catch (error) {
    console.error('Get wishlist error:', error)
    return errorResponse('Failed to get wishlist', 500)
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return errorResponse('Product ID is required', 400)
    }

    await dbConnect()

    // Check if product exists and is active
    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      return notFoundResponse()
    }

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({
      userId: decoded.userId,
      productId: productId,
    })

    if (existingItem) {
      return errorResponse('Item already in wishlist', 400)
    }

    // Create wishlist item
    const wishlistItem = new WishlistItem({
      userId: decoded.userId,
      productId: productId,
      productName: product.name,
      productImage: product.images?.[0] || '',
      productPrice: product.cost || product.price,
      productCategory: product.category?.toString() || 'Uncategorized',
      inStock: product.quantity > 0,
    })

    await wishlistItem.save()
    return successResponse(wishlistItem, 'Item added to wishlist', 201)
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return errorResponse('Failed to add item to wishlist', 500)
  }
}