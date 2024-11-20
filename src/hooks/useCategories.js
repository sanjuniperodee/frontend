import { useQuery } from '@tanstack/react-query';
import { mockApi } from "../utils/mockApi.ts";
export function useCategories() {
    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => mockApi.categories.getAll(),
    });
    return { categories, isLoading, error };
}
