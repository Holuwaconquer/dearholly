import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, generateToken } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import { successResponse, badRequestResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { firstName, lastName, email, password } = await request.json()

    // Basic validation
    if (!firstName || !email || !password) {
      return badRequestResponse('First name, email and password are required')
    }

    if (password.length < 6) {
      return badRequestResponse('Password must be at least 6 characters')
    }

    // ensure email is lowercase
    const normalizedEmail = email.toLowerCase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return badRequestResponse('Email is already registered')
    }

    // Hash password and create new user
    const hashed = await hashPassword(password)

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      email: normalizedEmail,
      password: hashed,
      status: 'active',
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.firstName)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the registration if email fails, just log it
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
          role: user.role,
          status: user.status,
        },
        token,
      },
      'Registration successful',
      201
    )
  } catch (error) {
    console.error('Register error:', error)
    return errorResponse('Registration failed', 500)
  }
}
