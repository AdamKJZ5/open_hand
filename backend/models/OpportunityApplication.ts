import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunityApplication extends Document {
  opportunity: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;

  // Application details
  message: string;
  availability: string;
  experience?: string;

  // Status tracking
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';

  // Admin review
  adminNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OpportunityApplicationSchema: Schema = new Schema(
  {
    opportunity: {
      type: Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: [true, 'Opportunity is required']
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant is required']
    },

    // Application details
    message: {
      type: String,
      required: [true, 'Application message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      trim: true
    },
    experience: {
      type: String,
      trim: true
    },

    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    },

    // Admin review
    adminNotes: {
      type: String,
      trim: true
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate applications
OpportunityApplicationSchema.index({ opportunity: 1, applicant: 1 }, { unique: true });

export default mongoose.model<IOpportunityApplication>('OpportunityApplication', OpportunityApplicationSchema);
