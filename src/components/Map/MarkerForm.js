import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from "react";
const markerSchema = z.object({
    name: z.string()
        .min(3, 'Название должно содержать минимум 3 символа')
        .max(100, 'Название не должно превышать 100 символов'),
    description: z.string()
        .min(10, 'Описание должно содержать минимум 10 символов')
        .max(1000, 'Описание не должно превышать 1000 символов'),
    category: z.string().min(1, 'Выберите категорию'),
});
export default function MarkerForm({ position, onSubmit, onCancel }) {
    // const { fetchCategory, categories } = useCategoriesStore();
    const [categories, setCategories] = useState([]);
    async function set() {
        const request = await (await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category`)).json();
        console.log(request);
        setCategories(request);
    }
    useEffect(() => {
        set().then(r => console.log(categories));
    }, []);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(markerSchema),
    });
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "\u041D\u043E\u0432\u0430\u044F \u043C\u0435\u0442\u043A\u0430" }), _jsx("button", { onClick: onCancel, className: "text-gray-400 hover:text-gray-500 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" }), _jsx("input", { type: "text", ...register('name'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" }), errors.title && (_jsx(motion.p, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "mt-1 text-sm text-red-600", children: errors.title.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("textarea", { ...register('description'), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors" }), errors.description && (_jsx(motion.p, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "mt-1 text-sm text-red-600", children: errors.description.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F" }), _jsxs("select", { ...register('category'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors", children: [_jsx("option", { value: "", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E" }), categories?.map((category) => (_jsx("option", { value: category.id, children: category.name }, category.id)))] }), errors.category && (_jsx(motion.p, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "mt-1 text-sm text-red-600", children: errors.category.message }))] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(motion.button, { type: "button", onClick: onCancel, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors", children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx(motion.button, { type: "submit", disabled: isSubmitting, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors", children: isSubmitting ? 'Создание...' : 'Создать' })] })] })] }));
}
