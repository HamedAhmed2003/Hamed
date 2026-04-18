import mongoose, { Schema, Document } from 'mongoose';

export interface IExamQuestion {
  question: string;
  choices: string[];
  correctAnswer: number;
  weight: number;
}

export interface IInternship extends Document {
  companyId: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  requiredSkills: string[];
  duration: string;
  isPaid: boolean;
  salaryMin?: number;
  salaryMax?: number;
  mode: 'online' | 'offline' | 'hybrid';
  city?: string;
  seatsAvailable: number;
  applicationDeadline: string;
  exam?: {
    duration: number; // minutes
    questions: IExamQuestion[];
  };
}

const ExamQuestionSchema = new Schema<IExamQuestion>({
  question: { type: String, required: true },
  choices: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  weight: { type: Number, default: 10 },
});

const InternshipSchema = new Schema<IInternship>({
  companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: [String], default: [] },
  duration: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  mode: { type: String, enum: ['online', 'offline', 'hybrid'], required: true },
  city: { type: String },
  seatsAvailable: { type: Number, default: 5 },
  applicationDeadline: { type: String, required: true },
  exam: {
    duration: Number,
    questions: [ExamQuestionSchema]
  }
}, { timestamps: true });

export default mongoose.model<IInternship>('Internship', InternshipSchema);
