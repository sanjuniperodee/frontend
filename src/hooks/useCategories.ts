import { useQuery } from '@tanstack/react-query';
import { Category } from '../types';
import {mockApi} from "../utils/mockApi.ts";


export function useCategories() {
  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => mockApi.categories.getAll(),
  });

  return { categories, isLoading, error };
}