import { create } from 'zustand';
import { notificationService } from '@/services/api';

export interface INotification {
  _id: string;
  id?: string;
  recipientId: string;
  recipientRole: 'student' | 'company' | 'admin';
  senderName?: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: 'opportunity' | 'application';
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await notificationService.getAll();
      const notifications = Array.isArray(data) ? data : [];
      const unreadCount = notifications.filter((n: INotification) => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await notificationService.getUnreadCount();
      set({ unreadCount: data?.count ?? 0 });
    } catch { /* silent */ }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      set(state => ({
        notifications: state.notifications.map(n =>
          (n._id === id || n.id === id) ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch { /* silent */ }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch { /* silent */ }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationService.delete(id);
      const removed = get().notifications.find(n => n._id === id || n.id === id);
      set(state => ({
        notifications: state.notifications.filter(n => n._id !== id && n.id !== id),
        unreadCount: removed && !removed.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }));
    } catch { /* silent */ }
  },
}));
