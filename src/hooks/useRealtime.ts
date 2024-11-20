import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export function useRealtime() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket || !user) return;

    // Marker events
    socket.on('marker:created', () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    });

    socket.on('marker:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    });

    socket.on('marker:deleted', () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    });

    socket.on('marker:approved', () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
      queryClient.invalidateQueries({ queryKey: ['user-markers'] });
    });

    // Category events
    socket.on('category:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    });

    // User events
    socket.on('user:updated', (updatedUserId: string) => {
      if (updatedUserId === user.id) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });

    return () => {
      socket.off('marker:created');
      socket.off('marker:updated');
      socket.off('marker:deleted');
      socket.off('marker:approved');
      socket.off('category:updated');
      socket.off('user:updated');
    };
  }, [socket, queryClient, user]);
}