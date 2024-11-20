import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useMarkers } from '../../hooks/useMarkers';
import { useCategories } from '../../hooks/useCategories';
import { Search } from 'lucide-react';
import MarkerPopup from '../Map/MarkerPopup';
export default function MarkersList() {
    useEffect(() => {
        connectToWebSocket();
        fetchMarkers();
    }, []);
    const { markers, fetchMarkers, connectToWebSocket } = useMarkers();
    const { categories } = useCategories();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMarker, setSelectedMarker] = useState(null);
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
    const paginatedMarkers = filteredMarkers.slice((currentPage - 1) * markersPerPage, currentPage * markersPerPage);
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "\u041F\u043E\u0438\u0441\u043A \u043C\u0435\u0442\u043E\u043A...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" })] }), _jsx("div", { className: "sm:w-64", children: _jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438" }), categories.map((category) => (_jsx("option", { value: category.id, children: category.name }, category.id)))] }) })] }), _jsx("div", { className: "bg-white shadow rounded-lg", children: _jsx("div", { className: "divide-y divide-gray-200", children: paginatedMarkers.map((marker) => (_jsxs("div", { className: "p-4 hover:bg-gray-50 cursor-pointer", onClick: () => setSelectedMarker(marker), children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: marker.name }), _jsx("p", { className: "mt-1 text-gray-500", children: marker.description }), _jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-500", children: [_jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded", children: categories.find(c => c.id === marker.category)?.name }), _jsxs("span", { className: "ml-4", children: ["\u0420\u0435\u0439\u0442\u0438\u043D\u0433: ", marker.rating] })] })] }, marker.id))) }) }), totalPages > 1 && (_jsx("div", { className: "mt-6 flex justify-center", children: _jsxs("nav", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => setCurrentPage(p => Math.max(1, p - 1)), disabled: currentPage === 1, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u041D\u0430\u0437\u0430\u0434" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: page }, page))), _jsx("button", { onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] }) })), selectedMarker && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: _jsx(MarkerPopup, { marker: selectedMarker, onClose: () => setSelectedMarker(null) }) }) }))] }));
}
