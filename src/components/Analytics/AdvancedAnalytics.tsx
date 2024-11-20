import { useQuery } from '@tanstack/react-query';
import { Activity, TrendingUp, MapPin, Users } from 'lucide-react';

export default function AdvancedAnalytics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/statistics`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Загрузка аналитики...</div>
        </div>
    );
  }

  if (isError) {
    return (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Ошибка загрузки аналитики</div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <div className="text-xl font-semibold text-gray-900">
                    {data.totalUsers}
                  </div>
                  <div className="text-sm text-gray-500">Всего пользователей</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <div className="text-xl font-semibold text-gray-900">
                    {data.totalMarkers}
                  </div>
                  <div className="text-sm text-gray-500">Всего меток</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <div className="text-xl font-semibold text-gray-900">
                    {data.totalActionsForYear}
                  </div>
                  <div className="text-sm text-gray-500">Действий за год</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5">
                  <div className="text-xl font-semibold text-gray-900">
                    {Math.round(data.averageReputation)}
                  </div>
                  <div className="text-sm text-gray-500">Средняя репутация</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for charts and other visualizations */}
      </div>
  );
}
