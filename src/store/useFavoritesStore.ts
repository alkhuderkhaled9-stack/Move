import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/lib/tmdb/types';

interface FavoritesState {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (movie: Movie) => {
        set((state) => ({
          favorites: [...state.favorites, movie],
        }));
      },

      removeFavorite: (movieId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((movie) => movie.id !== movieId),
        }));
      },

      isFavorite: (movieId: number) => {
        return get().favorites.some((movie) => movie.id === movieId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'moviehub-favorites',
    }
  )
);
