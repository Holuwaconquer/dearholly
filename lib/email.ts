import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const msg = {
    from: process.env.SMTP_FROM_EMAIL || 'noreply@dearholly.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
  }

  try {
    await transporter.sendMail(msg)
  } catch (error) {
    console.error('Email Error:', error)
    throw error
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  firstName: string
): Promise<void> => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a4d2e;">DearHolly - Password Reset Request</h2>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <p style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
      <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
      <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #666; font-size: 12px;">© 2026 DearHolly. All rights reserved.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: 'DearHolly - Reset Your Password',
    html,
  })
}

export const sendWelcomeEmail = async (
  email: string,
  firstName: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a4d2e;">Welcome to DearHolly</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for registering with DearHolly! Your account has been successfully created.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our exclusive collection</li>
        <li>Add items to your cart</li>
        <li>Make purchases with our secure payment system</li>
        <li>Track your orders</li>
      </ul>
      <p style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background-color: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Start Shopping
        </a>
      </p>
      <p style="color: #666; font-size: 12px;">If you have any questions, please contact our support team.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #666; font-size: 12px;">© 2026 DearHolly. All rights reserved.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: 'Welcome to DearHolly',
    html,
  })
}

export const sendOrderConfirmationEmail = async (
  email: string,
  firstName: string,
  orderId: string,
  totalPrice: number,
  itemsCount: number
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a4d2e;">Order Confirmation</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for your purchase! Your order has been confirmed.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Items:</strong> ${itemsCount}</p>
        <p><strong>Total Amount:</strong> ₦${totalPrice.toLocaleString()}</p>
      </div>
      <p>You can track your order status in your dashboard.</p>
      <p style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders" style="background-color: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Order
        </a>
      </p>
      <p style="color: #666; font-size: 12px;">If you have any questions about your order, please contact our support team.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #666; font-size: 12px;">© 2026 DearHolly. All rights reserved.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: 'Order Confirmation - DearHolly',
    html,
  })
}
