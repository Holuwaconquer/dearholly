import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'active'

    const skip = (page - 1) * limit

    const categories = await Category.find({ status })
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)

    const total = await Category.countDocuments({ status })

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
    console.error('Get categories error:', error)
    return errorResponse('Failed to get categories', 500)
  }
}
