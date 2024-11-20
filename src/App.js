import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import MapComponent from './components/Map/MapComponent';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import AdminPanel from './components/Admin/AdminPanel';
import UserProfile from './components/Profile/UserProfile';
import HomePage from './components/Home/HomePage';
import MarkersList from './components/Markers/MarkersList';
import { useAuthStore } from './store/authStore';
import { useEffect } from "react";
const queryClient = new QueryClient();
function ProtectedRoute({ children, requiredRole = 'user' }) {
    const { user, isAuthenticated } = useAuthStore();
    if (isAuthenticated === false) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requiredRole === 'admin' && user?.role !== 'admin' && user != null) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
export default function App() {
    const { isAuthenticated, checkAuthStatus } = useAuthStore();
    useEffect(() => {
        checkAuthStatus;
    }, [checkAuthStatus]);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/map", element: _jsx(MapComponent, {}) }), _jsx(Route, { path: "/markers", element: _jsx(MarkersList, {}) }), _jsx(Route, { path: "/login", element: isAuthenticated ? _jsx(Navigate, { to: "", replace: true }) : (_jsx("div", { className: "min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-md w-full", children: _jsx(LoginForm, {}) }) })) }), _jsx(Route, { path: "/register", element: isAuthenticated ? _jsx(Navigate, { to: "/map", replace: true }) : (_jsx("div", { className: "min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-md w-full", children: _jsx(RegisterForm, {}) }) })) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(UserProfile, {}) }) }) }), _jsx(Route, { path: "/admin/*", element: _jsx(ProtectedRoute, { requiredRole: "admin", children: _jsx(AdminPanel, {}) }) })] }) }), _jsx(Toaster, { position: "top-right" })] }) }) }));
}
