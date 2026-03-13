import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRY,
  } as any)
}

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export const generatePasswordResetToken = (): {
  token: string
  hashedToken: string
  expiresAt: Date
} => {
  const resetToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  const expiresAt = new Date(Date.now() + 3600000) // 1 hour

  return {
    token: resetToken,
    hashedToken,
    expiresAt,
  }
}

export const verifyPasswordResetToken = (
  token: string
): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
