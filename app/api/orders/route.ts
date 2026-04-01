import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import Product from '@/models/Product'
import Transaction from '@/models/Transaction'
import { verifyToken } from '@/lib/auth'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'

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

    const { items, shippingAddress, paymentMethod, notes, paymentProof } = await request.json()

    // Validation
    if (!items || items.length === 0) {
      return badRequestResponse('Order must contain at least one item')
    }

    if (!shippingAddress) {
      return badRequestResponse('Shipping address is required')
    }

    if (!paymentMethod || !['korapay', 'manual'].includes(paymentMethod)) {
      return badRequestResponse('Invalid payment method')
    }

    // Get user
    const user = await User.findById(decoded.userId)
    if (!user) {
      return badRequestResponse('User not found')
    }

    // Validate and get product prices
    let totalPrice = 0
    let totalQuantity = 0
    const validatedItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return badRequestResponse(`Product ${item.productId} not found`)
      }

      if (!product.isActive) {
        return badRequestResponse(`Product ${product.name} is no longer available`)
      }

      if (product.stock < item.quantity) {
        return badRequestResponse(`Insufficient stock for ${product.name}`)
      }

      totalPrice += product.price * item.quantity
      totalQuantity += item.quantity

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })
    }


    // Normalize shipping and item props to meet schema
    const shippingFullName = shippingAddress.fullName || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim()
    const normalizedShippingAddress = {
      ...shippingAddress,
      fullName: shippingFullName || shippingAddress.recipient || '',
      postalCode: shippingAddress.postalCode || shippingAddress.zip || '',
    }

    const validatedItemsWithFallback = validatedItems.map((item) => ({
      ...item,
      size: item.size || '',
      color: item.color || ''
    }))

    // Create order
    const order = await Order.create({
      userId: user._id,
      items: validatedItemsWithFallback,
      totalPrice,
      totalQuantity,
      status: 'pending',
      paymentStatus: paymentMethod === 'korapay' ? 'pending' : 'pending',
      paymentMethod,
      paymentProof: paymentProof || null,
      shippingAddress: normalizedShippingAddress,
    })

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.firstName,
        order._id.toString(),
        totalPrice,
        validatedItems.length
      )
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
    }

    return successResponse(
      {
        order: {
          id: order._id,
          orderId: order._id.toString(),
          totalPrice: order.totalPrice,
          totalQuantity: order.totalQuantity,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
        },
      },
      'Order created successfully',
      201
    );
  } catch (error) {
    console.error('Create order error:', error)
    return errorResponse('Failed to create order', 500)
  }
}

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

    const skip = (page - 1) * limit

    const orders = await Order.find({ userId: decoded.userId })
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)

    const total = await Order.countDocuments({ userId: decoded.userId })

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return errorResponse('Failed to get orders', 500)
  }
}
