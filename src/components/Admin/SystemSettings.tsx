import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save } from 'lucide-react';

const settingsSchema = z.object({
  siteName: z.string().min(2, 'Минимум 2 символа'),
  defaultZoom: z.number().min(1).max(20),
  defaultCenter: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  requireModeration: z.boolean(),
  maxMarkersPerUser: z.number().min(1),
  allowComments: z.boolean(),
  allowRatings: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SystemSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const mutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Настройки системы
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Основные параметры работы сайта
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название сайта
            </label>
            <input
              type="text"
              {...register('siteName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.siteName && (
              <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Масштаб карты по умолчанию
              </label>
              <input
                type="number"
                {...register('defaultZoom', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.defaultZoom && (
                <p className="mt-1 text-sm text-red-600">{errors.defaultZoom.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Максимум меток на пользователя
              </label>
              <input
                type="number"
                {...register('maxMarkersPerUser', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.maxMarkersPerUser && (
                <p className="mt-1 text-sm text-red-600">{errors.maxMarkersPerUser.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Широта центра карты
              </label>
              <input
                type="number"
                step="any"
                {...register('defaultCenter.lat', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Долгота центра карты
              </label>
              <input
                type="number"
                step="any"
                {...register('defaultCenter.lng', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('requireModeration')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Требовать модерацию для новых меток
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('allowComments')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Разрешить комментарии
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('allowRatings')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Разрешить оценки меток
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              <Save className="h-5 w-5 mr-2" />
              {mutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}