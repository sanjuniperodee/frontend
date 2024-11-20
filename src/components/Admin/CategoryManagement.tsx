import { useMutation } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Category } from '../../types';
import CategoryForm from './CategoryForm';

export default function CategoryManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  async function fetchData() {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category/${categoryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete category');
      await fetchData();
    },
  });

  // Pagination logic
  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const paginatedCategories = categories.slice(
      (currentPage - 1) * categoriesPerPage,
      currentPage * categoriesPerPage
  );

  return (
      <div className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Управление категориями
            </h3>
            <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавить категорию
            </button>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                            onClick={() => {
                              setEditingCategory(category);
                              setIsFormOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => deleteCategory.mutate(category.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center">
          <nav className="flex items-center space-x-2 mb-8">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Назад
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
            ))}
            <button
                onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Вперед
            </button>
          </nav>
        </div>

        {isFormOpen && (
            <CategoryForm
                category={editingCategory}
                onClose={() => {
                  fetchData();
                  setIsFormOpen(false);
                  setEditingCategory(null);
                }}
            />
        )}
      </div>
  );
}
