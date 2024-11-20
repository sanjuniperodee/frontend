import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import CommentList from '../Comments/CommentList';
import { useAuthStore } from '../../store/authStore';
import { useMarkers } from '../../hooks/useMarkers';
import { toast } from 'react-hot-toast';
export default function MarkerPopup({ marker, onClose }) {
    const { user } = useAuthStore();
    const [showComments, setShowComments] = useState(false);
    const { rateMarker } = useMarkers();
    const handleRate = async (rating) => {
        if (!user) {
            toast.error('Войдите, чтобы оценить метку');
            return;
        }
        try {
            await rateMarker.mutateAsync({ markerId: marker.id, rating });
        }
        catch (error) {
            console.log(error);
            toast.error('Ошибка при оценке метки');
        }
    };
    return (_jsxs("div", { className: "relative p-4 min-w-[300px]", children: [_jsx("button", { onClick: onClose, className: "absolute top-2 right-2 text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) }), _jsx("h3", { className: "text-lg font-semibold mb-2 pr-8", children: marker.name }), _jsx("p", { className: "text-gray-600 mb-4", children: marker.description }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => handleRate(1), className: "flex items-center text-gray-600 hover:text-green-600", disabled: !user, children: _jsx(ThumbsUp, { className: "h-4 w-4 mr-1" }) }), _jsx("span", { className: "text-sm font-medium", children: marker.rating }), _jsx("button", { onClick: () => handleRate(-1), className: "flex items-center text-gray-600 hover:text-red-600", disabled: !user, children: _jsx(ThumbsDown, { className: "h-4 w-4 mr-1" }) })] }), _jsxs("button", { onClick: () => setShowComments(!showComments), className: "flex items-center text-gray-600 hover:text-blue-600", children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-1" }), _jsx("span", { className: "text-sm", children: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438" })] })] }), showComments && (_jsx("div", { className: "mt-4 border-t pt-4", children: _jsx(CommentList, { markerId: marker.id }) }))] }));
}
