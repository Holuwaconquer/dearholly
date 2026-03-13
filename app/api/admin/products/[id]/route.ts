import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { successResponse, badRequestResponse, errorResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse } from '@/lib/api-response'

// Check if user is admin
const checkAdmin = async (userId: string) => {
  const user = await User.findById(userId)
  return user?.role === 'admin'
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params

    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) {
      return forbiddenResponse()
    }

    const product = await Product.findById(id)

    if (!product) {
      return notFoundResponse()
    }

    const { name, description, price, category, image, badge, sizes, colors, stock, isActive } =
      await request.json()

    if (name) product.name = name
    if (description) product.description = description
    if (price !== undefined) {
      if (price <= 0) return badRequestResponse('Price must be greater than 0')
      product.price = price
    }
    if (category) {
      // category should be an existing category id
      const Category = (await import('@/models/Category')).default
      const cat = await Category.findById(category)
      if (!cat) return badRequestResponse('Invalid category')
      product.category = category
    }
    if (image) product.image = image
    if (badge !== undefined) product.badge = badge
    if (sizes) product.sizes = sizes
    if (colors) product.colors = colors
    if (stock !== undefined) product.stock = stock
    if (isActive !== undefined) product.isActive = isActive

    await product.save()

    return successResponse(product, 'Product updated successfully')
  } catch (error) {
    console.error('Update product error:', error)
    return errorResponse('Failed to update product', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params

    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return unauthorizedResponse()
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return unauthorizedResponse()
    }

    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) {
      return forbiddenResponse()
    }

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return notFoundResponse()
    }

    return successResponse({}, 'Product deleted successfully')
  } catch (error) {
    console.error('Delete product error:', error)
    return errorResponse('Failed to delete product', 500)
  }
}
