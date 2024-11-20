import { create } from 'zustand';
import { AnalyticsData } from '../types';

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: AnalyticsData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  setData: (data) => set({ data, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));