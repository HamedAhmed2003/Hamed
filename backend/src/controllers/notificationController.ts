import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middlewares/auth';
import { sendSuccess, sendError } from '../utils/responseWrapper';

// Get notifications for current user
export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, 200, notifications, 'Notifications fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// Get unread count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({ recipientId: req.user?._id, isRead: false });
    return sendSuccess(res, 200, { count }, 'Unread count fetched');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// Mark a single notification as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Notification.updateOne(
      { _id: req.params.id, recipientId: req.user?._id },
      { isRead: true }
    );
    
    if (result.matchedCount === 0) {
      return sendError(res, 404, 'Notification not found or unauthorized');
    }

    return sendSuccess(res, 200, null, 'Notification marked as read');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// Mark ALL as read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user?._id, isRead: false },
      { isRead: true }
    );
    return sendSuccess(res, 200, null, 'All notifications marked as read');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// Delete a notification
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipientId: req.user?._id });
    return sendSuccess(res, 200, null, 'Notification deleted');
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

// ─── Internal helper (not an HTTP handler) ─────────────────────────────────
export const createNotification = async (params: {
  recipientId: string;
  recipientRole: 'student' | 'company' | 'admin';
  senderId?: string;
  senderName?: string;
  type: import('../models/Notification').NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: 'opportunity' | 'application';
}) => {
  try {
    await Notification.create(params);
  } catch (err) {
    console.error('[Notification creation failed]', err);
  }
};
