import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, MapPin, Upload, Award, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReputationBadges from './ReputationBadges';
import ReputationHistory from './ReputationHistory';
import { mockApi } from '../../utils/mockApi.ts';
import toast from 'react-hot-toast';
export default function UserProfile() {
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [isUploading, setIsUploading] = useState(false);
    // Fetch user markers
    const { data: userMarkers = [], isLoading } = useQuery({
        queryKey: ['user-markers'],
        queryFn: () => mockApi.markers.getByUser(user?.id),
    });
    // Mutation for deleting a marker
    const deleteMarker = useMutation({
        mutationFn: async (markerId) => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/delete/${markerId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Failed to delete marker');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-markers'] });
            toast.success('Метка удалена');
        },
        onError: () => {
            toast.error('Ошибка при удалении метки');
        },
    });
    // Mutation for uploading avatar
    const uploadAvatar = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/upload-avatar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Ошибка при загрузке аватара');
            }
            return response;
        },
        onSuccess: (data) => {
            toast.success('Аватар успешно загружен');
            location.reload();
        },
        onSettled: () => {
            setIsUploading(false); // Reset upload state
        },
    });
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setIsUploading(true);
        uploadAvatar.mutate(file);
    };
    if (!user) {
        return (_jsx("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: _jsx("div", { className: "bg-white shadow sm:rounded-lg p-6", children: _jsx("p", { className: "text-gray-500 text-center", children: "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443" }) }) }));
    }
    return (_jsx("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "\u041B\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("button", { onClick: () => setActiveTab('profile'), className: `px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'profile'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsx(User, { className: "inline-block h-5 w-5 mr-1" }), "\u041F\u0440\u043E\u0444\u0438\u043B\u044C"] }), _jsxs("button", { onClick: () => setActiveTab('reputation'), className: `px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'reputation'
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsx(Award, { className: "inline-block h-5 w-5 mr-1" }), "\u0420\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044F"] })] })] }) }), activeTab === 'profile' && (_jsx("div", { className: "bg-white shadow sm:rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsxs("div", { className: "flex items-center space-x-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden", children: user.avatar ? (_jsx("img", { src: `${import.meta.env.VITE_APP_DOMAIN}${user.avatar}`, alt: "", className: "h-full w-full object-cover" })) : (_jsx("span", { className: "text-2xl text-gray-500", children: user.login })) }), _jsxs("label", { htmlFor: "avatar-upload", className: "absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer", children: [_jsx(Upload, { className: "h-4 w-4 text-gray-600" }), _jsx("input", { id: "avatar-upload", type: "file", className: "hidden", accept: "image/*", onChange: handleAvatarChange, disabled: isUploading })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }), _jsx("div", { className: "mt-1 text-sm text-gray-900", children: user.login })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0420\u043E\u043B\u044C" }), _jsx("div", { className: "mt-1", children: _jsx("span", { className: "px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800", children: user.role }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u0414\u0430\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438" }), _jsx("div", { className: "mt-1 text-sm text-gray-900", children: format(new Date(user.createdAt), 'dd.MM.yyyy') })] })] })] }), _jsxs("div", { className: "mt-8", children: [_jsx("h4", { className: "text-lg font-medium text-gray-900 mb-4", children: "\u041C\u043E\u0438 \u043C\u0435\u0442\u043A\u0438" }), isLoading ? (_jsx("p", { className: "text-gray-500", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043C\u0435\u0442\u043E\u043A..." })) : userMarkers.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: userMarkers.map((marker) => (_jsxs("div", { className: "border rounded-lg p-4 flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-medium", children: marker.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: marker.description }), _jsxs("div", { className: "mt-2 flex items-center text-sm text-gray-500", children: [_jsx(MapPin, { className: "h-4 w-4 mr-1" }), marker.latitude.toFixed(4), ", ", marker.longitude.toFixed(4)] })] }), _jsx("button", { onClick: () => deleteMarker.mutate(marker.id), className: "text-red-600 hover:text-red-800", children: _jsx(Trash2, { className: "h-5 w-5" }) })] }, marker.id))) })) : (_jsx("p", { className: "text-gray-500", children: "\u0423 \u0432\u0430\u0441 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043C\u0435\u0442\u043E\u043A \u043D\u0430 \u043A\u0430\u0440\u0442\u0435" }))] })] }) })), activeTab === 'reputation' && (_jsxs(_Fragment, { children: [_jsx(ReputationBadges, {}), _jsx(ReputationHistory, {})] }))] }) }));
}
