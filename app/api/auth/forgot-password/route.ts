import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generatePasswordResetToken } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { successResponse, badRequestResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email } = await request.json()

    if (!email) {
      return badRequestResponse('Please provide an email')
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal if email exists in system for security
      return successResponse(
        {},
        'If an account with this email exists, a password reset link has been sent'
      )
    }

    // Generate reset token
    const { token, hashedToken, expiresAt } = generatePasswordResetToken()

    // Save hashed token and expiry to user
    user.passwordResetToken = hashedToken
    user.passwordResetExpires = expiresAt
    await user.save()

    // Send email with reset link
    try {
      await sendPasswordResetEmail(user.email, token, user.firstName)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      // Reset the token if email fails
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save()
      return errorResponse('Failed to send reset email', 500)
    }

    return successResponse(
      {},
      'If an account with this email exists, a password reset link has been sent'
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return errorResponse('Forgot password request failed', 500)
  }
}
