import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '../types';

interface CategoriesState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  fetchCategory: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: [],
      setCategories: (categories) => set({ categories }),
      addCategory: (category) => set((state) => ({
        // categories: [...state.categories, category],
      })),
      updateCategory: (category) => set((state) => ({
        // categories: state.categories.map((c) => (c.id === category.id ? category : c)),
      })),
      deleteCategory: (categoryId) => set((state) => ({
        // categories: state.categories.filter((c) => c.id !== categoryId),
      })),
      fetchCategory: () => async ()=> {
          const request = await (await fetch(`${import.meta.env.VITE_APP_DOMAIN}/v1/category`)).json()
          set(request)
      },
    }),
    {
      name: 'categories-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState;
      },
    }
  )
);