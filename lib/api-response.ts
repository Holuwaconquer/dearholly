import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  statusCode: number
}

export const successResponse = <T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      statusCode,
    },
    { status: statusCode }
  )
}

export const errorResponse = (
  message: string = 'An error occurred',
  statusCode: number = 500
): NextResponse<ApiResponse> => {
  return NextResponse.json(
    {
      success: false,
      message,
      statusCode,
    },
    { status: statusCode }
  )
}

export const notFoundResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Resource not found', 404)
}

export const unauthorizedResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Unauthorized', 401)
}

export const forbiddenResponse = (): NextResponse<ApiResponse> => {
  return errorResponse('Forbidden', 403)
}

export const badRequestResponse = (message: string = 'Bad request'): NextResponse<ApiResponse> => {
  return errorResponse(message, 400)
}

export const validationErrorResponse = (errors: any): NextResponse<ApiResponse> => {
  return NextResponse.json(
    {
      success: false,
      message: 'Validation error',
      data: errors,
      statusCode: 422,
    },
    { status: 422 }
  )
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
