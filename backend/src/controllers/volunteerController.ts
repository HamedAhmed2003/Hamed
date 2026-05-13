import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Application from '../models/Application';
import User from '../models/User';
import Internship from '../models/Internship';
import { sendSuccess, sendError } from '../utils/responseWrapper';
import mongoose from 'mongoose';

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const leaderboard = await Application.aggregate([
      { $match: { status: 'accepted' } },
      // Join with Internship to get fallback hours if needed
      {
        $lookup: {
          from: 'internships',
          localField: 'internshipId',
          foreignField: '_id',
          as: 'internship'
        }
      },
      { $unwind: { path: '$internship', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$studentId',
          totalHours: {
            $sum: {
              $cond: [
                { $gt: ['$hoursEarned', 0] },
                '$hoursEarned',
                { $ifNull: ['$internship.volunteerHours', 0] }
              ]
            }
          },
          opportunitiesCount: { $sum: 1 },
          lastAcceptedAt: { $max: '$acceptedAt' }
        }
      },
      // Join with User to get profile info
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          totalHours: 1,
          opportunitiesCount: 1,
          lastAcceptedAt: 1,
          username: '$user.username',
          profileImage: '$user.profileImage',
        }
      },
      { $sort: { totalHours: -1, opportunitiesCount: -1, lastAcceptedAt: -1 } }
    ]);

    return sendSuccess(res, 200, leaderboard, 'Leaderboard fetched successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getVolunteerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid volunteer ID');
    }

    const user = await User.findById(id).select('-password -verificationCode -otpExpiresAt -email');
    if (!user || user.role !== 'student') {
      return sendError(res, 404, 'Volunteer not found');
    }

    // Get accepted opportunities
    const applications = await Application.find({ studentId: id, status: 'accepted' })
      .sort({ acceptedAt: -1 })
      .select('internshipTitle companyName hoursEarned acceptedAt internshipId');

    // Calculate rank
    const leaderboard = await Application.aggregate([
      { $match: { status: 'accepted' } },
      {
        $lookup: {
          from: 'internships',
          localField: 'internshipId',
          foreignField: '_id',
          as: 'internship'
        }
      },
      { $unwind: { path: '$internship', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$studentId',
          totalHours: {
            $sum: {
              $cond: [
                { $gt: ['$hoursEarned', 0] },
                '$hoursEarned',
                { $ifNull: ['$internship.volunteerHours', 0] }
              ]
            }
          },
          opportunitiesCount: { $sum: 1 },
          lastAcceptedAt: { $max: '$acceptedAt' }
        }
      },
      { $sort: { totalHours: -1, opportunitiesCount: -1, lastAcceptedAt: -1 } }
    ]);

    const rank = leaderboard.findIndex(item => item._id.toString() === id) + 1;
    const stats = leaderboard.find(item => item._id.toString() === id) || { totalHours: 0, opportunitiesCount: 0 };

    return sendSuccess(res, 200, {
      profile: user,
      applications,
      rank,
      totalHours: stats.totalHours,
      opportunitiesCount: stats.opportunitiesCount
    }, 'Volunteer profile fetched successfully');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
