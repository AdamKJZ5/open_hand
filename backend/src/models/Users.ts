import { Schema, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'caretaker' | 'family' | 'default';
  phoneNumber?: string;
  hasSchedule?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'caretaker', 'family', 'default'],
    default: 'default'
  },
  phoneNumber: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string) {
        // Phone number is required for caretaker and family roles
        if ((this as any).role === 'caretaker' || (this as any).role === 'family') {
          return v && v.length > 0;
        }
        return true;
      },
      message: 'Phone number is required for caretaker and family roles'
    }
  },
  hasSchedule: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = model<IUser>('User', userSchema);
