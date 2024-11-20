import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCategoriesStore } from '../../store/categoriesStore';
import {useEffect, useState} from "react";

const markerSchema = z.object({
  name: z.string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  description: z.string()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(1000, 'Описание не должно превышать 1000 символов'),
  category: z.string().min(1, 'Выберите категорию'),
});

type MarkerFormData = z.infer<typeof markerSchema>;

interface MarkerFormProps {
  position: [number, number];
  onSubmit: (data: MarkerFormData) => Promise<void>;
  onCancel: () => void;
}

export default function MarkerForm({ position, onSubmit, onCancel }: MarkerFormProps) {
  // const { fetchCategory, categories } = useCategoriesStore();
  const [categories, setCategories] = useState([]);
  async function set(){
    const request = await (await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category`)).json()
    console.log(request)
    setCategories(request)
  }
  useEffect(() => {
    set().then(r => console.log(categories))
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<MarkerFormData>({
    resolver: zodResolver(markerSchema),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Новая метка
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Название
          </label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.title && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.title.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.description.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Категория
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Выберите категорию</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.category.message}
            </motion.p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Отмена
          </motion.button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Создание...' : 'Создать'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}