import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5173';
export function useSocket() {
    const socketRef = useRef(null);
    const { user } = useAuthStore();
    useEffect(() => {
        if (!user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }
        // Create socket connection only if it doesn't exist
        if (!socketRef.current) {
            try {
                socketRef.current = io(SOCKET_URL, {
                    auth: {
                        userId: user.id,
                    },
                    transports: ['websocket', 'polling'],
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    autoConnect: true,
                });
                socketRef.current.on('connect', () => {
                    console.log('Connected to WebSocket');
                });
                socketRef.current.on('connect_error', (error) => {
                    console.warn('Socket connection error:', error.message);
                });
                socketRef.current.on('disconnect', (reason) => {
                    console.log('Disconnected from WebSocket:', reason);
                });
            }
            catch (error) {
                console.warn('Socket initialization error:', error);
            }
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);
    return socketRef.current;
}
