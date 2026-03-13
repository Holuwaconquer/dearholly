import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlistItem extends Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  productName: string
  productImage: string
  productPrice: number
  productCategory: string
  inStock: boolean
  addedAt: Date
}

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productCategory: {
      type: String,
      required: true,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: 'addedAt', updatedAt: false } }
)

// Ensure no duplicate products in wishlist for the same user
wishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true })

export default mongoose.models.WishlistItem || mongoose.model<IWishlistItem>('WishlistItem', wishlistItemSchema)