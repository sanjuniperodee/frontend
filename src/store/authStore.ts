import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_APP_DOMAIN


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: null,
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/v1/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true });

      localStorage.setItem('authToken', data.token);
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('authToken');
  },
  register: async (login: string, password: string) => {
    alert(import.meta.env.VITE_APP_DOMAIN);

    try {
      const response = await fetch(`${API_URL}/v1/user/sing-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true });

      // Optionally, store token in local storage
      localStorage.setItem('authToken', data.token);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  },
  checkAuthStatus: async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/v1/user/getme`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          set({ user: data, isAuthenticated: true });
        } else {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('authToken');
      }
    }
  },
}));