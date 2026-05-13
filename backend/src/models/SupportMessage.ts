import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  accountType: 'volunteer' | 'organization' | 'admin' | 'other';
  status: 'new' | 'read' | 'resolved';
  createdAt: Date;
}

const SupportMessageSchema = new Schema<ISupportMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    accountType: {
      type: String,
      enum: ['volunteer', 'organization', 'admin', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISupportMessage>('SupportMessage', SupportMessageSchema);
