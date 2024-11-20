import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useMarkersStore } from '../../store/markersStore';
export default function MapFilters() {
    const { categories } = useCategories();
    const { setFilters } = useMarkersStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [minRating, setMinRating] = useState(0);
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
    return (_jsxs("div", { className: "absolute top-4 right-4 z-[1000]", children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "bg-white p-2 rounded-full shadow-lg hover:bg-gray-50", children: _jsx(Filter, { className: "h-6 w-6 text-gray-600" }) }), isOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "\u0424\u0438\u043B\u044C\u0442\u0440\u044B" }), _jsx("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-gray-500", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438" }), _jsx("div", { className: "space-y-2", children: categories?.map((category) => (_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: selectedCategories.includes(category.id), onChange: (e) => {
                                                            if (e.target.checked) {
                                                                setSelectedCategories([...selectedCategories, category.id]);
                                                            }
                                                            else {
                                                                setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
                                                            }
                                                        }, className: "h-4 w-4 text-blue-600 rounded border-gray-300" }), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: category.name })] }, category.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0435\u0439\u0442\u0438\u043D\u0433" }), _jsx("input", { type: "range", min: "0", max: "5", step: "1", value: minRating, onChange: (e) => setMinRating(Number(e.target.value)), className: "w-full" }), _jsxs("div", { className: "text-sm text-gray-500 text-center", children: [minRating, " \u0438 \u0432\u044B\u0448\u0435"] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u041F\u0435\u0440\u0438\u043E\u0434" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { type: "date", value: dateRange[0]?.toISOString().split('T')[0] || '', onChange: (e) => setDateRange([new Date(e.target.value), dateRange[1]]), className: "block w-full rounded-md border-gray-300 shadow-sm" }), _jsx("input", { type: "date", value: dateRange[1]?.toISOString().split('T')[0] || '', onChange: (e) => setDateRange([dateRange[0], new Date(e.target.value)]), className: "block w-full rounded-md border-gray-300 shadow-sm" })] })] }), _jsxs("div", { className: "flex justify-between pt-4", children: [_jsx("button", { onClick: handleReset, className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C" }), _jsx("button", { onClick: handleApplyFilters, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700", children: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C" })] })] })] }) }))] }));
}
