import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, MapPin, Tag, Settings, FileText, BarChart } from 'lucide-react';
import UserManagement from './UserManagement';
import MarkerManagement from './MarkerManagement';
import CategoryManagement from './CategoryManagement';
import SystemSettings from './SystemSettings';
import AdvancedAnalytics from '../Analytics/AdvancedAnalytics';

const navigation = [
  { name: 'Пользователи', path: 'users', icon: Users },
  { name: 'Метки', path: 'markers', icon: MapPin },
  { name: 'Категории', path: 'categories', icon: Tag },
  { name: 'Аналитика', path: 'analytics', icon: BarChart },
  { name: 'Логи', path: 'logs', icon: FileText },
  { name: 'Настройки', path: 'settings', icon: Settings },
];

export default function AdminPanel() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 fixed left-0 top-16 bottom-0 overflow-y-auto">
        <nav className="py-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 pt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="users" element={<UserManagement />} />
            <Route path="markers" element={<MarkerManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="analytics" element={<AdvancedAnalytics />} />
            <Route path="settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}