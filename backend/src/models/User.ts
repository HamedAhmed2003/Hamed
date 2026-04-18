import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'student' | 'company' | 'admin';
  isVerified: boolean;
  verificationCode?: string;
  otpExpiresAt?: Date;

  // Student specific
  username?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profileImage?: string;
  cvUrl?: string;
  skills?: string[];
  extractedSkills?: string[];

  // Company specific
  companyName?: string;
  industry?: string;
  taxRegister?: string;
  description?: string;
  logo?: string;
  isApproved?: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, enum: ['student', 'company', 'admin'], required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  otpExpiresAt: { type: Date },

  // Student fields
  username: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: { type: String },
  profileImage: { type: String },
  cvUrl: { type: String },
  skills: { type: [String], default: [] },
  extractedSkills: { type: [String], default: [] },

  // Company fields
  companyName: { type: String },
  industry: { type: String },
  taxRegister: { type: String },
  description: { type: String },
  logo: { type: String },
  isApproved: { type: Boolean, default: false }, // Only admin can approve
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
