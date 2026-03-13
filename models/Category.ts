import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  image?: string
  status: 'active' | 'inactive'
  parent?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      default: function(this: any) {
        return this.name ? this.name.toLowerCase().trim().replace(/\s+/g, '-') : undefined
      }
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)
