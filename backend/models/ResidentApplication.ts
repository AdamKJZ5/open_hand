import mongoose, { Schema, Document } from 'mongoose';

export interface IResidentApplication extends Document {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  // Contact Information
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };

  // Medical Information
  medicalHistory?: string;
  medications?: string;
  allergies?: string;
  mobilityLevel: 'independent' | 'assisted' | 'wheelchair' | 'bedridden';
  specialNeeds?: string;

  // Care Requirements
  careLevel: 'basic' | 'intermediate' | 'advanced' | 'memory_care';
  preferredMoveInDate: Date;
  roomPreference?: 'private' | 'shared' | 'no_preference';

  // Financial Information
  paymentMethod: 'private' | 'medicare' | 'medicaid' | 'insurance' | 'other';
  hasInsurance: boolean;
  insuranceProvider?: string;

  // Additional Information
  interests?: string;
  additionalNotes?: string;

  // Application Status
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'waitlisted';
  submittedBy?: mongoose.Types.ObjectId; // Reference to User if logged in

  // Admin Notes
  adminNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId; // Reference to Admin User
  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ResidentApplicationSchema: Schema = new Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      required: [true, 'Gender is required']
    },

    // Contact Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipCode: {
        type: String,
        required: [true, 'ZIP code is required']
      }
    },

    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required']
      },
      relationship: {
        type: String,
        required: [true, 'Relationship is required']
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required']
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },

    // Medical Information
    medicalHistory: {
      type: String,
      trim: true
    },
    medications: {
      type: String,
      trim: true
    },
    allergies: {
      type: String,
      trim: true
    },
    mobilityLevel: {
      type: String,
      enum: ['independent', 'assisted', 'wheelchair', 'bedridden'],
      required: [true, 'Mobility level is required']
    },
    specialNeeds: {
      type: String,
      trim: true
    },

    // Care Requirements
    careLevel: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'memory_care'],
      required: [true, 'Care level is required']
    },
    preferredMoveInDate: {
      type: Date,
      required: [true, 'Preferred move-in date is required']
    },
    roomPreference: {
      type: String,
      enum: ['private', 'shared', 'no_preference'],
      default: 'no_preference'
    },

    // Financial Information
    paymentMethod: {
      type: String,
      enum: ['private', 'medicare', 'medicaid', 'insurance', 'other'],
      required: [true, 'Payment method is required']
    },
    hasInsurance: {
      type: Boolean,
      default: false
    },
    insuranceProvider: {
      type: String,
      trim: true
    },

    // Additional Information
    interests: {
      type: String,
      trim: true
    },
    additionalNotes: {
      type: String,
      trim: true
    },

    // Application Status
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'waitlisted'],
      default: 'pending'
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

    // Admin Notes
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

export default mongoose.model<IResidentApplication>('ResidentApplication', ResidentApplicationSchema);
