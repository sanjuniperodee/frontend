import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Mock initial notifications for development
const mockNotifications = [
    {
        id: '1',
        type: 'marker_approved',
        message: 'Ваша метка была одобрена',
        createdAt: new Date().toISOString(),
        read: false
    }
];
export const useNotificationsStore = create()(persist((set) => ({
    notifications: mockNotifications,
    unreadCount: mockNotifications.filter(n => !n.read).length,
    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
    })),
    markAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === notificationId ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
    })),
    clearNotifications: () => set({
        notifications: [],
        unreadCount: 0,
    }),
}), {
    name: 'notifications-storage',
    version: 1,
}));
