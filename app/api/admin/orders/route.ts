import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
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
    const status = searchParams.get('status')

    const skip = (page - 1) * limit
    const filter: any = {}

    if (status && ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(status)) {
      filter.status = status
    }

    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)

    const total = await Order.countDocuments(filter)

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get admin orders error:', error)
    return errorResponse('Failed to get orders', 500)
  }
}
