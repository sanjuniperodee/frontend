import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AlertTriangle, Info } from 'lucide-react';

interface Log {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  userId?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Mock data for development
const mockLogs: Log[] = [
  {
    id: '1',
    type: 'info',
    message: 'Пользователь вошел в систему',
    userId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'warning',
    message: 'Попытка доступа к защищенному ресурсу',
    userId: '2',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export default function LogViewer() {
  const { data: logs, isLoading } = useQuery<Log[]>({
    queryKey: ['logs'],
    queryFn: async () => {
      // Return mock data for development
      return Promise.resolve(mockLogs);
    },
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-600">Загрузка логов...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Системные логи
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сообщение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs?.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getLogIcon(log.type)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{log.message}</div>
                  {log.metadata && (
                    <pre className="mt-1 text-xs text-gray-500 overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.userId || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm:ss')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}