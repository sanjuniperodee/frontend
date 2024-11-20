import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Activity, Users, MapPin, MessageSquare } from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'marker' | 'comment' | 'user' | 'moderation';
  action: string;
  details: string;
  timestamp: Date;
}

export default function RealTimeMonitoring() {
  const socket = useSocket();
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    markersCreated: 0,
    commentsAdded: 0,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('activity', (event: ActivityEvent) => {
      setRecentActivity((prev) => [event, ...prev].slice(0, 50));
    });

    socket.on('stats:update', (newStats) => {
      setStats(newStats);
    });

    return () => {
      socket.off('activity');
      socket.off('stats:update');
    };
  }, [socket]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-time Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Текущая активность
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-2xl font-semibold text-blue-600">
                {stats.activeUsers}
              </span>
            </div>
            <p className="mt-1 text-sm text-blue-600">Активных пользователей</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-2xl font-semibold text-green-600">
                {stats.markersCreated}
              </span>
            </div>
            <p className="mt-1 text-sm text-green-600">Новых меток</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-purple-500 mr-2" />
              <span className="text-2xl font-semibold text-purple-600">
                {stats.commentsAdded}
              </span>
            </div>
            <p className="mt-1 text-sm text-purple-600">Новых комментариев</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Лента активности
        </h3>
        <div className="space-y-4 max-h-96 overflow-auto">
          {recentActivity.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <Activity className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-900">{event.details}</p>
                <p className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}