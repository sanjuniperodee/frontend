import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ReputationEvent {
  id: string;
  type: string;
  points: number;
  reason: string;
  createdAt: string;
}


export default function ReputationHistory() {
  const { data: history, isLoading, isError } = useQuery<ReputationEvent[]>({
    queryKey: ['reputation-history'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include auth token if required
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reputation history');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-600">Загрузка истории...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          История репутации
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {history?.map((event) => (
            <li key={event.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {event.points > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {event.reason}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.createdAt), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.points > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {event.points > 0 ? '+' : ''}
                  {event.points} очков
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}