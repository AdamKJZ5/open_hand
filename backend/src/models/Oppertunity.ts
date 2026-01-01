import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  title: string;
  description: string;
  location: string;
  date: string;
  organizer: mongoose.Types.ObjectId;
}

const OpportunitySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
