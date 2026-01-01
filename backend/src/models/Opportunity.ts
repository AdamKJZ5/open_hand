import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  status: 'open' | 'completed';
  organizer: mongoose.Types.ObjectId;
}

const OpportunitySchema: Schema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Please add a title'] 
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'] 
  },
  location: { 
    type: String, 
    required: [true, 'Please add a location'] 
  },
  date: { 
    type: String, 
    required: [true, 'Please add a date'] 
  },
  category: {
    type: String,
    enum: ['Food', 'Education', 'Environment', 'Health', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['open', 'completed'],
    default: 'open'
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true // This automatically creates 'createdAt' and 'updatedAt' fields
});

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
