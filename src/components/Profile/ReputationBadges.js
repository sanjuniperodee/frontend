import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '../../store/authStore';
import { Trophy, Award, Star, Shield, Target } from 'lucide-react';
const REPUTATION_TIERS = {
    NOVICE: { min: 0, max: 99, icon: Star, color: 'text-gray-500' },
    CONTRIBUTOR: { min: 100, max: 499, icon: Award, color: 'text-blue-500' },
    EXPERT: { min: 500, max: 999, icon: Shield, color: 'text-purple-500' },
    MASTER: { min: 1000, max: Infinity, icon: Trophy, color: 'text-yellow-500' },
};
export default function ReputationBadges() {
    const { user } = useAuthStore();
    if (!user)
        return null;
    const getCurrentTier = (reputation) => {
        return Object.entries(REPUTATION_TIERS).find(([_, tier]) => reputation >= tier.min && reputation <= tier.max)?.[0];
    };
    const currentTier = getCurrentTier(user.reputation);
    const currentTierData = currentTier ? REPUTATION_TIERS[currentTier] : null;
    const TierIcon = currentTierData?.icon || Target;
    const getNextTier = (reputation) => {
        const tiers = Object.entries(REPUTATION_TIERS);
        const nextTier = tiers.find(([_, tier]) => reputation < tier.min);
        return nextTier ? {
            name: nextTier[0],
            ...nextTier[1],
            progress: ((reputation - currentTierData?.min) / (nextTier[1].min - currentTierData?.min)) * 100
        } : null;
    };
    const nextTier = getNextTier(user.reputation);
    return (_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6", children: _jsxs("h3", { className: "text-lg leading-6 font-medium text-gray-900 flex items-center", children: [_jsx(Trophy, { className: "h-5 w-5 text-yellow-500 mr-2" }), "\u0420\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u044F"] }) }), _jsx("div", { className: "border-t border-gray-200", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `p-3 rounded-full bg-gray-100 ${currentTierData?.color}`, children: _jsx(TierIcon, { className: "h-8 w-8" }) }), _jsxs("div", { children: [_jsxs("h4", { className: "text-lg font-medium text-gray-900", children: [currentTier, " (", user.reputation, " \u043E\u0447\u043A\u043E\u0432)"] }), nextTier && (_jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["\u0414\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F: ", nextTier.min - user.reputation, " \u043E\u0447\u043A\u043E\u0432"] }), _jsx("div", { className: "mt-1 relative pt-1", children: _jsx("div", { className: "overflow-hidden h-2 text-xs flex rounded bg-gray-200", children: _jsx("div", { style: { width: `${nextTier.progress}%` }, className: "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500" }) }) })] }))] })] }) }) })] }));
}
