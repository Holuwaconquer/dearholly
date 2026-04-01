import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse } from '@/lib/api-response'

// Check if user is admin
const checkAdmin = async (userId: string) => {
  const user = await User.findById(userId)
  return user?.role === 'admin'
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params

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

    const order = await Order.findById(id).populate('userId', 'firstName lastName email phone')

    if (!order) {
      return notFoundResponse()
    }

    return successResponse(order, 'Order retrieved successfully')
  } catch (error) {
    console.error('Get order error:', error)
    return errorResponse('Failed to get order', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params

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

    const order = await Order.findById(id)

    if (!order) {
      return notFoundResponse()
    }

    const { status, paymentStatus, notes } = await request.json()

    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
      if (!validStatuses.includes(status)) {
        return badRequestResponse('Invalid order status')
      }
      order.status = status
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['pending', 'completed', 'failed']
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return badRequestResponse('Invalid payment status')
      }
      order.paymentStatus = paymentStatus
    }

    if (notes !== undefined) {
      order.notes = notes
    }

    await order.save()

    return successResponse(order, 'Order updated successfully')
  } catch (error) {
    console.error('Update order error:', error)
    return errorResponse('Failed to update order', 500)
  }
}
