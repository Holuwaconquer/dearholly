# DearHolly Backend Integration Guide

## Overview

Your DearHolly e-commerce application now has a complete production-ready backend integrated with Next.js API routes, MongoDB, and Korapay payment processing. This guide covers setup, features, and API documentation.

## 🚀 Quick Start

### 1. Environment Setup

Update your `.env.local` file with the following credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dearholly?retryWrites=true&w=majority

# SendGrid Configuration (Get from https://sendgrid.com)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@dearholly.com

# Korapay Configuration (Get from https://korapay.com)
KORAPAY_PUBLIC_KEY=your_korapay_public_key
KORAPAY_SECRET_KEY=your_korapay_secret_key
KORAPAY_MERCHANT_NAME=DearHolly

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRY=7d

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_min_32_chars
NEXTAUTH_URL=http://localhost:3000

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DearHolly
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Run MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string and update `MONGODB_URI`

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Initial Products (Optional)
Create a script file `scripts/seed.ts` to populate your database with products:

```typescript
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

const products = [
  {
    name: 'Red Velvet Hoodie',
    description: 'Premium quality red velvet hoodie from our signature series',
    price: 45000,
    category: 'Signature Series',
    image: 'https://...',
    badge: 'Limited',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red', 'Black'],
    stock: 50,
  },
  // ... more products
]

async function seed() {
  await dbConnect()
  await Product.insertMany(products)
  console.log('Products seeded successfully')
}

seed()
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to view your application.

---

## 📋 Features Implemented

### ✅ Authentication System
- **User Registration**: Email-based signup with password hashing
- **User Login**: JWT-based authentication
- **Password Reset**: Forgot password flow with email verification
- **Profile Management**: Update user information
- **Role-based Access**: Admin and user roles

### ✅ Products Management
- **Public Product Listing**: Browse all active products
- **Product Filtering**: Filter by category
- **Pagination**: 12 products per page
- **Product Details**: Individual product information
- **Admin CRUD**: Create, read, update, delete products

### ✅ Shopping Cart
- **Client-side Cart**: Stored in localStorage
- **Add to Cart**: With size and color selection
- **Persistent Cart**: Saved across sessions
- **Cart Management**: Remove/update items via UI

### ✅ Orders & Checkout
- **Create Orders**: From cart with shipping details
- **Order History**: View all user orders
- **Order Tracking**: Status updates (pending, processing, shipped, delivered)
- **Order Details**: Complete order information retrieval

### ✅ Payment System
- **Wallet Balance**: User account wallet
- **Deposit Funds**: Via Korapay payment gateway
- **Multiple Payment Methods**: Card and bank transfer
- **Payment Verification**: Webhook integration with Korapay
- **Order Payment**: Direct wallet or Korapay payment for orders

### ✅ Admin Dashboard (API-ready)
- **User Management**: View and manage users
- **Wallet Adjustment**: Add/deduct funds from user wallets
- **Order Management**: View and update order status
- **Product Management**: Full CRUD operations
- **Admin Access**: Protected routes with role verification

### ✅ Email Notifications
- **Welcome Email**: On user registration
- **Order Confirmation**: When order is placed
- **Password Reset**: Reset link delivery via email

---

## 🔐 Authentication Flow

### Login
```
POST /api/auth/login
Request: { email, password }
Response: { token, user }
```

Store the token in localStorage and send it in the `Authorization` header for protected requests:
```
Authorization: Bearer <token>
```

### Protected Routes
All endpoints requiring authentication check for the JWT token:
```typescript
const token = request.headers.get('authorization')?.split(' ')[1]
```

---

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET/PUT /api/auth/profile` - Get/Update profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Products (Public)
- `GET /api/products` - List all products (with pagination)
- `GET /api/products/[id]` - Get single product

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order notes

### Payments (Protected)
- `POST /api/payments/deposit` - Initiate wallet deposit
- `POST /api/payments/verify` - Webhook for payment verification

