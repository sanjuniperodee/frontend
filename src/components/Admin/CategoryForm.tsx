import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '../../types';
import { X } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().min(1, 'Напишите описание'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const url = category
        ? `/v1/category/${category.id}`
        : '/v1/category';

      const method = category ? 'PUT' : 'POST';
      const response = await fetch(import.meta.env.VITE_APP_DOMAIN + url,{
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save category');
      onClose();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {category ? 'Редактировать категорию' : 'Новая категория'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Описание
            </label>
            <input
              type="text"
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}