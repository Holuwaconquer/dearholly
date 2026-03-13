import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import { successResponse, errorResponse, badRequestResponse } from '@/lib/api-response'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { reference, status, amount } = body

    if (!reference) {
      return badRequestResponse('Reference is required')
    }

    // Find transaction
    const transaction = await Transaction.findOne({ reference })

    if (!transaction) {
      return badRequestResponse('Transaction not found')
    }

    // Verify with Korapay
    try {
      const korapayResponse = await axios.get(
        `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
          },
        }
      )

      const paymentData = korapayResponse.data.data

      if (paymentData.status === 'success') {
        // Update transaction status
        transaction.status = 'completed'
        await transaction.save()


        return successResponse(
          {
            transaction: {
              id: transaction._id,
              status: 'completed',
              amount: transaction.amount,
            },
          },
          'Payment verified successfully'
        )
      } else if (paymentData.status === 'failed') {
        transaction.status = 'failed'
        await transaction.save()

        return errorResponse('Payment failed', 400)
      } else {
        // Pending or other status
        return successResponse(
          {
            status: paymentData.status,
          },
          'Payment status updated'
        )
      }
    } catch (korapayError: any) {
      console.error('Korapay verification error:', korapayError)

      // Even if verification fails, we still return success to Korapay
      // to prevent retries. The transaction will be in pending status
      return successResponse(
        {
          status: 'verification_pending',
        },
        'Webhook received'
      )
    }
  } catch (error) {
    console.error('Verify payment error:', error)
    // Return success to Korapay to prevent retries
    return successResponse({}, 'Webhook received')
  }
}
