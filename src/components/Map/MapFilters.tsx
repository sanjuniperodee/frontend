import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarkersStore } from '../../store/markersStore';

export default function MapFilters() {
  const { categories } = useCategories();
  const { setFilters } = useMarkersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [minRating, setMinRating] = useState<number>(0);

  const handleApplyFilters = () => {
    setFilters({
      categories: selectedCategories,
      dateRange,
      rating: minRating,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setDateRange([null, null]);
    setMinRating(0);
    setFilters({
      categories: [],
      dateRange: [null, null],
      rating: null,
    });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
      >
        <Filter className="h-6 w-6 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категории
                </label>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((id) => id !== category.id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Минимальный рейтинг
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 text-center">
                  {minRating} и выше
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Период
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange[0]?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setDateRange([new Date(e.target.value), dateRange[1]])}
                    className="block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="date"
                    value={dateRange[1]?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setDateRange([dateRange[0], new Date(e.target.value)])}
                    className="block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Сбросить
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}