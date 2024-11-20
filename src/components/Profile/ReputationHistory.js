import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';
export default function ReputationHistory() {
    const { data: history, isLoading, isError } = useQuery({
        queryKey: ['reputation-history'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include auth token if required
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reputation history');
            }
            return response.json();
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx("div", { className: "text-gray-600", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0438\u0441\u0442\u043E\u0440\u0438\u0438..." }) }));
    }
    return (_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6", children: _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0440\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u0438" }) }), _jsx("div", { className: "border-t border-gray-200", children: _jsx("ul", { className: "divide-y divide-gray-200", children: history?.map((event) => (_jsx("li", { className: "px-4 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [event.points > 0 ? (_jsx(TrendingUp, { className: "h-5 w-5 text-green-500 mr-2" })) : (_jsx(TrendingDown, { className: "h-5 w-5 text-red-500 mr-2" })), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: event.reason }), _jsx("p", { className: "text-sm text-gray-500", children: format(new Date(event.createdAt), 'dd.MM.yyyy HH:mm') })] })] }), _jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.points > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'}`, children: [event.points > 0 ? '+' : '', event.points, " \u043E\u0447\u043A\u043E\u0432"] })] }) }, event.id))) }) })] }));
}
