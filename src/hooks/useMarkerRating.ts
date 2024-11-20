import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Marker } from '../types';

interface RatingMutationParams {
  markerId: string;
  rating: 1 | -1;
}

export function useMarkerRating() {
  const queryClient = useQueryClient();

  const rateMarker = useMutation({
    mutationFn: async ({ markerId, rating }: RatingMutationParams) => {
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
      queryClient.setQueryData<Marker[]>(['markers'], (oldMarkers) => {
        if (!oldMarkers) return [];
        return oldMarkers.map((marker) =>
          marker.id === variables.markerId
            ? { ...marker, rating: data.rating }
            : marker
        );
      });
    },
  });

  return { rateMarker };
}