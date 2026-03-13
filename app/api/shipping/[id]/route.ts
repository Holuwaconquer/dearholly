import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ShippingAddress from '@/models/ShippingAddress'
import { verifyToken } from '@/lib/auth'
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'

// PUT /api/shipping/[id] - Update shipping address
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const { id } = await params
    const body = await request.json()
    const { type, recipient, address, city, state, zip, country, phone, isDefault } = body

    await dbConnect()
    const updatedAddress = await ShippingAddress.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      {
        type,
        recipient,
        address,
        city,
        state,
        zip,
        country,
        phone,
        isDefault,
      },
      { new: true }
    )

    if (!updatedAddress) {
      return notFoundResponse()
    }

    return successResponse(updatedAddress)
  } catch (error) {
    console.error('Update shipping address error:', error)
    return errorResponse('Failed to update shipping address', 500)
  }
}

// DELETE /api/shipping/[id] - Delete shipping address
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const { id } = await params
    await dbConnect()

    const deletedAddress = await ShippingAddress.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    })

    if (!deletedAddress) {
      return notFoundResponse()
    }

    return successResponse({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Delete shipping address error:', error)
    return errorResponse('Failed to delete shipping address', 500)
  }
}