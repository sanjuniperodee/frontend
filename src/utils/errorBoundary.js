import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false,
                error: null,
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center px-4", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-6", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx(AlertTriangle, { className: "h-12 w-12 text-red-500" }) }), _jsx("h1", { className: "text-xl font-bold text-center text-gray-900 mb-4", children: "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0438\u043B\u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435." }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443" }) })] }) }));
        }
        return this.props.children;
    }
}
