import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { mockApi } from '../utils/mockApi.ts';
import { io } from 'socket.io-client';
export const useMarkersStore = create()(persist((set, get) => ({
    markers: [],
    selectedMarker: null,
    isAddingMarker: false,
    filters: {
        categories: [],
        dateRange: [null, null],
        rating: null,
    },
    setMarkers: (markers) => set({ markers }),
    fetchMarkers: async (isAdmin) => {
        try {
            const url = isAdmin
                ? `${import.meta.env.VITE_APP_DOMAIN}/v1/marker/admin-list`
                : `${import.meta.env.VITE_APP_DOMAIN}/v1/marker/list`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch markers');
            }
            const markers = await response.json();
            set({ markers });
        }
        catch (error) {
            console.error('Error fetching markers:', error);
            toast.error('Не удалось загрузить метки');
        }
    },
    addMarker: (marker) => {
        mockApi.markers.create(marker).then((r) => {
            toast.success('Метка успешно создана и отправлена на модерацию');
        });
    },
    updateMarker: (marker) => {
        set((state) => ({
            markers: state.markers.map((m) => (m.id === marker.id ? marker : m)),
        }));
    },
    deleteMarker: (markerId) => {
        mockApi.markers.delete(markerId).then((r) => {
            set((state) => ({
                markers: state.markers.filter((m) => m.id !== markerId),
            }));
            toast.success('Метка удалена');
        });
    },
    setSelectedMarker: (marker) => set({ selectedMarker: marker }),
    setIsAddingMarker: (isAdding) => set({ isAddingMarker: isAdding }),
    setFilters: (filters) => set({ filters }),
    getFilteredMarkers: () => {
        const { markers, filters } = get();
        return markers.filter((marker) => {
            if (filters.categories.length > 0 &&
                !filters.categories.includes(marker.category)) {
                return false;
            }
            if (filters.rating !== null && marker.rating < filters.rating) {
                return false;
            }
            if (filters.dateRange[0] && filters.dateRange[1]) {
                const markerDate = new Date(marker.createdAt);
                if (markerDate < filters.dateRange[0] ||
                    markerDate > filters.dateRange[1]) {
                    return false;
                }
            }
            return true;
        });
    },
    approveMarker: (markerId) => {
        set((state) => ({
            markers: state.markers.map((m) => m.id === markerId ? { ...m, approved: true } : m),
        }));
    },
    // Connect to WebSocket and listen for updates
    connectToWebSocket: () => {
        const socket = io(import.meta.env.VITE_APP_DOMAIN);
        socket.on('markerCreated', (marker) => {
            set((state) => {
                const markerExists = state.markers.some((m) => m.id === marker.id);
                if (markerExists)
                    return state;
                return { markers: [...state.markers, marker] };
            });
        });
        socket.on('markerUpdated', (updatedMarker) => {
            set((state) => {
                const markerExists = state.markers.some((m) => m.id === updatedMarker.id);
                if (markerExists)
                    return state;
                return { markers: [...state.markers, updatedMarker] };
            });
        });
        socket.on('markerDeleted', (markerId) => {
            set((state) => ({
                markers: state.markers.filter((m) => m.id !== markerId),
            }));
            toast.error('Метка удалена');
        });
    },
}), {
    name: 'markers-storage',
    version: 1,
}));
