import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, MapPin, Upload, Award, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Marker } from '../../types';
import ReputationBadges from './ReputationBadges';
import ReputationHistory from './ReputationHistory';
import { mockApi } from '../../utils/mockApi.ts';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user markers
  const { data: userMarkers = [], isLoading } = useQuery<Marker[]>({
    queryKey: ['user-markers'],
    queryFn: () => mockApi.markers.getByUser(user?.id),
  });

  // Mutation for deleting a marker
  const deleteMarker = useMutation({
    mutationFn: async (markerId: string) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/delete/${markerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to delete marker');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-markers'] });
      toast.success('Метка удалена');
    },
    onError: () => {
      toast.error('Ошибка при удалении метки');
    },
  });

  // Mutation for uploading avatar
  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке аватара');
      }

      return response;
    },
    onSuccess: (data) => {
      toast.success('Аватар успешно загружен');
      location.reload()
    },
    onSettled: () => {
      setIsUploading(false); // Reset upload state
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    uploadAvatar.mutate(file);

  };

  if (!user) {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <p className="text-gray-500 text-center">Пожалуйста, войдите в систему</p>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Профиль пользователя
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Личная информация и настройки
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === 'profile'
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <User className="inline-block h-5 w-5 mr-1" />
                  Профиль
                </button>
                <button
                    onClick={() => setActiveTab('reputation')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === 'reputation'
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Award className="inline-block h-5 w-5 mr-1" />
                  Репутация
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-8">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                            <img
                                src={`${import.meta.env.VITE_APP_DOMAIN}${user.avatar}`}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl text-gray-500">
                        {user.login}
                      </span>
                        )}
                      </div>
                      <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer"
                      >
                        <Upload className="h-4 w-4 text-gray-600" />
                        <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            disabled={isUploading}
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Имя пользователя
                        </label>
                        <div className="mt-1 text-sm text-gray-900">{user.login}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Роль
                        </label>
                        <div className="mt-1">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Дата регистрации
                        </label>
                        <div className="mt-1 text-sm text-gray-900">
                          {format(new Date(user.createdAt), 'dd.MM.yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Markers */}
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Мои метки</h4>
                    {isLoading ? (
                        <p className="text-gray-500">Загрузка меток...</p>
                    ) : userMarkers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {userMarkers.map((marker) => (
                              <div key={marker.id} className="border rounded-lg p-4 flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium">{marker.name}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                                  </div>
                                </div>
                                <button
                                    onClick={() => deleteMarker.mutate(marker.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">У вас пока нет меток на карте</p>
                    )}
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'reputation' && (
              <>
                <ReputationBadges />
                <ReputationHistory />
              </>
          )}
        </div>
      </div>
  );
}
