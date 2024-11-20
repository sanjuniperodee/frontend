import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
export default function CategoryManagement() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;
    async function fetchData() {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category`);
            if (!response.ok)
                throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    const deleteCategory = useMutation({
        mutationFn: async (categoryId) => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category/${categoryId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok)
                throw new Error('Failed to delete category');
            await fetchData();
        },
    });
    // Pagination logic
    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    const paginatedCategories = categories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u043C\u0438" }), _jsxs("button", { onClick: () => {
                                    setEditingCategory(null);
                                    setIsFormOpen(true);
                                }, className: "flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: [_jsx(Plus, { className: "h-5 w-5 mr-2" }), "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E"] })] }), _jsx("div", { className: "border-t border-gray-200", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: paginatedCategories.map((category) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: category.name }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500", children: category.description }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => {
                                                                setEditingCategory(category);
                                                                setIsFormOpen(true);
                                                            }, className: "text-blue-600 hover:text-blue-900", children: _jsx(Edit2, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => deleteCategory.mutate(category.id), className: "text-red-600 hover:text-red-900", children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, category.id))) })] }) })] }), _jsx("div", { className: "mt-4 flex justify-center", children: _jsxs("nav", { className: "flex items-center space-x-2 mb-8", children: [_jsx("button", { onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)), disabled: currentPage === 1, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u041D\u0430\u0437\u0430\u0434" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: page }, page))), _jsx("button", { onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] }) }), isFormOpen && (_jsx(CategoryForm, { category: editingCategory, onClose: () => {
                    fetchData();
                    setIsFormOpen(false);
                    setEditingCategory(null);
                } }))] }));
}
