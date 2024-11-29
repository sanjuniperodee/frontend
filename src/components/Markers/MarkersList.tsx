import {useEffect, useState} from 'react';
import { useMarkers } from '../../hooks/useMarkers';
import { useCategories } from '../../hooks/useCategories';
import { Search, Filter } from 'lucide-react';
import MarkerPopup from '../Map/MarkerPopup.tsx';
import { Marker } from '../../types';

export default function MarkersList() {
  useEffect(() => {
    connectToWebSocket()
    fetchMarkers()
  }, []);
  const { markers, fetchMarkers, connectToWebSocket } = useMarkers();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const markersPerPage = 10;

  // Filter markers
  const filteredMarkers = markers.filter(marker => {
    const matchesSearch = marker.name?.toLowerCase().includes(search.toLowerCase()) ||
                         marker.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || marker.category === selectedCategory;
    const approved = marker.approved;
    return matchesSearch && matchesCategory && approved;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMarkers.length / markersPerPage);
  const paginatedMarkers = filteredMarkers.slice(
    (currentPage - 1) * markersPerPage,
    currentPage * markersPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Поиск меток..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Markers List */}
      <div className="bg-white shadow rounded-lg">
        <div className="divide-y divide-gray-200">
          {paginatedMarkers.map((marker) => (
            <div
              key={marker.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedMarker(marker)}
            >
              <h3 className="text-lg font-medium text-gray-900">{marker.name}</h3>
              <p className="mt-1 text-gray-500">{marker.description}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {categories.find(c => c.id === marker.category)?.name}
                </span>
                <span className="ml-4">Рейтинг: {marker.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Вперед
            </button>
          </nav>
        </div>
      )}

      {/* Marker Details Modal */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <MarkerPopup
              marker={selectedMarker}
              onClose={() => setSelectedMarker(null)}
              fetchMarkers={() => fetchMarkers()}
            />
          </div>
        </div>
      )}
    </div>
  );
}