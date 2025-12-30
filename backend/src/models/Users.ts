import { Schema, model } from 'mongose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: {
    type: String,
    emu: ['admin', 'caretaker', 'family'],
    default: 'family'	
},
  createdAt: {type: Data,default: Date.now}
});

export const User = model('User', userSchema);
