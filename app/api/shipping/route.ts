import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ShippingAddress from '@/models/ShippingAddress'
import { verifyToken } from '@/lib/auth'
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api-response'

// GET /api/shipping - Get user's shipping addresses
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    await dbConnect()
    const addresses = await ShippingAddress.find({ userId: decoded.userId }).sort({ isDefault: -1, createdAt: -1 })

    return successResponse(addresses)
  } catch (error) {
    console.error('Get shipping addresses error:', error)
    return errorResponse('Failed to get shipping addresses', 500)
  }
}

// POST /api/shipping - Add new shipping address
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { type, recipient, address, city, state, zip, country, phone, isDefault } = body

    if (!type || !recipient || !address || !city || !state || !phone) {
      return errorResponse('Missing required fields', 400)
    }

    await dbConnect()
    const newAddress = new ShippingAddress({
      userId: decoded.userId,
      type,
      recipient,
      address,
      city,
      state,
      zip,
      country: country || 'Nigeria',
      phone,
      isDefault: isDefault || false,
    })

    await newAddress.save()
    return successResponse(newAddress, 'Shipping address added successfully', 201)
  } catch (error) {
    console.error('Add shipping address error:', error)
    return errorResponse('Failed to add shipping address', 500)
  }
}