import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Marker } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useMarkersStore } from '../../store/markersStore';
import { useModerationStore } from '../../store/moderationStore';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import MapModal from './MapModal'; // Import the modal component for the map

export default function MarkerManagement() {
  const queryClient = useQueryClient();
  const { categories } = useCategories();
  const {
    markers,
    approveMarker: approveMarkerInStore,
    fetchMarkers,
    connectToWebSocket,
    deleteMarker: deleteMarkerInStore,
  } = useMarkersStore();
  const { queue } = useModerationStore();

  const [currentPage, setCurrentPage] = useState(1);
  const markersPerPage = 10;
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null); // State for modal

  useEffect(() => {
    connectToWebSocket();
    fetchMarkers(true);
  }, []);

  const allMarkers = [
    ...markers,
    ...queue
        .filter((item) => item.type === 'marker')
        .map((item) => item.content as Marker)
        .filter((marker) => !markers.some((m) => m.id === marker.id)),
  ];

  const totalPages = Math.ceil(allMarkers.length / markersPerPage);
  const paginatedMarkers = allMarkers.slice(
      (currentPage - 1) * markersPerPage,
      currentPage * markersPerPage
  );

  const approveMarker = useMutation({
    mutationFn: async (markerId: string) => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
            `${import.meta.env.VITE_APP_DOMAIN}/v1/marker/approve/${markerId}`,
            {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (!response.ok) {
          throw new Error('Failed to approve marker');
        }
        approveMarkerInStore(markerId);
      } catch (error) {
        console.error('Error approving marker:', error);
        toast.error('Не удалось одобрить метку');
      }
      return markerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
      toast.success('Метка одобрена');
    },
  });

  const deleteMarker = useMutation({
    mutationFn: async (markerId: string) => {
      deleteMarkerInStore(markerId);
      return markerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markers'] });
    },
  });

  return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Управление метками
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата создания
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {paginatedMarkers.map((marker) => (
                <tr key={marker.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {marker.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {marker.description.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {categories.find((c) => c.id === marker.category)?.name ||
                        'Без категории'}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          marker.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {marker.approved ? 'Одобрено' : 'На модерации'}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(marker.createdAt), 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                          onClick={() => setSelectedMarker(marker)} // Set the selected marker
                          className="text-blue-600 hover:text-blue-900"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                      {!marker.approved && (
                          <button
                              onClick={() => approveMarker.mutate(marker.id)}
                              className="text-green-600 hover:text-green-900"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                      )}
                      <button
                          onClick={() => deleteMarker.mutate(marker.id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="mt-4 flex justify-center mb-8">
              <nav className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Вперед
                </button>
              </nav>
            </div>
        )}

        {/* Map Modal */}
        {selectedMarker && (
            <MapModal
                marker={selectedMarker}
                onClose={() => setSelectedMarker(null)}
            />
        )}
      </div>
  );
}
