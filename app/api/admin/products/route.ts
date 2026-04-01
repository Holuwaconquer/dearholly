import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response'

// Check if user is admin
const checkAdmin = async (userId: string) => {
  const user = await User.findById(userId)
  return user?.role === 'admin'
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) {
      return forbiddenResponse()
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // support optional filters
    const categoryId = searchParams.get('category')
    const slug = searchParams.get('slug')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const filter: any = {}

    if (categoryId) {
      filter.category = categoryId
    }
    if (slug) {
      filter.slug = slug
    }
    if (status && ['active', 'inactive'].includes(status)) {
      filter.isActive = status === 'active'
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ]
    }

    const productsQuery = Product.find(filter).populate('category', 'name')
    if (!slug) {
      productsQuery.sort('-createdAt').limit(limit).skip(skip)
    }
    const products = await productsQuery

    const total = slug ? (products.length > 0 ? 1 : 0) : await Product.countDocuments(filter)

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get admin products error:', error)
    return errorResponse('Failed to get products', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) {
      return forbiddenResponse()
    }

    const {
      name,
      description,
      price,
      category,
      images,
      colors,
      variants,
      comparePrice,
      cost,
      sku,
      barcode,
      quantity,
      weight,
      isActive,
      isFeatured
    } = await request.json()

    // Validation
    if (!name || !description || !price || !category) {
      return badRequestResponse('Please provide all required fields')
    }

    if (price <= 0) {
      return badRequestResponse('Price must be greater than 0')
    }

    // ensure category exists
    const cat = await Category.findById(category)
    if (!cat) {
      return badRequestResponse('Invalid category')
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images: images || [],
      colors: colors || [],
      variants: variants || [],
      comparePrice,
      cost,
      sku,
      barcode,
      quantity: quantity || 0,
      weight,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false
    })

    return successResponse(product, 'Product created successfully', 201)
  } catch (error) {
    console.error('Create product error:', error)
    return errorResponse('Failed to create product', 500)
  }
}
