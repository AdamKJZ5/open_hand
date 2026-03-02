import { Schema, model, Document } from 'mongoose';

interface IScheduleItem {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  activityType: 'meal' | 'activity' | 'medication' | 'therapy' | 'personal_care' | 'other';
  dayOfWeek: number;
  isRecurring: boolean;
  specificDate?: Date;
  icon?: string;
}

export interface IResidentSchedule extends Document {
  residentId: Schema.Types.ObjectId;
  scheduleItems: IScheduleItem[];
  assignedCaretaker?: Schema.Types.ObjectId;
  effectiveFrom: Date;
  effectiveTo?: Date;
  notes?: string;
  createdBy: Schema.Types.ObjectId;
  lastModifiedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleItemSchema = new Schema<IScheduleItem>({
  title: {
    type: String,
    required: [true, 'Schedule item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  activityType: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: {
      values: ['meal', 'activity', 'medication', 'therapy', 'personal_care', 'other'],
      message: '{VALUE} is not a valid activity type'
    }
  },
  dayOfWeek: {
    type: Number,
    required: function(this: IScheduleItem) {
      return this.isRecurring && !this.specificDate;
    },
    min: [0, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
    max: [6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)']
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  specificDate: {
    type: Date,
    required: false
  },
  icon: {
    type: String,
    maxlength: [10, 'Icon cannot exceed 10 characters']
  }
}, { _id: false });

const residentScheduleSchema = new Schema<IResidentSchedule>({
  residentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Resident ID is required']
  },
  scheduleItems: {
    type: [scheduleItemSchema],
    required: [true, 'At least one schedule item is required'],
    validate: {
      validator: function(items: IScheduleItem[]) {
        return items && items.length > 0;
      },
      message: 'At least one schedule item is required'
    }
  },
  assignedCaretaker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  effectiveFrom: {
    type: Date,
    required: [true, 'Effective from date is required'],
    default: Date.now
  },
  effectiveTo: {
    type: Date,
    required: false
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Last modified by user is required']
  }
}, {
  timestamps: true
});

// Index for efficient resident queries
residentScheduleSchema.index({ residentId: 1 });

// Index for caretaker assignment queries
residentScheduleSchema.index({ assignedCaretaker: 1 });

export const ResidentSchedule = model<IResidentSchedule>('ResidentSchedule', residentScheduleSchema);
