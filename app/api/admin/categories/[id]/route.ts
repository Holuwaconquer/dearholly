import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
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
    if (!token) return unauthorizedResponse()
    const decoded = verifyToken(token)
    if (!decoded) return unauthorizedResponse()
    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) return forbiddenResponse()

    const category = await Category.findById(id)
    if (!category) return notFoundResponse()

    const { name, description, status, parent } = await request.json()
    if (name) {
      category.name = name
      category.slug = name.toLowerCase().trim().replace(/\s+/g, '-')
    }
    if (description !== undefined) category.description = description
    if (status && ['active', 'inactive'].includes(status)) category.status = status
    if (parent !== undefined) category.parent = parent

    await category.save()
    return successResponse(category, 'Category updated successfully')
  } catch (error) {
    console.error('Update category error:', error)
    return errorResponse('Failed to update category', 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) return unauthorizedResponse()
    const decoded = verifyToken(token)
    if (!decoded) return unauthorizedResponse()
    const isAdmin = await checkAdmin(decoded.userId)
    if (!isAdmin) return forbiddenResponse()

    const category = await Category.findByIdAndDelete(id)
    if (!category) return notFoundResponse()

    return successResponse({}, 'Category deleted successfully')
  } catch (error) {
    console.error('Delete category error:', error)
    return errorResponse('Failed to delete category', 500)
  }
}
