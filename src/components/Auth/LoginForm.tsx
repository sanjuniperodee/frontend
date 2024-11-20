import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Navigate, useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';

// Validation schema using zod
const loginSchema = z.object({
  username: z.string().min(3, 'Минимум 3 символа'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, checkAuthStatus, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // reCAPTCHA token state

  useEffect(() => {
    checkAuthStatus();
    if (isAuthenticated) {
      navigate('/map');
    }
  }, [checkAuthStatus, isAuthenticated, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // if (!captchaToken) {
    //   setError('Подтвердите, что вы не робот.');
    //   return;
    // }

    try {
      setError(null);
      await login(data.username, data.password); // Pass captchaToken to backend
      // location.replace('/map');
    } catch (error) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token); // Update the captcha token when the user completes verification
  };

  return (
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Имя пользователя
            </label>
            <input
                type="text"
                {...register('username')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <ReCAPTCHA
              sitekey="6LfrJ4UqAAAAAMENfBq_0SbqTH68Mupfx0-ULSG6" // Replace with your reCAPTCHA site key
              onChange={handleCaptchaChange}
          />

          {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
          )}

          <button
              type="submit"
              // disabled={isSubmitting || !captchaToken} // Disable submit if reCAPTCHA not completed
              disabled={isSubmitting} // Disable submit if reCAPTCHA not completed
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
  );
}
