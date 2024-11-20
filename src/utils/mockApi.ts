import { User, Marker, Category, Comment } from '../types';


export const mockApi = {
  markers: {
    getAll: async (): Promise<Marker[]> => {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/list`);
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
      return (await response.json());
    },
    getAllAdmin: async (): Promise<Marker[]> => {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/admin-list`);
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
      return (await response.json());
    },
    getByUser: async (userId): Promise<Marker[]> => {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/list/` + userId);
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
      return (await response.json());
    },
    create: async (data: Omit<Marker, 'id' | 'createdAt' | 'approved' | 'rating'>): Promise<Marker> => {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create marker');
      }
      return response.json();
    },
    update: async (marker: Marker): Promise<Marker> => {
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/${marker.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marker),
      });
      if (!response.ok) {
        throw new Error('Failed to update marker');
      }
      return response.json();
    },
    rate: async (marker: Marker): Promise<Marker> => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/rate/${marker.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to rate marker');
      }
      return response.json();
    },
    dislike: async (marker: Marker): Promise<Marker> => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/dislike/${marker.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to rate marker');
      }
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/marker/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to delete marker');
      }
    },
  },

  categories: {
    getAll: async (): Promise<Category[]> => {
      const request = await (await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category`)).json()
      return request
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
      const token = localStorage.getItem('authToken');

      const request = await (await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/user/list`, { headers: { Authorization: `Bearer ${token}`} })).json()
      return request
    }
  },

  comments: {
    getByMarker: async (markerId: string): Promise<Comment[]> => {
      return []
    },
    create: async (data: Omit<Comment, 'id' | 'createdAt' | 'rating'>): Promise<Comment> => {
      const newComment: Comment = {
        ...data,
        id: Math.random().toString(),
        createdAt: new Date().toISOString(),
        rating: 0
      };
      // mockComments.push(newComment);
      return newComment;
    }
  }
};