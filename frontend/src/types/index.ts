export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface StudentProfile extends User {
  role: 'student';
  username: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profileImage?: string;
  cvUrl?: string;
  skills: string[];
  extractedSkills: string[];
}

export interface CompanyProfile extends User {
  role: 'company';
  companyName: string;
  industry?: string;
  phone?: string;
  taxRegister?: string;
  description?: string;
  logo?: string;
  isApproved: boolean;
}

export interface AdminProfile extends User {
  role: 'admin';
  username: string;
}

export type AppUser = StudentProfile | CompanyProfile | AdminProfile;

export interface Internship {
  id: string;
  companyId: string;
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
  createdAt: string;
  exam?: Exam;
}

export interface Exam {
  id: string;
  internshipId: string;
  questions: ExamQuestion[];
  duration: number; // minutes
}

export interface ExamQuestion {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  weight: number;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentGender?: string;
  cvUrl?: string;
  skills: string[];
  examScore?: number;
  examTimeTaken?: number; // seconds
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  skillMatch?: number;
}
