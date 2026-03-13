import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  cost?: number
  category: mongoose.Types.ObjectId
  images: string[]
  colors: string[]
  variants: any[]
  sku?: string
  barcode?: string
  quantity: number
  weight?: number
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviews: number
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    cost: {
      type: Number,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide product category'],
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    variants: [{
      size: String,
      price: Number,
      stock: Number
    }],
    sku: {
      type: String,
    },
    barcode: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
)

// generate slug before saving
;(productSchema as any).pre('validate', function (this: any, next: (err?: any) => void) {
  if (this.isModified('name') || !this.slug) {
    const base = this.name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    // append short unique suffix to avoid collisions
    this.slug = `${base}-${Date.now().toString(36)}`
  }
  next()
})

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)
