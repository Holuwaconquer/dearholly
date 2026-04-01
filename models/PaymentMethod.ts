import mongoose, { Schema, Document } from 'mongoose'

export interface IPaymentMethod extends Document {
  method: string
  label: string
  details: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    method: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      default: 'Manual Bank Transfer',
    },
    details: {
      type: String,
      default: 'Transfer to account name DearHolly, account 0123456789 (Any Bank)',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.PaymentMethod || mongoose.model<IPaymentMethod>('PaymentMethod', paymentMethodSchema)
