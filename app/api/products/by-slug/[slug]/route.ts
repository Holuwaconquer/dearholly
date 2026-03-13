import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    await dbConnect()

    let product
    
    // Try to find by slug first
    product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .lean()
    
    // If not found and slug looks like an ObjectId, try finding by ID
    if (!product && mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findOne({ _id: slug, isActive: true })
        .populate('category', 'name slug')
        .lean()
    }

    if (!product) {
      return notFoundResponse()
    }

    // Get category name
    let categoryName = 'Unknown'
    if (product.category && typeof product.category === 'object' && 'name' in product.category) {
      categoryName = (product.category as any).name
    }

    return successResponse({
      ...product,
      categoryName,
    })
  } catch (error) {
    console.error('Get product by slug error:', error)
    return errorResponse('Failed to get product', 500)
  }
}
