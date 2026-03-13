import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WishlistItem from '@/models/WishlistItem'
import { verifyToken } from '@/lib/auth'
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'

// DELETE /api/wishlist/[id] - Remove item from wishlist
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

    const deletedItem = await WishlistItem.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    })

    if (!deletedItem) {
      return notFoundResponse()
    }

    return successResponse({ message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return errorResponse('Failed to remove item from wishlist', 500)
  }
}