import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { Comment } from '../../types';
import { Send, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCommentsStore } from '../../store/commentsStore';

const commentSchema = z.object({
  text: z.string().min(1, 'Комментарий не может быть пустым'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentListProps {
  markerId: string;
}

export default function CommentList({ markerId }: CommentListProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CommentFormData>({
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
    mutationFn: async (data: CommentFormData) => {
      const newComment: Comment = {
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
    mutationFn: async (commentId: string) => {
      await deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', markerId] });
    },
  });

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-4">
        Войдите, чтобы оставлять комментарии
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                <p className="text-gray-900">{comment.text}</p>
              </div>
              {user?.id === comment.userId && (
                <button
                  onClick={() => removeComment.mutate(comment.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit((data) => createComment.mutate(data))} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            {...register('text')}
            placeholder="Написать комментарий..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={createComment.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {errors && (
          <p className="mt-1 text-sm text-red-600">{errors.text?.message}</p>
        )}
      </form>
    </div>
  );
}