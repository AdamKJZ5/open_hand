import { Schema, model, Document, Types } from 'mongoose';

export interface IJobApplication extends Document {
  jobPosting: Types.ObjectId;
  applicant: Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  experience: string;
  availability: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>({
  jobPosting: {
    type: Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  availability: {
    type: String,
    required: [true, 'Availability is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
jobApplicationSchema.index({ jobPosting: 1, applicant: 1 }, { unique: true });

export const JobApplication = model<IJobApplication>('JobApplication', jobApplicationSchema);
