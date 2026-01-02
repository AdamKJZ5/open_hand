import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  serviceNeeded: { 
    type: String, 
    enum: ['Home Care', 'Companion Ship', 'Nursing', 'Other'], 
    default: 'Home Care' 
  },
  message: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' }
}, { timestamps: true });

export const Lead = mongoose.model('Lead', leadSchema);
