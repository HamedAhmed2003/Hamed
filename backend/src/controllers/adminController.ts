import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Application from '../models/Application';
import Internship from '../models/Internship';
import { sendSuccess, sendError } from '../utils/responseWrapper';
import { createNotification } from './notificationController';

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    return sendSuccess(res, 200, students, 'Volunteers fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await User.find({ role: 'company' }).select('-password');
    return sendSuccess(res, 200, companies, 'Organizations fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getPendingCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await User.find({ role: 'company', isApproved: false }).select('-password').sort({ createdAt: -1 });
    return sendSuccess(res, 200, companies, 'Pending organizations fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const approveCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company || company.role !== 'company') return sendError(res, 404, 'Organization not found');

    company.isApproved = true;
    await company.save();
    return sendSuccess(res, 200, company, 'Organization approved successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const rejectCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company || company.role !== 'company') return sendError(res, 404, 'Organization not found');

    company.isApproved = false;
    await company.save();
    return sendSuccess(res, 200, company, 'Organization access revoked');
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
    return sendSuccess(res, 200, null, 'User deleted successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// === Opportunity (Internship) Approval ===

export const getPendingOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const opportunities = await Internship.find({ 
      $or: [
        { status: 'pending' },
        { status: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, opportunities, 'Pending opportunities fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const approveOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await Internship.findById(req.params.id);
    if (!opportunity) return sendError(res, 404, 'Opportunity not found');

    opportunity.status = 'approved';
    await opportunity.save();

    // Notify the organization
    await createNotification({
      recipientId: opportunity.companyId.toString(),
      recipientRole: 'company',
      type: 'opportunity_approved',
      title: '✅ Opportunity Approved',
      message: `Your opportunity "${opportunity.title}" has been approved and is now visible to volunteers.`,
      relatedId: (opportunity._id as any).toString(),
      relatedType: 'opportunity',
    });

    return sendSuccess(res, 200, opportunity, 'Opportunity approved and is now publicly visible');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const rejectOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await Internship.findById(req.params.id);
    if (!opportunity) return sendError(res, 404, 'Opportunity not found');

    opportunity.status = 'rejected';
    await opportunity.save();

    // Notify the organization
    await createNotification({
      recipientId: opportunity.companyId.toString(),
      recipientRole: 'company',
      type: 'opportunity_rejected',
      title: 'Opportunity Not Approved',
      message: `Your opportunity "${opportunity.title}" was not approved. Please review and resubmit.`,
      relatedId: (opportunity._id as any).toString(),
      relatedType: 'opportunity',
    });

    return sendSuccess(res, 200, opportunity, 'Opportunity rejected');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// Admin stats overview
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [totalVolunteers, totalOrganizations, pendingOrganizations, pendingOpportunities, totalApplications, totalOpportunities] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'company' }),
      User.countDocuments({ role: 'company', isApproved: false }),
      Internship.countDocuments({ 
        $or: [
          { status: 'pending' },
          { status: { $exists: false } }
        ]
      }),
      Application.countDocuments(),
      Internship.countDocuments({ status: 'approved' }),
    ]);

    return sendSuccess(res, 200, {
      totalVolunteers,
      totalOrganizations,
      pendingOrganizations,
      pendingOpportunities,
      totalApplications,
      totalOpportunities,
    }, 'Admin stats fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
