import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
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
    if (!token) return unauthorizedResponse()
    const decoded = verifyToken(token)
    if (!decoded) return unauthorizedResponse()
    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) return forbiddenResponse()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const categories = await Category.find()
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)

    const total = await Category.countDocuments()

    return successResponse({
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get admin categories error:', error)
    return errorResponse('Failed to get categories', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) return unauthorizedResponse()
    const decoded = verifyToken(token)
    if (!decoded) return unauthorizedResponse()
    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) return forbiddenResponse()

    const { name, description, parent } = await request.json()
    if (!name) {
      return badRequestResponse('Name is required')
    }

    // generate slug automatically
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-')

    // ensure slug unique
    const existing = await Category.findOne({ slug })
    if (existing) {
      return badRequestResponse('Category with the same name already exists')
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      status: 'active',
      parent: parent || null,
    })

    return successResponse(category, 'Category created successfully', 201)
  } catch (error) {
    console.error('Create category error:', error)
    return errorResponse('Failed to create category', 500)
  }
}
