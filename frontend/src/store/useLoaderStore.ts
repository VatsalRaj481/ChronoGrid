import { create } from 'zustand';

interface LoaderState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
