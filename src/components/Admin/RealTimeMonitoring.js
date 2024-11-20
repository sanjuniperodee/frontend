import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Activity, Users, MapPin, MessageSquare } from 'lucide-react';
export default function RealTimeMonitoring() {
    const socket = useSocket();
    const [recentActivity, setRecentActivity] = useState([]);
    const [stats, setStats] = useState({
        activeUsers: 0,
        markersCreated: 0,
        commentsAdded: 0,
    });
    useEffect(() => {
        if (!socket)
            return;
        socket.on('activity', (event) => {
            setRecentActivity((prev) => [event, ...prev].slice(0, 50));
        });
        socket.on('stats:update', (newStats) => {
            setStats(newStats);
        });
        return () => {
            socket.off('activity');
            socket.off('stats:update');
        };
    }, [socket]);
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-6 w-6 text-blue-500 mr-2" }), _jsx("span", { className: "text-2xl font-semibold text-blue-600", children: stats.activeUsers })] }), _jsx("p", { className: "mt-1 text-sm text-blue-600", children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-6 w-6 text-green-500 mr-2" }), _jsx("span", { className: "text-2xl font-semibold text-green-600", children: stats.markersCreated })] }), _jsx("p", { className: "mt-1 text-sm text-green-600", children: "\u041D\u043E\u0432\u044B\u0445 \u043C\u0435\u0442\u043E\u043A" })] }), _jsxs("div", { className: "p-4 bg-purple-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(MessageSquare, { className: "h-6 w-6 text-purple-500 mr-2" }), _jsx("span", { className: "text-2xl font-semibold text-purple-600", children: stats.commentsAdded })] }), _jsx("p", { className: "mt-1 text-sm text-purple-600", children: "\u041D\u043E\u0432\u044B\u0445 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432" })] })] })] }), _jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "\u041B\u0435\u043D\u0442\u0430 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438" }), _jsx("div", { className: "space-y-4 max-h-96 overflow-auto", children: recentActivity.map((event) => (_jsxs("div", { className: "flex items-start space-x-3 p-3 bg-gray-50 rounded-lg", children: [_jsx(Activity, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-900", children: event.details }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(event.timestamp).toLocaleTimeString() })] })] }, event.id))) })] })] }));
}
