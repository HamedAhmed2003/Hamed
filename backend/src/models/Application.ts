import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  internshipId: mongoose.Types.ObjectId;
  internshipTitle: string;
  companyName: string;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentGender?: string;
  cvUrl?: string;
  skills: string[];
  examScore?: number;
  examTimeTaken?: number;
  status: 'pending' | 'accepted' | 'rejected';
  skillMatch?: number;
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  internshipId: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
  internshipTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String },
  studentGender: { type: String },
  cvUrl: { type: String },
  skills: { type: [String], default: [] },
  examScore: { type: Number },
  examTimeTaken: { type: Number },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  skillMatch: { type: Number, default: 0 },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
