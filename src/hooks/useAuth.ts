import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const { login, logout, register } = useAuthStore();

  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password);
      toast.success('Успешный вход');
      return user;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка входа');
      throw error;
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      const user = await register(username, password);
      toast.success('Регистрация успешна');
      return user;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из системы');
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}