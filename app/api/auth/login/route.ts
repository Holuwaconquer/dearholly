import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { comparePassword, generateToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return badRequestResponse('Please provide email and password')
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user) {
      return badRequestResponse('Invalid email or password')
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return badRequestResponse('Invalid email or password')
    }

    // Generate token
    const token = generateToken(user._id.toString())

    return successResponse(
      {
        user: {
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
        token,
      },
      'Login successful'
    )
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Login failed', 500)
  }
}
