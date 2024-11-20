import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Trophy, MapPin, MessageSquare, ThumbsUp } from 'lucide-react';
const achievementIcons = {
    markers: MapPin,
    comments: MessageSquare,
    ratings: ThumbsUp,
    special: Trophy,
};
export default function Achievements() {
    const { data: achievements, isLoading } = useQuery({
        queryKey: ['achievements'],
        queryFn: async () => {
            const response = await fetch('/api/user/achievements');
            if (!response.ok)
                throw new Error('Failed to fetch achievements');
            return response.json();
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx("div", { className: "text-gray-600", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0439..." }) }));
    }
    return (_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6", children: _jsxs("h3", { className: "text-lg leading-6 font-medium text-gray-900 flex items-center", children: [_jsx(Trophy, { className: "h-5 w-5 text-yellow-500 mr-2" }), "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"] }) }), _jsx("div", { className: "border-t border-gray-200", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4", children: achievements?.map((achievement) => {
                        const Icon = achievementIcons[achievement.category];
                        const isUnlocked = achievement.progress >= achievement.maxProgress;
                        return (_jsx("div", { className: `p-4 rounded-lg border ${isUnlocked
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'}`, children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `p-2 rounded-full ${isUnlocked ? 'bg-green-100' : 'bg-gray-200'}`, children: _jsx(Icon, { className: `h-6 w-6 ${isUnlocked ? 'text-green-600' : 'text-gray-500'}` }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: achievement.title }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: achievement.description }), !isUnlocked && (_jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "text-xs text-gray-500 mb-1", children: ["\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: ", achievement.progress, " / ", achievement.maxProgress] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-600 rounded-full h-2", style: {
                                                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                                            } }) })] })), achievement.unlockedAt && (_jsxs("div", { className: "mt-2 text-xs text-green-600", children: ["\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043E: ", new Date(achievement.unlockedAt).toLocaleDateString()] }))] })] }) }, achievement.id));
                    }) }) })] }));
}
