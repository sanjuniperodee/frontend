import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Marker } from '../types';
import { toast } from 'react-hot-toast';
import { useMarkersStore } from './markersStore';
import { useReputationStore } from './reputationStore';

interface ModerationQueue {
  id: string;
  type: 'marker' | 'comment';
  content: any;
  userId: string;
  createdAt: string;
}

interface ModerationState {
  queue: ModerationQueue[];
  addToQueue: (item: Omit<ModerationQueue, 'id' | 'createdAt'>) => void;
  removeFromQueue: (id: string) => void;
  approveItem: (id: string) => void;
  rejectItem: (id: string) => void;
  getQueue: () => ModerationQueue[];
}

export const useModerationStore = create<ModerationState>()(
  persist(
    (set, get) => ({
      queue: [],
      addToQueue: (item) => {
        const newItem: ModerationQueue = {
          ...item,
          id: Math.random().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          queue: [...state.queue, newItem]
        }));
        toast.success('Отправлено на модерацию');
      },
      removeFromQueue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id)
        }));
      },
      approveItem: (id) => {
        const item = get().queue.find((i) => i.id === id);
        if (!item) return;

        if (item.type === 'marker') {
          const marker = item.content as Marker;
          useMarkersStore.getState().approveMarker(marker.id);
          useReputationStore.getState().addPoints(10, 'Метка одобрена модератором');
        }

        get().removeFromQueue(id);
        toast.success('Элемент одобрен');
      },
      rejectItem: (id) => {
        const item = get().queue.find((i) => i.id === id);
        if (!item) return;

        if (item.type === 'marker') {
          useMarkersStore.getState().deleteMarker(item.content.id);
          useReputationStore.getState().addPoints(-5, 'Метка отклонена модератором');
        }

        get().removeFromQueue(id);
        toast.error('Элемент отклонен');
      },
      getQueue: () => get().queue,
    }),
    {
      name: 'moderation-storage',
      version: 1,
    }
  )
);