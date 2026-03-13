# API Testing Guide

This guide helps you test all API endpoints locally using cURL or Postman.

## Base URL
```
http://localhost:3000/api
```

## Headers (for protected routes)
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user data */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Save the `token` from the response for subsequent requests.

### 3. Get User Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

### 4. Update User Profile
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "phone": "+2348012345678",
    "address": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001"
  }'
```

### 5. Request Password Reset
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### 6. Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<reset_token_from_email>",
    "password": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'
```

---

## Products Endpoints (Public)

### 1. Get All Products
```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=12&category=all" \
  -H "Content-Type: application/json"
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category: 'all', 'Signature Series', 'Essential', 'Premium'
- `sort` - Sort by field (e.g., '-createdAt', 'price')

### 2. Get Single Product
```bash
curl -X GET http://localhost:3000/api/products/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Content-Type: application/json"
```

---

## Orders Endpoints (Protected)

### 1. Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "653f7a1b2c3d4e5f6g7h8i9j",
        "quantity": 2,
        "size": "M",
        "color": "Black"
      }
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "+2348012345678",
      "address": "123 Main Street",
      "city": "Lagos",
      "state": "Lagos",
      "postalCode": "100001",
      "country": "Nigeria"
    },
    "paymentMethod": "wallet",
    "notes": "Please deliver on weekday"
  }'
```

Payment Methods:
- `wallet` - Deduct from wallet balance
- `korapay` - Initialize Korapay payment

### 2. Get User Orders
```bash
curl -X GET "http://localhost:3000/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

### 3. Get Order Details
```bash
curl -X GET http://localhost:3000/api/orders/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

### 4. Update Order
```bash
curl -X PUT http://localhost:3000/api/orders/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated shipping note"
  }'
```

---

## Payment Endpoints (Protected)

### 1. Initiate Wallet Deposit
```bash
curl -X POST http://localhost:3000/api/payments/deposit \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000
  }'
```

Response includes payment link from Korapay that user must open.

### 2. Verify Payment (Webhook)
This is called automatically by Korapay after payment:
```bash
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "DEP-1701234567890-ABC123",
    "status": "success",
    "amount": 5000000
  }'
```

---

## Admin Endpoints (Protected, Admin Only)

### 1. Get All Products (Admin View)
```bash
curl -X GET "http://localhost:3000/api/admin/products?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### 2. Create Product
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Jacket",
    "description": "High-quality premium leather jacket",
    "price": 150000,
    "category": "Premium",
    "image": "https://...",
    "badge": "New",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Black", "Brown"],
    "stock": 50
  }'
```

### 3. Update Product
```bash
curl -X PUT http://localhost:3000/api/admin/products/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 160000,
    "stock": 45,
    "badge": "Sale"
  }'
```

### 4. Delete Product
```bash
curl -X DELETE http://localhost:3000/api/admin/products/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### 5. Get All Orders (Admin View)
```bash
curl -X GET "http://localhost:3000/api/admin/orders?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

Status Filter: 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'

### 6. Update Order Status
```bash
curl -X PUT http://localhost:3000/api/admin/orders/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "paymentStatus": "completed"
  }'
```

### 7. Get All Users
```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=10&role=user" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### 8. Get User Details
```bash
curl -X GET http://localhost:3000/api/admin/users/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### 9. Update User (Admin)
```bash
curl -X PUT http://localhost:3000/api/admin/users/653f7a1b2c3d4e5f6g7h8i9j \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "walletAdjustment": 100000,
    "walletAdjustmentReason": "Bonus credit"
  }'
```

---

## Error Responses

### Invalid Request
```json
{
  "success": false,
  "message": "Please provide all required fields",
  "statusCode": 400
}
```

### Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - No token provided",
  "statusCode": 401
}
```

### Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### Server Error
```json
{
  "success": false,
  "message": "Server error message",
  "statusCode": 500
}
```

---

## Testing Workflow

### 1. Complete User Registration & Login Flow
```bash
# Step 1: Register
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Test1234","confirmPassword":"Test1234"}' | jq -r '.data.token')

# Step 2: Use token for subsequent requests
echo "Token: $TOKEN"

# Step 3: Get profile
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 2. Complete Shopping Flow
```bash
# Step 1: Get products
curl http://localhost:3000/api/products

# Step 2: Create order with wallet payment
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ /* order data */ }'

# Step 3: Check order
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

---

## Using Postman

1. Create a new environment with variable `{{token}}`
2. In auth endpoints, Extract token from response and save to environment variable
3. Use `{{token}}` in Authorization header for subsequent requests
4. Import endpoints as Postman collection for easy testing

---

Good luck testing your API! 🚀
