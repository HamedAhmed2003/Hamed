import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Application from '../models/Application';
import Internship from '../models/Internship';
import { sendSuccess, sendError } from '../utils/responseWrapper';

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    return sendSuccess(res, 200, students, 'Students fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await User.find({ role: 'company' }).select('-password');
    return sendSuccess(res, 200, companies, 'Companies fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const approveCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company || company.role !== 'company') return sendError(res, 404, 'Company not found');

    company.isApproved = true;
    await company.save();
    return sendSuccess(res, 200, company, 'Company approved successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const rejectCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company || company.role !== 'company') return sendError(res, 404, 'Company not found');

    company.isApproved = false;
    await company.save();
    return sendSuccess(res, 200, company, 'Company rejected successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.isVerified = false;
    await user.save();
    return sendSuccess(res, 200, user, 'User suspended successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Cleanup related data could go here
    return sendSuccess(res, 200, null, 'User deleted successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
