import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useCategories } from '../../hooks/useCategories';
import { useMarkersStore } from '../../store/markersStore';
import { useModerationStore } from '../../store/moderationStore';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import MapModal from './MapModal'; // Import the modal component for the map
export default function MarkerManagement() {
    const queryClient = useQueryClient();
    const { categories } = useCategories();
    const { markers, approveMarker: approveMarkerInStore, fetchMarkers, connectToWebSocket, deleteMarker: deleteMarkerInStore, } = useMarkersStore();
    const { queue } = useModerationStore();
    const [currentPage, setCurrentPage] = useState(1);
    const markersPerPage = 10;
    const [selectedMarker, setSelectedMarker] = useState(null); // State for modal
    useEffect(() => {
        connectToWebSocket();
        fetchMarkers(true);
    }, []);
    const allMarkers = [
        ...markers,
        ...queue
            .filter((item) => item.type === 'marker')
            .map((item) => item.content)
            .filter((marker) => !markers.some((m) => m.id === marker.id)),
    ];
    const totalPages = Math.ceil(allMarkers.length / markersPerPage);
    const paginatedMarkers = allMarkers.slice((currentPage - 1) * markersPerPage, currentPage * markersPerPage);
    const approveMarker = useMutation({
        mutationFn: async (markerId) => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/approve/${markerId}`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    throw new Error('Failed to approve marker');
                }
                approveMarkerInStore(markerId);
            }
            catch (error) {
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
        mutationFn: async (markerId) => {
            deleteMarkerInStore(markerId);
            return markerId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['markers'] });
        },
    });
    return (_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6", children: _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u0435\u0442\u043A\u0430\u043C\u0438" }) }), _jsx("div", { className: "border-t border-gray-200", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0430\u0442\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: paginatedMarkers.map((marker) => (_jsxs("tr", { children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: marker.name }), _jsxs("div", { className: "text-sm text-gray-500", children: [marker.description.substring(0, 50), "..."] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800", children: categories.find((c) => c.id === marker.category)?.name ||
                                                'Без категории' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${marker.approved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'}`, children: marker.approved ? 'Одобрено' : 'На модерации' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: format(new Date(marker.createdAt), 'dd.MM.yyyy') }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setSelectedMarker(marker), className: "text-blue-600 hover:text-blue-900", children: _jsx(MapPin, { className: "h-5 w-5" }) }), !marker.approved && (_jsx("button", { onClick: () => approveMarker.mutate(marker.id), className: "text-green-600 hover:text-green-900", children: _jsx(Check, { className: "h-5 w-5" }) })), _jsx("button", { onClick: () => deleteMarker.mutate(marker.id), className: "text-red-600 hover:text-red-900", children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, marker.id))) })] }) }), totalPages > 1 && (_jsx("div", { className: "mt-4 flex justify-center mb-8", children: _jsxs("nav", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u041D\u0430\u0437\u0430\u0434" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: page }, page))), _jsx("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] }) })), selectedMarker && (_jsx(MapModal, { marker: selectedMarker, onClose: () => setSelectedMarker(null) }))] }));
}
