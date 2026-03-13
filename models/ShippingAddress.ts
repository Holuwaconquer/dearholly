import mongoose, { Schema, Document } from 'mongoose'

export interface IShippingAddress extends Document {
  userId: mongoose.Types.ObjectId
  type: string // e.g., 'Home', 'Office', 'Work'
  recipient: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    recipient: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      default: 'Nigeria',
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Ensure only one default address per user
shippingAddressSchema.pre('save', async function (this: IShippingAddress) {
  if (this.isDefault) {
    await mongoose.model('ShippingAddress').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    )
  }
  // no need to call next() in async middleware
})

export default mongoose.models.ShippingAddress || mongoose.model<IShippingAddress>('ShippingAddress', shippingAddressSchema)