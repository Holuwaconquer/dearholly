import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  role: 'user' | 'admin'
  status: 'active' | 'suspended'
  isVerified: boolean
  verified: Date | null
  passwordResetToken?: string
  passwordResetExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'Nigeria',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
