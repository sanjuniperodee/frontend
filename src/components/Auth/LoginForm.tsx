import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const generateCaptcha = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate random 6-character CAPTCHA
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, checkAuthStatus, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    checkAuthStatus();
    if (isAuthenticated) {
      navigate('/map');
    }
  }, [checkAuthStatus, isAuthenticated, navigate]);

  const onSubmit = async (data: any) => {
    if (captchaInput !== captcha) {
      setCaptchaError('Неправильный ввод капчи');
      setCaptcha(generateCaptcha()); // Regenerate CAPTCHA on failure
      setCaptchaInput(''); // Clear only the CAPTCHA field
      return;
    }

    try {
      setError(null);
      await login(data.username, data.password);
    } catch (e) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
            <input
                type="text"
                {...register('username', { required: 'Введите имя пользователя' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input
                type="password"
                {...register('password', { required: 'Введите пароль' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Капча</label>
            <div className="mt-1 flex items-center">
            <span className="captcha-text font-mono text-lg font-bold text-gray-900 bg-gray-200 px-3 py-2 rounded-md"
                  style={{
                    userSelect: 'none',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                    backgroundColor: '#f0f0f0',
                    padding: '10px',
                    display: 'inline-block',
                  }}>
              {captcha}
            </span>
              <button
                  type="button"
                  onClick={() => setCaptcha(generateCaptcha())}
                  className="ml-2 text-blue-500 hover:underline"
              >
                Обновить капчу
              </button>
            </div>
            <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {captchaError && <p className="mt-1 text-sm text-red-600">{captchaError}</p>}
          </div>

          {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
          )}

          <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
  );
}
