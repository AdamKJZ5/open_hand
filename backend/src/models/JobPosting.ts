import { Schema, model, Document } from 'mongoose';

export interface IJobPosting extends Document {
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const jobPostingSchema = new Schema<IJobPosting>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    required: [true, 'Job type is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: {
    type: [String],
    required: true,
    default: []
  },
  responsibilities: {
    type: [String],
    required: true,
    default: []
  },
  salary: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const JobPosting = model<IJobPosting>('JobPosting', jobPostingSchema);
