import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
export const useCommentsStore = create()(persist((set, get) => ({
    comments: [],
    fetchComments: async (markerId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/comment/${markerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            set((state) => ({
                comments: [...state.comments.filter(c => c.markerId !== markerId), ...data],
            }));
        }
        catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Не удалось загрузить комментарии');
        }
    },
    addComment: async (comment) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(comment),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const newComment = await response;
            if (!newComment.ok) {
                throw new Error('123123');
            }
            set((state) => ({
                comments: [...state.comments, comment],
            }));
            toast.success('Комментарий добавлен');
        }
        catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Не удалось добавить комментарий');
        }
    },
    deleteComment: async (commentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            set((state) => ({
                comments: state.comments.filter((c) => c.id !== commentId),
            }));
            toast.success('Комментарий удален');
        }
        catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Не удалось удалить комментарий');
        }
    },
    getCommentsByMarker: (markerId) => {
        return get().comments.filter((comment) => comment.markerId === markerId);
    },
}), {
    name: 'comments-storage',
    version: 1,
}));
