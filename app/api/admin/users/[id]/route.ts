import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import Order from '@/models/Order'
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

    const user = await User.findById(id)
      .select('-password -passwordResetToken -passwordResetExpires')

    if (!user) {
      return notFoundResponse()
    }

    // compute a few extra stats
    const u = user.toObject()
    const orders = await Order.find({ userId: u._id })
    u.ordersCount = orders.length
    u.totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    u.joined = u.createdAt
    u.lastActive = u.updatedAt

    return successResponse(u)
  } catch (error) {
    console.error('Get user error:', error)
    return errorResponse('Failed to get user', 500)
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

    const user = await User.findById(id)

    if (!user) {
      return notFoundResponse()
    }

    const { role, status, firstName, lastName, email, phone } = await request.json()

    if (firstName) {
      user.firstName = firstName
    }
    if (lastName) {
      user.lastName = lastName
    }
    if (email) {
      if (email !== user.email) {
        const existing = await User.findOne({ email })
        if (existing) {
          return badRequestResponse('Email already in use')
        }
        user.email = email
      }
    }
    if (phone !== undefined) {
      user.phone = phone
    }

    if (role) {
      if (!['user', 'admin'].includes(role)) {
        return badRequestResponse('Invalid role')
      }
      user.role = role
    }

    if (status) {
      if (!['active', 'suspended'].includes(status)) {
        return badRequestResponse('Invalid status')
      }
      user.status = status
    }

    await user.save()

    return successResponse(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
      'User updated successfully'
    )
  } catch (error) {
    console.error('Update user error:', error)
    return errorResponse('Failed to update user', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const user = await User.findById(id)
    if (!user) {
      return notFoundResponse()
    }

    await user.deleteOne()
    return successResponse({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return errorResponse('Failed to delete user', 500)
  }
}
