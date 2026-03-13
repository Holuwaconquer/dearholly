import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response'

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

    const order = await Order.findById(id)

    if (!order) {
      return notFoundResponse()
    }

    // Check if user is the owner or admin
    const user = await (await import('@/models/User')).default.findById(decoded.userId)
    if (order.userId.toString() !== decoded.userId && user?.role !== 'admin') {
      return forbiddenResponse()
    }

    return successResponse(order)
  } catch (error) {
    console.error('Get order error:', error)
    return errorResponse('Failed to get order', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
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

    const { status, notes } = await request.json()

    const { id } = await params
    const order = await Order.findById(id)

    if (!order) {
      return notFoundResponse()
    }

    // Check if user is the owner
    if (order.userId.toString() !== decoded.userId) {
      return forbiddenResponse()
    }

    // Only allow updating notes
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
