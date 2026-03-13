import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
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
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit
    const filter: any = {}

    if (role && ['user', 'admin'].includes(role)) {
      filter.role = role
    }
    if (status && ['active', 'suspended'].includes(status)) {
      filter.status = status
    }
    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }]
    }

    const users = await User.find(filter)
      .select('-password -passwordResetToken -passwordResetExpires')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)

    const total = await User.countDocuments(filter)

    // enrich each user with a few computed stats
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const u = user.toObject()
        const orders = await Order.find({ userId: u._id })
        const ordersCount = orders.length
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
        return {
          ...u,
          ordersCount,
          totalSpent,
          joined: u.createdAt,
          lastActive: u.updatedAt,
        }
      })
    )

    return successResponse({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get admin users error:', error)
    return errorResponse('Failed to get users', 500)
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

    const { firstName, lastName, email, phone, password, role, status } = await request.json()
    if (!firstName || !lastName || !email || !password) {
      return badRequestResponse('First name, last name, email, and password are required')
    }

    // Check if email exists
    const existing = await User.findOne({ email })
    if (existing) {
      return badRequestResponse('User with this email already exists')
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone: phone || '',
      password, // will be hashed by pre-save hook
      role: role || 'user',
      status: status || 'active',
      isVerified: true, // admin created, assume verified
    })

    return successResponse({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
    }, 'User created successfully', 201)
  } catch (error) {
    console.error('Create user error:', error)
    return errorResponse('Failed to create user', 500)
  }
}
