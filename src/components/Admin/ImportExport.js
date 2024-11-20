import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, Download, AlertTriangle } from 'lucide-react';
export default function ImportExport() {
    const [importFile, setImportFile] = useState(null);
    const [importError, setImportError] = useState('');
    const importMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/admin/import', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        },
        onError: (error) => {
            setImportError(error.message);
        },
    });
    const handleExport = async () => {
        try {
            const response = await fetch('/api/admin/export');
            if (!response.ok)
                throw new Error('Export failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `markers-export-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        catch (error) {
            console.error('Export error:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white shadow sm:rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u0418\u043C\u043F\u043E\u0440\u0442 \u0434\u0430\u043D\u043D\u044B\u0445" }), _jsx("div", { className: "mt-2 max-w-xl text-sm text-gray-500", children: _jsx("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043B JSON \u0438\u043B\u0438 CSV \u0441 \u043C\u0435\u0442\u043A\u0430\u043C\u0438 \u0434\u043B\u044F \u0438\u043C\u043F\u043E\u0440\u0442\u0430." }) }), _jsxs("div", { className: "mt-5", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { type: "file", accept: ".json,.csv", onChange: (e) => setImportFile(e.target.files?.[0] || null), className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" }), _jsxs("button", { onClick: () => importFile && importMutation.mutate(importFile), disabled: !importFile || importMutation.isPending, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C"] })] }), importError && (_jsxs("div", { className: "mt-2 text-sm text-red-600 flex items-center", children: [_jsx(AlertTriangle, { className: "h-4 w-4 mr-1" }), importError] }))] })] }) }), _jsx("div", { className: "bg-white shadow sm:rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0434\u0430\u043D\u043D\u044B\u0445" }), _jsx("div", { className: "mt-2 max-w-xl text-sm text-gray-500", children: _jsx("p", { children: "\u0421\u043A\u0430\u0447\u0430\u0439\u0442\u0435 \u0432\u0441\u0435 \u043C\u0435\u0442\u043A\u0438 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 JSON." }) }), _jsx("div", { className: "mt-5", children: _jsxs("button", { onClick: handleExport, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C"] }) })] }) })] }));
}
