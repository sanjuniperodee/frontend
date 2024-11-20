import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Activity, TrendingUp, MapPin, Users } from 'lucide-react';
export default function AdvancedAnalytics() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['advanced-analytics'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/statistics`);
            if (!response.ok) {
                throw new Error('Failed to fetch analytics data');
            }
            return response.json();
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("div", { className: "text-gray-600", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0438..." }) }));
    }
    if (isError) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("div", { className: "text-gray-600", children: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0438" }) }));
    }
    return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Users, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { className: "ml-5", children: [_jsx("div", { className: "text-xl font-semibold text-gray-900", children: data.totalUsers }), _jsx("div", { className: "text-sm text-gray-500", children: "\u0412\u0441\u0435\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" })] })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(MapPin, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { className: "ml-5", children: [_jsx("div", { className: "text-xl font-semibold text-gray-900", children: data.totalMarkers }), _jsx("div", { className: "text-sm text-gray-500", children: "\u0412\u0441\u0435\u0433\u043E \u043C\u0435\u0442\u043E\u043A" })] })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Activity, { className: "h-6 w-6 text-purple-600" }) }), _jsxs("div", { className: "ml-5", children: [_jsx("div", { className: "text-xl font-semibold text-gray-900", children: data.totalActionsForYear }), _jsx("div", { className: "text-sm text-gray-500", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0437\u0430 \u0433\u043E\u0434" })] })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(TrendingUp, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { className: "ml-5", children: [_jsx("div", { className: "text-xl font-semibold text-gray-900", children: Math.round(data.averageReputation) }), _jsx("div", { className: "text-sm text-gray-500", children: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F \u0440\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044F" })] })] }) }) })] }) }));
}
