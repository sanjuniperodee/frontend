import { useQuery } from '@tanstack/react-query';
import { Users, MapPin, MessageSquare } from 'lucide-react';

interface Statistics {
  totalUsers: number;
  activeUsers: number;
  totalMarkers: number;
  pendingMarkers: number;
  totalComments: number;
  categoriesStats: {
    categoryId: string;
    categoryName: string;
    count: number;
  }[];
  userStats: {
    userId: string;
    username: string;
    markersCount: number;
    commentsCount: number;
  }[];
  dailyActivity: {
    date: string;
    markers: number;
    comments: number;
  }[];
}

export default function Statistics() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ['admin-statistics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Загрузка статистики...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего пользователей
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.totalUsers}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stats?.activeUsers} активных
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего меток
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats?.totalMarkers}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                      {stats?.pendingMarkers} на модерации
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего комментариев
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.totalComments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Распределение по категориям
        </h3>
        <div className="space-y-4">
          {stats?.categoriesStats.map((category) => (
            <div key={category.categoryId}>
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <span>{category.categoryName}</span>
                <span>{category.count}</span>
              </div>
              <div className="mt-1 relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{
                      width: `${(category.count / stats.totalMarkers) * 100}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Топ пользователей
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Метки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Комментарии
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.userStats.map((user) => (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.markersCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.commentsCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ежедневная активность
        </h3>
        <div className="h-64">
          {/* Here you would typically use a charting library like Chart.js or Recharts */}
          <div className="flex h-full items-end space-x-2">
            {stats?.dailyActivity.map((day) => (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  style={{ height: `${(day.markers / 10) * 100}%` }}
                  className="w-full bg-blue-500 rounded-t"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}