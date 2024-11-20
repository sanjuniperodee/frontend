import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { mockApi } from "../../utils/mockApi.ts";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const { data: users, isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: () => mockApi.users.getAll(),
    });
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_DOMAIN}`, {
            path: '/ws/user',
        });
        socket.on('userCreated', () => {
            console.log('A new user was created.');
            refetch(); // Refetch the users list
        });
        socket.on('userDeleted', () => {
            console.log('A user was deleted.');
            refetch(); // Refetch the users list
        });
        // Cleanup socket connection on unmount
        return () => {
            socket.disconnect();
        };
    }, [refetch]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx("div", { className: "text-gray-600", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439..." }) }));
    }
    // Pagination logic
    const totalPages = Math.ceil((users?.length || 0) / usersPerPage);
    const paginatedUsers = users?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    return (_jsxs("div", { className: "bg-white shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0420\u043E\u043B\u044C" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0430\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: paginatedUsers?.map((user) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center", children: user.avatar ? (_jsx("img", { src: user.avatar, alt: "", className: "h-10 w-10 rounded-full" })) : (_jsx("span", { className: "text-gray-500 text-sm", children: user.login.charAt(0).toUpperCase() })) }), _jsx("div", { className: "ml-4", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: user.login }) })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800", children: user.role }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: format(new Date(user.createdAt), 'dd.MM.yyyy') }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: [_jsx("button", { className: "text-indigo-600 hover:text-indigo-900 mr-4", children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C" }), _jsx("button", { className: "text-red-600 hover:text-red-900", children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })] })] }, user.id))) })] }) }), _jsx("div", { className: "mt-4 flex justify-center", children: _jsxs("nav", { className: "flex items-center space-x-2 mb-8", children: [_jsx("button", { onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)), disabled: currentPage === 1, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u041D\u0430\u0437\u0430\u0434" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: page }, page))), _jsx("button", { onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, className: "px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "\u0412\u043F\u0435\u0440\u0435\u0434" })] }) })] }));
}
