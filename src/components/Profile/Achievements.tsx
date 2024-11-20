import { useQuery } from '@tanstack/react-query';
import { Trophy, Star, MapPin, MessageSquare, ThumbsUp } from 'lucide-react';
import { Achievement } from '../../types';

const achievementIcons = {
  markers: MapPin,
  comments: MessageSquare,
  ratings: ThumbsUp,
  special: Trophy,
};

export default function Achievements() {
  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await fetch('/api/user/achievements');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-600">Загрузка достижений...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Достижения
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {achievements?.map((achievement) => {
            const Icon = achievementIcons[achievement.category];
            const isUnlocked = achievement.progress >= achievement.maxProgress;
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  isUnlocked
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    isUnlocked ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isUnlocked ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {achievement.description}
                    </p>
                    {!isUnlocked && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">
                          Прогресс: {achievement.progress} / {achievement.maxProgress}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 rounded-full h-2"
                            style={{
                              width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-green-600">
                        Получено: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}