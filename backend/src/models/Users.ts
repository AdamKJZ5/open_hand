import { Schema, model } from 'mongose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'caretaker' | 'family';
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
    enum: ['admin', 'caretaker', 'family'],
    default: 'family'
  },
  createdAt: {
    type: Data,
    default: Date.now
  }
});

export const User = model<IUser>('User', userSchema);
