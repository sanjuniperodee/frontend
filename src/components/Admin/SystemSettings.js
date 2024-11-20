import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save } from 'lucide-react';
const settingsSchema = z.object({
    siteName: z.string().min(2, 'Минимум 2 символа'),
    defaultZoom: z.number().min(1).max(20),
    defaultCenter: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    }),
    requireModeration: z.boolean(),
    maxMarkersPerUser: z.number().min(1),
    allowComments: z.boolean(),
    allowRatings: z.boolean(),
});
export default function SystemSettings() {
    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await fetch('/api/settings');
            if (!response.ok)
                throw new Error('Failed to fetch settings');
            return response.json();
        },
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: settings,
    });
    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error('Failed to save settings');
            return response.json();
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("div", { className: "text-gray-600", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." }) }));
    }
    return (_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u044B" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0440\u0430\u0431\u043E\u0442\u044B \u0441\u0430\u0439\u0442\u0430" })] }), _jsx("div", { className: "border-t border-gray-200 px-4 py-5 sm:px-6", children: _jsxs("form", { onSubmit: handleSubmit((data) => mutation.mutate(data)), className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u0430\u0439\u0442\u0430" }), _jsx("input", { type: "text", ...register('siteName'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" }), errors.siteName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.siteName.message }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041C\u0430\u0441\u0448\u0442\u0430\u0431 \u043A\u0430\u0440\u0442\u044B \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E" }), _jsx("input", { type: "number", ...register('defaultZoom', { valueAsNumber: true }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" }), errors.defaultZoom && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.defaultZoom.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C \u043C\u0435\u0442\u043E\u043A \u043D\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }), _jsx("input", { type: "number", ...register('maxMarkersPerUser', { valueAsNumber: true }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" }), errors.maxMarkersPerUser && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.maxMarkersPerUser.message }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0428\u0438\u0440\u043E\u0442\u0430 \u0446\u0435\u043D\u0442\u0440\u0430 \u043A\u0430\u0440\u0442\u044B" }), _jsx("input", { type: "number", step: "any", ...register('defaultCenter.lat', { valueAsNumber: true }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0414\u043E\u043B\u0433\u043E\u0442\u0430 \u0446\u0435\u043D\u0442\u0440\u0430 \u043A\u0430\u0440\u0442\u044B" }), _jsx("input", { type: "number", step: "any", ...register('defaultCenter.lng', { valueAsNumber: true }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", ...register('requireModeration'), className: "h-4 w-4 text-blue-600 rounded border-gray-300" }), _jsx("label", { className: "ml-2 block text-sm text-gray-700", children: "\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u044C \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044E \u0434\u043B\u044F \u043D\u043E\u0432\u044B\u0445 \u043C\u0435\u0442\u043E\u043A" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", ...register('allowComments'), className: "h-4 w-4 text-blue-600 rounded border-gray-300" }), _jsx("label", { className: "ml-2 block text-sm text-gray-700", children: "\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", ...register('allowRatings'), className: "h-4 w-4 text-blue-600 rounded border-gray-300" }), _jsx("label", { className: "ml-2 block text-sm text-gray-700", children: "\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043E\u0446\u0435\u043D\u043A\u0438 \u043C\u0435\u0442\u043E\u043A" })] })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700", disabled: mutation.isPending, children: [_jsx(Save, { className: "h-5 w-5 mr-2" }), mutation.isPending ? 'Сохранение...' : 'Сохранить настройки'] }) })] }) })] }));
}
