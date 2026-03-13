import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, verifyPasswordResetToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { token, password, confirmPassword } = await request.json()

    // Validation
    if (!token || !password || !confirmPassword) {
      return badRequestResponse('Please provide token and passwords')
    }

    if (password !== confirmPassword) {
      return badRequestResponse('Passwords do not match')
    }

    if (password.length < 6) {
      return badRequestResponse('Password must be at least 6 characters')
    }

    // Hash the token to compare with stored hash
    const hashedToken = verifyPasswordResetToken(token)

    // Find user with matching reset token and check expiry
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires')

    if (!user) {
      return badRequestResponse('Password reset token is invalid or has expired')
    }

    // Update password
    user.password = await hashPassword(password)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return successResponse(
      {},
      'Password reset successful. You can now login with your new password'
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return errorResponse('Password reset failed', 500)
  }
}
