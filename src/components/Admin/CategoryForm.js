import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
const categorySchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    description: z.string().min(1, 'Напишите описание'),
});
export default function CategoryForm({ category, onClose }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: category || undefined,
    });
    const mutation = useMutation({
        mutationFn: async (data) => {
            const url = category
                ? `/v1/category/${category.id}`
                : '/v1/category';
            const method = category ? 'PUT' : 'POST';
            const response = await fetch(import.meta.env.VITE_APP_DOMAI + url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error('Failed to save category');
            onClose();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            onClose();
        },
    });
    return (_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: category ? 'Редактировать категорию' : 'Новая категория' }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-500", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit((data) => mutation.mutate(data)), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" }), _jsx("input", { type: "text", ...register('name'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" }), errors.name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("input", { type: "text", ...register('description'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" }), errors.description && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.description.message }))] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { type: "submit", className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700", disabled: mutation.isPending, children: mutation.isPending ? 'Сохранение...' : 'Сохранить' })] })] })] }) }));
}
