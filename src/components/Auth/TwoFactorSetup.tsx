import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Shield, Copy } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export default function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to setup 2FA');
      return response.json();
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setSecret(data.secret);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error('Invalid verification code');
      return response.json();
    },
    onSuccess: () => {
      setIsEnabled(true);
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">Двухфакторная аутентификация</h2>
      </div>

      {!isEnabled ? (
        <div className="space-y-6">
          {!qrCode ? (
            <button
              onClick={() => setupMutation.mutate()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Настроить 2FA
            </button>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <code className="text-sm">{secret}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Код подтверждения
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Введите код из приложения"
                  />
                </div>

                <button
                  onClick={() => verifyMutation.mutate(verificationCode)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Подтвердить
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-green-600 font-medium">
            2FA успешно активирована
          </div>
        </div>
      )}
    </div>
  );
}