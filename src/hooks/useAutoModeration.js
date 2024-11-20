import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useMutation, useQueryClient } from '@tanstack/react-query';
export function useAutoModeration() {
    const socket = useSocket();
    const queryClient = useQueryClient();
    const createRule = useMutation({
        mutationFn: async (rule) => {
            const response = await fetch('/api/moderation/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rule),
            });
            if (!response.ok)
                throw new Error('Failed to create rule');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-rules'] });
        },
    });
    const updateRule = useMutation({
        mutationFn: async ({ id, ...rule }) => {
            const response = await fetch(`/api/moderation/rules/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rule),
            });
            if (!response.ok)
                throw new Error('Failed to update rule');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-rules'] });
        },
    });
    const deleteRule = useMutation({
        mutationFn: async (ruleId) => {
            const response = await fetch(`/api/moderation/rules/${ruleId}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete rule');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-rules'] });
        },
    });
    useEffect(() => {
        if (!socket)
            return;
        socket.on('moderation:auto-action', (data) => {
            queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
            queryClient.invalidateQueries({ queryKey: ['markers'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        });
        return () => {
            socket.off('moderation:auto-action');
        };
    }, [socket, queryClient]);
    return {
        createRule,
        updateRule,
        deleteRule,
    };
}
