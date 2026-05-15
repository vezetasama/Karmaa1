import { create } from 'zustand';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  isOpen: false,

  // Fetch notifications from API
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await getNotifications();
      set({
        notifications: res.data.data,
        unreadCount: res.data.unreadCount,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      set({ loading: false });
    }
  },

  // Add a new notification from real-time socket event
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Mark a single notification as read
  markAsRead: async (id) => {
    try {
      await markNotificationRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  },

  // Mark all notifications as read
  markAllRead: async () => {
    try {
      await markAllNotificationsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  },

  // Toggle dropdown
  toggleDropdown: () => set((state) => ({ isOpen: !state.isOpen })),
  closeDropdown: () => set({ isOpen: false }),
}));
