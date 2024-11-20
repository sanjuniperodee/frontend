import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Shield, Copy } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
export default function TwoFactorSetup() {
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);
    const setupMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
            });
            if (!response.ok)
                throw new Error('Failed to setup 2FA');
            return response.json();
        },
        onSuccess: (data) => {
            setQrCode(data.qrCode);
            setSecret(data.secret);
        },
    });
    const verifyMutation = useMutation({
        mutationFn: async (code) => {
            const response = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            if (!response.ok)
                throw new Error('Invalid verification code');
            return response.json();
        },
        onSuccess: () => {
            setIsEnabled(true);
        },
    });
    const copyToClipboard = () => {
        navigator.clipboard.writeText(secret);
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Shield, { className: "h-6 w-6 text-blue-600 mr-2" }), _jsx("h2", { className: "text-xl font-semibold", children: "\u0414\u0432\u0443\u0445\u0444\u0430\u043A\u0442\u043E\u0440\u043D\u0430\u044F \u0430\u0443\u0442\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F" })] }), !isEnabled ? (_jsx("div", { className: "space-y-6", children: !qrCode ? (_jsx("button", { onClick: () => setupMutation.mutate(), className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C 2FA" })) : (_jsx(_Fragment, { children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-center", children: _jsx("img", { src: qrCode, alt: "QR Code", className: "w-48 h-48" }) }), _jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded", children: [_jsx("code", { className: "text-sm", children: secret }), _jsx("button", { onClick: copyToClipboard, className: "p-1 hover:bg-gray-200 rounded", children: _jsx(Copy, { className: "h-4 w-4 text-gray-600" }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "\u041A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F" }), _jsx("input", { type: "text", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm", placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434 \u0438\u0437 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F" })] }), _jsx("button", { onClick: () => verifyMutation.mutate(verificationCode), className: "w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700", children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C" })] }) })) })) : (_jsx("div", { className: "text-center py-4", children: _jsx("div", { className: "text-green-600 font-medium", children: "2FA \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430" }) }))] }));
}
