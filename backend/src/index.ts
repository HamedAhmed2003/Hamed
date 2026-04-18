import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes';
import internshipRoutes from './routes/internshipRoutes';
import applicationRoutes from './routes/applicationRoutes';
import adminRoutes from './routes/adminRoutes';
import aiRoutes from './routes/aiRoutes';



const app: Express = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to Database successfuly'))
  .catch((err) => {
    console.error('Failed to connect to Database', err);
    process.exit(1);
  });

mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

mongoose.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Make uploads folder accessible statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
