import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
export function useModerationRealtime() {
    const socket = useSocket();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    useEffect(() => {
        if (!socket || !user)
            return;
        const handleModerationAction = (data) => {
            queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
            queryClient.invalidateQueries({ queryKey: [data.type + 's'] });
            const actionText = {
                approve: 'одобрено',
                reject: 'отклонено',
                warn: 'предупреждение',
                ban: 'заблокировано'
            }[data.action];
            const typeText = {
                marker: 'Метка',
                comment: 'Комментарий',
                user: 'Пользователь'
            }[data.type];
            const message = `${typeText} ${actionText}${data.reason ? `: ${data.reason}` : ''}`;
            if (data.action === 'approve') {
                toast.success(message);
            }
            else {
                toast.error(message);
            }
        };
        const handleAutoModeration = (data) => {
            queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
            queryClient.invalidateQueries({ queryKey: [data.type + 's'] });
            if (user.role === 'admin') {
                const actionText = data.action === 'approve' ? 'одобрен(а)' :
                    data.action === 'reject' ? 'отклонен(а)' : 'помечен(а)';
                const typeText = data.type === 'marker' ? 'Метка' : 'Комментарий';
                const message = `Автомодерация: ${data.rule}\n${typeText} ${actionText}`;
                toast.info(message);
            }
        };
        socket.on('moderation:action', handleModerationAction);
        socket.on('moderation:auto', handleAutoModeration);
        return () => {
            socket.off('moderation:action', handleModerationAction);
            socket.off('moderation:auto', handleAutoModeration);
        };
    }, [socket, queryClient, user]);
}
