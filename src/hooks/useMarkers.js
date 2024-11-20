import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useMarkersStore } from '../store/markersStore';
import { useAuthStore } from '../store/authStore';
import { useReputationStore } from '../store/reputationStore';
import { useModerationStore } from '../store/moderationStore';
import { mockApi } from "../utils/mockApi.ts";
export function useMarkers() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { addPoints } = useReputationStore();
    const { addToQueue } = useModerationStore();
    const { markers: storeMarkers, addMarker: addMarkerToStore, updateMarker: updateMarkerInStore, filters, getFilteredMarkers, fetchMarkers, connectToWebSocket } = useMarkersStore();
    const { data: markers = storeMarkers, isLoading } = useQuery({
        queryKey: ['markers'],
        queryFn: () => mockApi.markers.getAll(),
        initialData: storeMarkers,
    });
    const createMarker = useMutation({
        mutationFn: async (data) => {
            const newMarker = {
                ...data,
                id: Math.random().toString(),
                createdAt: new Date().toISOString(),
                approved: false,
                rating: 0,
            };
            // Add to store but marked as not approved
            addMarkerToStore(newMarker);
            toast.success('Метка успешно создана и отправлена на модерацию');
            return newMarker;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['markers'] });
        },
    });
    const rateMarker = useMutation({
        mutationFn: async ({ markerId, rating }) => {
            const marker = markers.find(m => m.id === markerId);
            if (!marker)
                throw new Error('Метка не найдена');
            if (rating == 1) {
                marker.rating = (await mockApi.markers.rate(marker)).rating;
                updateMarkerInStore(marker);
            }
            if (rating == -1) {
                marker.rating = (await mockApi.markers.dislike(marker)).rating;
                updateMarkerInStore(marker);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['markers'] });
            addPoints(variables.rating > 0 ? 2 : -1, variables.rating > 0 ? 'Положительная оценка метки' : 'Отрицательная оценка метки');
        },
    });
    const filteredMarkers = getFilteredMarkers().filter(marker => {
        // Базовая фильтрация по одобрению
        if (!marker.approved && (!user || user.role !== 'admin')) {
            return false;
        }
        // Применяем фильтры
        if (filters.categories.length > 0 && !filters.categories.includes(marker.category)) {
            return false;
        }
        if (filters.rating !== null && marker.rating < filters.rating) {
            return false;
        }
        if (filters.dateRange[0] && filters.dateRange[1]) {
            const markerDate = new Date(marker.createdAt);
            if (markerDate < filters.dateRange[0] || markerDate > filters.dateRange[1]) {
                return false;
            }
        }
        return true;
    });
    const userMarkers = user ? markers.filter(marker => marker.userId === user.id) : [];
    return {
        connectToWebSocket,
        fetchMarkers,
        markers: filteredMarkers,
        userMarkers,
        isLoading,
        createMarker,
        rateMarker,
    };
}
