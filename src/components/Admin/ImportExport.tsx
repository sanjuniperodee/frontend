import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, Download, AlertTriangle } from 'lucide-react';

export default function ImportExport() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string>('');

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
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
    onError: (error: Error) => {
      setImportError(error.message);
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/export');
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `markers-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Импорт данных
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Загрузите файл JSON или CSV с метками для импорта.</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={() => importFile && importMutation.mutate(importFile)}
                disabled={!importFile || importMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Импортировать
              </button>
            </div>
            {importError && (
              <div className="mt-2 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {importError}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Экспорт данных
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Скачайте все метки в формате JSON.</p>
          </div>
          <div className="mt-5">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспортировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}