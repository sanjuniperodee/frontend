import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const REPUTATION_POINTS = {
    marker_approved: 10,
    marker_rejected: -5,
    comment_liked: 2,
    report_accepted: 5,
};
export function useReputation() {
    const queryClient = useQueryClient();
    const updateReputation = useMutation({
        mutationFn: async (action) => {
            const response = await fetch(`/api/users/${action.userId}/reputation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action),
            });
            if (!response.ok)
                throw new Error('Failed to update reputation');
            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['user', variables.userId], (oldUser) => {
                if (!oldUser)
                    return oldUser;
                return {
                    ...oldUser,
                    reputation: data.reputation,
                };
            });
        },
    });
    const getReputationHistory = useQuery({
        queryKey: ['reputation-history'],
        queryFn: async () => {
            const response = await fetch('/api/users/reputation/history');
            if (!response.ok)
                throw new Error('Failed to fetch reputation history');
            return response.json();
        },
    });
    return {
        updateReputation,
        getReputationHistory,
        REPUTATION_POINTS,
    };
}
