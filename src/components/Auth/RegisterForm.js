import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const registerSchema = z.object({
    username: z.string().min(3, 'Минимум 3 символа'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});
export default function RegisterForm() {
    const { register: registerUser } = useAuthStore();
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const onSubmit = async (data) => {
        try {
            setError(null);
            await registerUser(data.username, data.password);
        }
        catch (error) {
            setError('Ошибка при регистрации. Попробуйте другое имя пользователя.');
        }
    };
    return (_jsxs("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [_jsxs("div", { className: "mb-6 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500", children: "\u0412\u043E\u0439\u0442\u0438" })] })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }), _jsx("input", { type: "text", ...register('username'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), errors.username && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.username.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041F\u0430\u0440\u043E\u043B\u044C" }), _jsx("input", { type: "password", ...register('password'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F" }), _jsx("input", { type: "password", ...register('confirmPassword'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), errors.confirmPassword && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword.message }))] }), error && (_jsx("div", { className: "rounded-md bg-red-50 p-4", children: _jsxs("div", { className: "flex", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-400" }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })] }) })), _jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50", children: isSubmitting ? 'Регистрация...' : 'Зарегистрироваться' })] })] }));
}
