import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'
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

    const { amount } = await request.json()

    // Validation
    if (!amount || amount <= 0) {
      return badRequestResponse('Please provide a valid amount')
    }

    if (amount < 1000) {
      return badRequestResponse('Minimum deposit amount is ₦1,000')
    }

    // Get user
    const user = await User.findById(decoded.userId)
    if (!user) {
      return badRequestResponse('User not found')
    }

    // Create a transaction record with pending status
    const reference = `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const transaction = await Transaction.create({
      userId: user._id,
      type: 'deposit',
      amount,
      status: 'pending',
      description: `Wallet deposit of ₦${amount.toLocaleString('en-NG')}`,
      reference,
    })

    // Initialize Korapay transaction
    try {
      const korapayResponse = await axios.post(
        'https://api.korapay.com/merchant/api/v1/charges/initialize',
        {
          amount: Math.round(amount * 100), // Convert to kobo
          currency: 'NGN',
          reference,
          customer: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone || '',
          },
          metadata: {
            userId: user._id.toString(),
            transactionId: transaction._id.toString(),
            type: 'wallet_deposit',
          },
          notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`,
          channels: ['card', 'bank_transfer'],
          default_channel: 'card',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (korapayResponse.data.status === 'success') {
        transaction.korapayReference = korapayResponse.data.data.reference
        await transaction.save()

        return successResponse(
          {
            transaction: {
              id: transaction._id,
              reference,
              amount,
              status: 'pending',
            },
            payment: korapayResponse.data.data,
          },
          'Deposit initialized',
          201
        )
      } else {
        return errorResponse('Failed to initialize payment', 500)
      }
    } catch (korapayError: any) {
      console.error('Korapay error:', korapayError)
      transaction.status = 'failed'
      await transaction.save()

      return errorResponse(
        korapayError.response?.data?.message || 'Failed to initialize payment',
        500
      )
    }
  } catch (error) {
    console.error('Deposit error:', error)
    return errorResponse('Deposit failed', 500)
  }
}
