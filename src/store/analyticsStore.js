import { create } from 'zustand';
export const useAnalyticsStore = create((set) => ({
    data: null,
    isLoading: false,
    error: null,
    setData: (data) => set({ data, isLoading: false, error: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
}));
