import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReputationEvent {
  id: string;
  type: string;
  points: number;
  reason: string;
  createdAt: string;
}

interface ReputationState {
  totalPoints: number;
  events: ReputationEvent[];
  addPoints: (points: number, reason: string) => void;
  getCurrentLevel: () => { name: string; min: number; max: number };
}

const REPUTATION_LEVELS = {
  NOVICE: { name: 'NOVICE', min: 0, max: 99 },
  CONTRIBUTOR: { name: 'CONTRIBUTOR', min: 100, max: 499 },
  EXPERT: { name: 'EXPERT', min: 500, max: 999 },
  MASTER: { name: 'MASTER', min: 1000, max: Infinity },
};

export const useReputationStore = create<ReputationState>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      events: [],
      addPoints: (points, reason) => {
        const newEvent: ReputationEvent = {
          id: Math.random().toString(),
          type: points > 0 ? 'gain' : 'loss',
          points,
          reason,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          totalPoints: state.totalPoints + points,
          events: [newEvent, ...state.events],
        }));
      },
      getCurrentLevel: () => {
        const points = get().totalPoints;
        return Object.values(REPUTATION_LEVELS).find(
          level => points >= level.min && points <= level.max
        ) || REPUTATION_LEVELS.NOVICE;
      },
    }),
    {
      name: 'reputation-storage',
      version: 1,
    }
  )
);