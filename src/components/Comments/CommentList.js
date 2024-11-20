import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { Send, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCommentsStore } from '../../store/commentsStore';
const commentSchema = z.object({
    text: z.string().min(1, 'Комментарий не может быть пустым'),
});
export default function CommentList({ markerId }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(commentSchema),
    });
    const { user } = useAuthStore();
    const { fetchComments, addComment, deleteComment, getCommentsByMarker } = useCommentsStore();
    const queryClient = useQueryClient();
    // Fetch comments from server when the component mounts
    useQuery({
        queryKey: ['comments', markerId],
        queryFn: () => fetchComments(markerId),
    });
    const comments = getCommentsByMarker(markerId);
    const createComment = useMutation({
        mutationFn: async (data) => {
            const newComment = {
                id: Math.random().toString(),
                text: data.text,
                userId: user?.id || '',
                markerId,
                createdAt: new Date().toISOString(),
                rating: 0,
            };
            await addComment(newComment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', markerId] });
        },
    });
    const removeComment = useMutation({
        mutationFn: async (commentId) => {
            await deleteComment(commentId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', markerId] });
        },
    });
    if (!user) {
        return (_jsx("div", { className: "text-center text-gray-500 py-4", children: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438" }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "space-y-4", children: comments.map((comment) => (_jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm text-gray-600", children: new Date(comment.createdAt).toLocaleString() }), _jsx("p", { className: "text-gray-900", children: comment.text })] }), user?.id === comment.userId && (_jsx("button", { onClick: () => removeComment.mutate(comment.id), className: "text-red-600 hover:text-red-800", children: _jsx(Trash2, { className: "h-4 w-4" }) }))] }) }, comment.id))) }), _jsxs("form", { onSubmit: handleSubmit((data) => createComment.mutate(data)), className: "mt-4", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", ...register('text'), placeholder: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439...", className: "flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), _jsx("button", { type: "submit", disabled: createComment.isPending, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50", children: _jsx(Send, { className: "h-4 w-4" }) })] }), errors && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.text?.message }))] })] }));
}
