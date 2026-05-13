import { Router } from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController';
import { protect } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
