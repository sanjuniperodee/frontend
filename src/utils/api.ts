import { toast } from 'react-hot-toast';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  try {
    const { method = 'GET', body, headers = {} } = options;

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Произошла ошибка');
    }

    return response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    throw error;
  }
}