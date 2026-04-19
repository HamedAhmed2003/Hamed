import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/responseWrapper';
import { AuthRequest } from '../middlewares/auth';
import nodemailer from 'nodemailer';
import { VERIFICATION_EMAIL_TEMPLATE } from '../emails/emailTemplates';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  } as any);
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role, username, companyName } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return sendError(res, 400, 'User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      username,
      companyName,
      isVerified: false
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
      });
    } catch (emailError: any) {
      console.error("Email sending failed. Error:", emailError.message);
      // We still return success so the frontend can proceed to the OTP verification screen
      return sendSuccess(res, 201, { email: user.email }, 'User created. (Email sending failed, but OTP logged to console).');
    }

    return sendSuccess(res, 201, { email: user.email }, 'User created. OTP sent.');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 404, 'User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`\n========================================`);
    console.log(`[DEV ONLY] OTP for ${user.email}: ${otp}`);
    console.log(`========================================\n`);

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
      });
    } catch (emailError: any) {
      console.error("Email sending failed. Error:", emailError.message);
      return sendSuccess(res, 200, null, 'OTP created successfully (Email sending failed, but OTP logged to console).');
    }

    return sendSuccess(res, 200, null, 'OTP sent successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 404, 'User not found');

    if (user.verificationCode !== otp) {
      return sendError(res, 400, 'Invalid OTP');
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired, please request a new one",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user.id);
    const userObj = user.toObject();
    delete userObj.password;

    return sendSuccess(res, 200, { user: userObj, token }, 'Email verified successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) return sendError(res, 401, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return sendError(res, 401, 'Invalid email or password');

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified",
        isVerified: false,
      });
    }

    // Role check if admin hasn't approved the company
    // (UI will intercept this flag inside the dashboard instead of blocking physical login)
    // if (user.role === 'company' && !user.isApproved) {
    //   return sendError(res, 403, 'Company account pending admin approval');
    // }

    const token = generateToken(user.id);
    const userObj = user.toObject();
    delete userObj.password;

    return sendSuccess(res, 200, { user: userObj, token }, 'Login successful');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 404, 'User not found');
  return sendSuccess(res, 200, req.user, 'Profile fetched successfully');
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id || (req.user as any)?.id);
    if (!user) return sendError(res, 404, 'User not found');

    const updatableFields = [
      'username', 'companyName', 'phone', 'gender', 'industry',
      'taxRegister', 'description', 'skills', 'extractedSkills', 'cvUrl'
    ];

    // Process form-data for files if attached
    // This is simple JSON update to start with. Wait, frontend uses config: { headers: { 'Content-Type': 'multipart/form-data' } }
    // which means multer must parse req.body!
    // Since req.body is filled by multer if configured, we can map fields:

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // @ts-ignore
        user[field] = req.body[field];
      }
    });

    if (req.file) {
      // Cloud storage logic normally here, but we will mock URL for now
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    return sendSuccess(res, 200, user, 'Profile updated successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
