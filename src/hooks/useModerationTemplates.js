import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export function useModerationTemplates() {
    const queryClient = useQueryClient();
    const { data: templates, isLoading } = useQuery({
        queryKey: ['moderation-templates'],
        queryFn: async () => {
            const response = await fetch('/api/admin/moderation/templates');
            if (!response.ok)
                throw new Error('Failed to fetch templates');
            return response.json();
        },
    });
    const createTemplate = useMutation({
        mutationFn: async (template) => {
            const response = await fetch('/api/admin/moderation/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template),
            });
            if (!response.ok)
                throw new Error('Failed to create template');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-templates'] });
        },
    });
    const updateTemplate = useMutation({
        mutationFn: async (template) => {
            const response = await fetch(`/api/admin/moderation/templates/${template.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(template),
            });
            if (!response.ok)
                throw new Error('Failed to update template');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-templates'] });
        },
    });
    const deleteTemplate = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`/api/admin/moderation/templates/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete template');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-templates'] });
        },
    });
    const applyTemplate = useMutation({
        mutationFn: async ({ templateId, contentId, contentType }) => {
            const response = await fetch(`/api/admin/moderation/apply-template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId, contentId, contentType }),
            });
            if (!response.ok)
                throw new Error('Failed to apply template');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
            queryClient.invalidateQueries({ queryKey: ['markers'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
    return {
        templates,
        isLoading,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        applyTemplate,
    };
}
