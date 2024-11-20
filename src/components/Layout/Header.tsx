import { useAuthStore } from '../../store/authStore';
import { MapPin, User, LogOut, Shield, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import {useEffect} from "react";

export default function Header() {
  const { user, logout, checkAuthStatus } = useAuthStore();
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">Карта Меток</span>
            </Link>
            
            <Link to="/map" className="text-gray-700 hover:text-blue-600">
              Карта
            </Link>

            <Link to="/markers" className="text-gray-700 hover:text-blue-600">
              <span className="flex items-center">
                <List className="h-5 w-5 mr-1" />
                Все метки
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.role === 'admin' && (
              <Link 
                to="/admin/users"
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <Shield className="h-5 w-5 mr-1" />
                <span>Админ панель</span>
              </Link>
            )}
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.login}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}