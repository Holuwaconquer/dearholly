import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || '-createdAt'
    const isFeatured = searchParams.get('isFeatured') === 'true'

    await dbConnect()

    // Build filter
    const filter: any = { isActive: true }
    if (isFeatured) {
      filter.isFeatured = true
    }

    // Build sort
    let sortOption: any = {}
    if (sort === '-createdAt') {
      sortOption = { createdAt: -1 }
    } else if (sort === 'price') {
      sortOption = { price: 1 }
    } else if (sort === '-price') {
      sortOption = { price: -1 }
    }

    // Get products
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(Math.min(limit, 50)) // Max 50 products
      .lean()

    // Transform products for frontend
    const transformedProducts = products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      cost: product.cost,
      images: product.images || [],
      colors: product.colors || [],
      variants: product.variants || [],
      sku: product.sku,
      quantity: product.quantity,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      categoryName: (product.category as any)?.name || 'Unknown'
    }))

    return successResponse({
      products: transformedProducts,
      total: transformedProducts.length
    })
  } catch (error) {
    console.error('Get products error:', error)
    return errorResponse('Failed to get products', 500)
  }
}