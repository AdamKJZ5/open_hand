import { Schema, model, Document } from 'mongoose';

export interface INotificationLog extends Document {
  userId: Schema.Types.ObjectId;
  type: 'email' | 'sms';
  category: 'message' | 'schedule_change' | 'application_status' | 'system';
  subject: string;
  content: string;
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  sentAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const notificationLogSchema = new Schema<INotificationLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: {
      values: ['email', 'sms'],
      message: '{VALUE} is not a valid notification type'
    }
  },
  category: {
    type: String,
    required: [true, 'Notification category is required'],
    enum: {
      values: ['message', 'schedule_change', 'application_status', 'system'],
      message: '{VALUE} is not a valid notification category'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  recipient: {
    type: String,
    required: [true, 'Recipient is required'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['pending', 'sent', 'failed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  error: {
    type: String,
    maxlength: [500, 'Error message cannot exceed 500 characters']
  },
  sentAt: {
    type: Date,
    required: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true
});

// Index for status queries (monitoring failed notifications)
notificationLogSchema.index({ status: 1, createdAt: -1 });

// Index for user notification history
notificationLogSchema.index({ userId: 1, createdAt: -1 });

// Index for category-based queries
notificationLogSchema.index({ category: 1, status: 1 });

export const NotificationLog = model<INotificationLog>('NotificationLog', notificationLogSchema);
