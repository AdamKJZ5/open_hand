import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
  subject: string;
  content: string;
  read: boolean;
  readAt?: Date;
  deletedBySender: boolean;
  deletedByRecipient: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    required: false
  },
  deletedBySender: {
    type: Boolean,
    default: false
  },
  deletedByRecipient: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient inbox queries
messageSchema.index({ recipient: 1, read: 1, createdAt: -1 });

// Index for sender queries
messageSchema.index({ sender: 1, createdAt: -1 });

export const Message = model<IMessage>('Message', messageSchema);
