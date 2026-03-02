import { Schema, model, Document } from 'mongoose';

interface IShift {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  assignedRooms: string[];
  isRecurring: boolean;
  specificDate?: Date;
}

export interface ICaretakerSchedule extends Document {
  caretakerId: Schema.Types.ObjectId;
  shifts: IShift[];
  weeklyHours: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  notes?: string;
  createdBy: Schema.Types.ObjectId;
  lastModifiedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const shiftSchema = new Schema<IShift>({
  dayOfWeek: {
    type: Number,
    required: function(this: IShift) {
      return this.isRecurring && !this.specificDate;
    },
    min: [0, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
    max: [6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)']
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
  assignedRooms: {
    type: [String],
    default: []
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  specificDate: {
    type: Date,
    required: false
  }
}, { _id: false });

const caretakerScheduleSchema = new Schema<ICaretakerSchedule>({
  caretakerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Caretaker ID is required']
  },
  shifts: {
    type: [shiftSchema],
    required: [true, 'At least one shift is required'],
    validate: {
      validator: function(shifts: IShift[]) {
        return shifts && shifts.length > 0;
      },
      message: 'At least one shift is required'
    }
  },
  weeklyHours: {
    type: Number,
    default: 0
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

// Calculate weekly hours before saving
caretakerScheduleSchema.pre('save', function() {
  if (this.shifts && this.shifts.length > 0) {
    let totalHours = 0;

    this.shifts.forEach(shift => {
      if (shift.isRecurring) {
        const [startHour, startMin] = shift.startTime.split(':').map(Number);
        const [endHour, endMin] = shift.endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        const shiftHours = (endMinutes - startMinutes) / 60;
        totalHours += shiftHours;
      }
    });

    this.weeklyHours = totalHours;
  }
});

// Index for efficient caretaker queries
caretakerScheduleSchema.index({ caretakerId: 1, effectiveFrom: 1 });

// Ensure only one active schedule per caretaker
caretakerScheduleSchema.index({ caretakerId: 1, effectiveFrom: 1, effectiveTo: 1 });

export const CaretakerSchedule = model<ICaretakerSchedule>('CaretakerSchedule', caretakerScheduleSchema);