### Admin (Protected)
- `GET /api/admin/products` - List all products (admin view)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/[id]` - Update order status
- `GET /api/admin/users` - List all users
- `GET/PUT /api/admin/users/[id]` - Get/Update user

---

## 💰 Payment Integration (Korapay)

### Deposit Flow
1. User initiates deposit from wallet page
2. App creates transaction record with `pending` status
3. Korapay initializes payment and returns payment link
4. User completes payment on Korapay
5. Webhook notifies app of payment completion
6. App updates transaction and user wallet balance

### Order Payment Flow
1. User places order with wallet or Korapay as payment method
2. If wallet: Deduct immediately and mark order as paid
3. If Korapay: Order status remains `pending` until payment verified
4. After payment: Update order status and reduce product stock

### Example Deposit Request
```javascript
const response = await fetch('/api/payments/deposit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ amount: 50000 }) // 50,000 Naira
})
```

---

## 🛍️ Shopping Flow

### 1. Browse Products
```javascript
// Products page automatically fetches from /api/products
// Client-side filtering and sorting available
```

### 2. Add to Cart
```javascript
// ShopClient component handles cart management
// Stored in localStorage
localStorage.setItem('cart', JSON.stringify(cartItems))
```

### 3. Create Order
```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [
      {
        productId: '...',
        quantity: 1,
        size: 'M',
        color: 'Black'
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+234...',
      address: '123 Main St',
      city: 'Lagos',
      state: 'Lagos',
      postalCode: '100001',
      country: 'Nigeria'
    },
    paymentMethod: 'wallet' // or 'korapay'
  })
})
```

---

## 🔧 Database Schema

### User Model
```
├── firstName (String)
├── lastName (String)
├── email (String) - unique
├── password (String) - hashed
├── phone (String)
├── address, city, state, postalCode, country (Address)
├── role (enum: 'user', 'admin')
├── walletBalance (Number)
├── isVerified (Boolean)
├── passwordResetToken (String) - hashed
├── passwordResetExpires (Date)
├── createdAt, updatedAt (Timestamps)
```

### Product Model
```
├── name (String)
├── description (String)
├── price (Number) - in Naira
├── category (enum: 'Signature Series', 'Essential', 'Premium', 'Limited Edition')
├── image (String) - URL
├── badge (enum: 'New', 'Limited', 'Sale', 'Popular')
├── sizes (Array[String])
├── colors (Array[String])
├── stock (Number)
├── rating, reviews (Number)
├── isActive (Boolean)
├── createdAt, updatedAt (Timestamps)
```

### Order Model
```
├── userId (ObjectId) - ref User
├── items (Array)
│   ├── productId (ObjectId)
│   ├── productName (String)
│   ├── price (Number)
│   ├── quantity (Number)
│   ├── size, color (String)
├── totalPrice, totalQuantity (Number)
├── status (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
├── paymentStatus (enum: 'pending', 'completed', 'failed')
├── paymentMethod (enum: 'wallet', 'korapay')
├── korapayReference (String)
├── shippingAddress (Object)
├── createdAt, updatedAt (Timestamps)
```

### Transaction Model
```
├── userId (ObjectId)
├── type (enum: 'deposit', 'withdrawal', 'order')
├── amount (Number)
├── status (enum: 'pending', 'completed', 'failed')
├── description (String)
├── reference (String) - unique transaction ID
├── korapayReference (String)
├── relatedOrderId (ObjectId)
├── createdAt, updatedAt (Timestamps)
```

---

## 🚨 Error Handling

All API responses follow this format:

**Success (200)**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "statusCode": 200
}
```

**Error (4xx/5xx)**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## 🔐 Security Best Practices

✅ **Password Hashing**: bcryptjs with 10 salt rounds
✅ **JWT Tokens**: Signed with secret key, 7-day expiry
✅ **Environment Variables**: Sensitive data in `.env.local`
✅ **Email Verification**: Reset tokens expire in 1 hour
✅ **Admin Verification**: Role-based access control
✅ **CORS Headers**: Configured for same-origin requests
✅ **Input Validation**: Zod schema with custom validators

---

## 📱 Frontend Integration

### Authentication Context
```typescript
import { useAuth } from '@/context/AuthContext'

export default function Component() {
  const { user, token, loading, login, register, logout } = useAuth()
  
  // useAuth provides auth state and methods
}
```

### Making API Calls
```typescript
// Protected request with token
const response = await fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy with `npm run build` && `npm start`

### Environment Variables on Vercel
- Add all `.env.local` variables to Vercel dashboard
- Use `NEXT_PUBLIC_` prefix for client-side env vars only

### Database for Production
- Use MongoDB Atlas for cloud database
- Enable IP whitelist for security
- Set up automated backups

---

## 📝 Next Steps

1. **Create Cart Page** - Display and manage shopping cart
2. **Create Checkout Page** - Final order review and payment
3. **Create User Dashboard** - View orders, wallet, profile
4. **Create Admin Dashboard** - Manage products, orders, users
5. **Forgot Password Page** - Reset password flow
6. **Email Templates** - Customize email notifications
7. **Payment Webhooks** - Ensure Korapay webhook is configured
8. **Testing** - Test all flows in development

---

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Korapay Documentation](https://developer.korapay.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

## ✨ Production Checklist

- [ ] Update all environment variables
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure SendGrid API key
- [ ] Setup Korapay merchant account
- [ ] Test all authentication flows
- [ ] Test payment processing
- [ ] Test email notifications
- [ ] Setup error logging (Sentry, LogRocket)
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Setup monitoring and alerts
- [ ] Create admin user account

---

**Developed with ❤️ for DearHolly**
Production-ready backend integration complete!
