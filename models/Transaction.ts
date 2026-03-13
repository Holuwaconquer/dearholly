import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ITransaction extends Document {
  userId: Types.ObjectId
  type: 'deposit' | 'withdrawal' | 'order'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  description: string
  reference?: string
  korapayReference?: string
  relatedOrderId?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'order'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      unique: true,
      sparse: true,
    },
    korapayReference: {
      type: String,
      default: null,
    },
    relatedOrderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema)
