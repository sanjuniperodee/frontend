import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AlertTriangle, Info } from 'lucide-react';
// Mock data for development
const mockLogs = [
    {
        id: '1',
        type: 'info',
        message: 'Пользователь вошел в систему',
        userId: '1',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        type: 'warning',
        message: 'Попытка доступа к защищенному ресурсу',
        userId: '2',
        createdAt: new Date(Date.now() - 3600000).toISOString()
    }
];
export default function LogViewer() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['logs'],
        queryFn: async () => {
            // Return mock data for development
            return Promise.resolve(mockLogs);
        },
    });
    const getLogIcon = (type) => {
        switch (type) {
            case 'warning':
                return _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-500" });
            case 'error':
                return _jsx(AlertTriangle, { className: "h-5 w-5 text-red-500" });
            default:
                return _jsx(Info, { className: "h-5 w-5 text-blue-500" });
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx("div", { className: "text-gray-600", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043B\u043E\u0433\u043E\u0432..." }) }));
    }
    return (_jsxs("div", { className: "bg-white shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0435 \u043B\u043E\u0433\u0438" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0422\u0438\u043F" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0430\u0442\u0430" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: logs?.map((log) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "flex items-center", children: getLogIcon(log.type) }) }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm text-gray-900", children: log.message }), log.metadata && (_jsx("pre", { className: "mt-1 text-xs text-gray-500 overflow-x-auto", children: JSON.stringify(log.metadata, null, 2) }))] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: log.userId || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm:ss') })] }, log.id))) })] }) })] }));
}
