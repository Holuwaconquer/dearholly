import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'

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

    const user = await User.findById(decoded.userId)

    if (!user) {
      return badRequestResponse('User not found')
    }

    return successResponse({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      country: user.country,
      role: user.role,
      isVerified: user.isVerified,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return errorResponse('Failed to get profile', 500)
  }
}

export async function PUT(request: NextRequest) {
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

    const { firstName, lastName, phone, address, city, state, postalCode, country } =
      await request.json()

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        country: country || undefined,
      },
      { new: true, runValidators: true }
    )

    if (!user) {
      return badRequestResponse('User not found')
    }

    return successResponse(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
        role: user.role,
      },
      'Profile updated successfully'
    )
  } catch (error) {
    console.error('Update profile error:', error)
    return errorResponse('Failed to update profile', 500)
  }
}
