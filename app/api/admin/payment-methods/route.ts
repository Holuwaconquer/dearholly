import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PaymentMethod from '@/models/PaymentMethod'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response'

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

    const paymentMethod = await PaymentMethod.findOne({ method: 'manual' })
    return successResponse(paymentMethod || null)
  } catch (error) {
    console.error('Get payment method error:', error)
    return errorResponse('Failed to fetch payment method', 500)
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

    const { label, details, isActive } = await request.json()
    if (!label || !details) return badRequestResponse('label and details are required')

    const existing = await PaymentMethod.findOne({ method: 'manual' })
    if (existing) {
      existing.label = label
      existing.details = details
      existing.isActive = isActive !== undefined ? isActive : existing.isActive
      await existing.save()
      return successResponse(existing, 'Payment settings updated')
    }

    const paymentMethod = new PaymentMethod({ method: 'manual', label, details, isActive: isActive ?? true })
    await paymentMethod.save()
    return successResponse(paymentMethod, 'Payment settings created', 201)
  } catch (error) {
    console.error('Save payment method error:', error)
    return errorResponse('Failed to save payment settings', 500)
  }
}
