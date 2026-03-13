import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response'
import axios from 'axios'

export async function POST(request: NextRequest) {
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

    const { orderId, amount, email } = await request.json()

    if (!orderId || !amount || !email) {
      return badRequestResponse('orderId, amount, and email are required')
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId)

    if (!order) {
      return notFoundResponse()
    }

    if (order.userId.toString() !== decoded.userId) {
      return badRequestResponse('Order does not belong to this user')
    }

    // Initiate payment with Korapay
    try {
      const korapayPayload = {
        amount: Math.round(amount * 100), // Convert to kobo
        currency: 'NGN',
        reference: `order_${orderId}_${Date.now()}`,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
        merchant_name: 'DearHolly',
        customer: {
          name: `${order.shippingAddress.fullName}`,
          email: email,
        },
        metadata: {
          orderId: orderId.toString(),
          userId: decoded.userId,
        },
      }

      const korapayResponse = await axios.post(
        'https://api.korapay.com/merchant/api/v1/charges',
        korapayPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const paymentData = korapayResponse.data.data

      if (paymentData.checkout_url) {
        return successResponse(
          {
            checkoutURL: paymentData.checkout_url,
            reference: paymentData.reference,
          },
          'Payment initiated successfully'
        )
      } else {
        return errorResponse('Failed to get checkout URL from Korapay', 500)
      }
    } catch (korapayError: any) {
      console.error('Korapay error:', korapayError.response?.data || korapayError.message)
      return errorResponse(
        'Failed to initiate payment with Korapay',
        500
      )
    }
  } catch (error) {
    console.error('Initiate payment error:', error)
    return errorResponse('Failed to initiate payment', 500)
  }
}
