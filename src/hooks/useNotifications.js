import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useQueryClient } from '@tanstack/react-query';
export function useNotifications() {
    const socket = useSocket();
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!socket)
            return;
        const handleNotification = (notification) => {
            queryClient.setQueryData(['notifications'], (old = []) => {
                return [notification, ...old];
            });
        };
        socket.on('notification', handleNotification);
        return () => {
            socket.off('notification', handleNotification);
        };
    }, [socket, queryClient]);
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }
            queryClient.setQueryData(['notifications'], (old = []) => {
                return old.map((n) => n.id === notificationId ? { ...n, read: true } : n);
            });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    return { markAsRead };
}
