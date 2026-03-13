import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
}

export const authMiddleware = (handler: Function) => {
  return async (req: NextRequest, context: any) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1]

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized - No token provided',
            statusCode: 401,
          },
          { status: 401 }
        )
      }

      const decoded = verifyToken(token)

      if (!decoded) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized - Invalid token',
            statusCode: 401,
          },
          { status: 401 }
        )
      }

      // Attach user ID to request for use in handler
      const authenticatedReq = req as any
      authenticatedReq.userId = decoded.userId

      return handler(req, context)
    } catch (error) {
      console.error('Auth Middleware Error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication error',
          statusCode: 500,
        },
        { status: 500 }
      )
    }
  }
}

export const adminMiddleware = (handler: Function) => {
  return async (req: NextRequest, context: any) => {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1]

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized - No token provided',
            statusCode: 401,
          },
          { status: 401 }
        )
      }

      const decoded = verifyToken(token)

      if (!decoded) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized - Invalid token',
            statusCode: 401,
          },
          { status: 401 }
        )
      }

      // Check if user is admin (you'll need to fetch user from DB to check role)
      // For now, we just pass the token verification
      const authenticatedReq = req as any
      authenticatedReq.userId = decoded.userId

      return handler(req, context)
    } catch (error) {
      console.error('Admin Middleware Error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication error',
          statusCode: 500,
        },
        { status: 500 }
      )
    }
  }
}
