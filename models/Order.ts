import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IOrderItem {
  productId: Types.ObjectId
  productName: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface IOrder extends Document {
  userId: Types.ObjectId
  items: IOrderItem[]
  totalPrice: number
  totalQuantity: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentMethod: 'korapay' | 'manual'
  korapayReference?: string
  paymentProof?: string
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    required: false,
    default: ''
  },
  color: {
    type: String,
    required: false,
    default: ''
  },
})

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [function(v: any[]) { return v.length > 0 }, 'Order must contain at least one item'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['korapay', 'manual'],
      required: true,
    },
    korapayReference: {
      type: String,
      default: null,
    },
    paymentProof: {
      type: String,
      default: null,
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: false,
        default: '',
      },
      phone: {
        type: String,
        required: false,
        default: '',
      },
      address: {
        type: String,
        required: false,
        default: '',
      },
      city: {
        type: String,
        required: false,
        default: '',
      },
      state: {
        type: String,
        required: false,
        default: '',
      },
      postalCode: {
        type: String,
        required: false,
        default: '',
      },
      country: {
        type: String,
        default: 'Nigeria',
      },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)
