import { useMutation, useQueryClient } from '@tanstack/react-query';
export function useMarkerRating() {
    const queryClient = useQueryClient();
    const rateMarker = useMutation({
        mutationFn: async ({ markerId, rating }) => {
            const response = await fetch(`/api/markers/${markerId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating }),
            });
            if (!response.ok) {
                throw new Error('Failed to rate marker');
            }
            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['markers'], (oldMarkers) => {
                if (!oldMarkers)
                    return [];
                return oldMarkers.map((marker) => marker.id === variables.markerId
                    ? { ...marker, rating: data.rating }
                    : marker);
            });
        },
    });
    return { rateMarker };
}
