import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { verifyToken } from '@/lib/auth'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // filter by 'deposit', 'withdrawal', 'order'

    const skip = (page - 1) * limit
    const filter: any = { userId: decoded.userId }

    if (type && ['deposit', 'withdrawal', 'order'].includes(type)) {
      filter.type = type
    }

    const transactions = await Transaction.find(filter)
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Transaction.countDocuments(filter)

    // Format transactions for display
    const formattedTransactions = transactions.map((tx: any) => ({
      id: tx._id.toString(),
      date: new Date(tx.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      description: tx.description,
      amount: tx.type === 'deposit' || tx.type === 'withdrawal' ? tx.amount : -tx.amount,
      status: tx.status,
      type: tx.type,
      reference: tx.reference,
    }))

    return successResponse({
      transactions: formattedTransactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return errorResponse('Failed to get transactions', 500)
  }
}
