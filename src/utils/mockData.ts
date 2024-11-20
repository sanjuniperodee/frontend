import { Achievement } from '../types';

// Mock achievements
export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Первая метка',
    description: 'Создайте свою первую метку на карте',
    category: 'markers',
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Активный участник',
    description: 'Наберите 100 очков репутации',
    category: 'special',
    progress: 50,
    maxProgress: 100
  }
];