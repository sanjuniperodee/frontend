import { toast } from 'react-hot-toast';
export async function api(endpoint, options = {}) {
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
    }
    catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
        throw error;
    }
}
