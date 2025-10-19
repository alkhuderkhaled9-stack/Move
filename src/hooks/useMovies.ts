'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
} from '@/lib/tmdb/client';
import type { Movie, MovieDetails, Credits, TMDBResponse } from '@/lib/tmdb/types';

/**
 * Hook to fetch trending movies
 * @param timeWindow - 'day' or 'week'
 */
export function useTrendingMovies(
  timeWindow: 'day' | 'week' = 'week'
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movies', 'trending', timeWindow],
    queryFn: () => getTrendingMovies(timeWindow),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours (previously cacheTime)
  });
}

/**
 * Hook to fetch popular movies
 * @param page - Page number
 */
export function usePopularMovies(
  page: number = 1
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => getPopularMovies(page),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

/**
 * Hook to fetch top rated movies
 * @param page - Page number
 */
export function useTopRatedMovies(
  page: number = 1
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movies', 'topRated', page],
    queryFn: () => getTopRatedMovies(page),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

/**
 * Hook to fetch upcoming movies
 * @param page - Page number
 */
export function useUpcomingMovies(
  page: number = 1
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => getUpcomingMovies(page),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

/**
 * Hook to fetch now playing movies
 * @param page - Page number
 */
export function useNowPlayingMovies(
  page: number = 1
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movies', 'nowPlaying', page],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

/**
 * Hook to search movies
 * @param query - Search query
 * @param page - Page number
 * @param enabled - Whether to enable the query
 */
export function useSearchMovies(
  query: string,
  page: number = 1,
  enabled: boolean = true
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch movie details
 * @param id - Movie ID
 */
export function useMovieDetails(
  id: number
): UseQueryResult<MovieDetails, Error> {
  return useQuery({
    queryKey: ['movie', 'details', id],
    queryFn: () => getMovieDetails(id),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook to fetch movie credits (cast and crew)
 * @param id - Movie ID
 */
export function useMovieCredits(
  id: number
): UseQueryResult<Credits, Error> {
  return useQuery({
    queryKey: ['movie', 'credits', id],
    queryFn: () => getMovieCredits(id),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook to fetch similar movies
 * @param id - Movie ID
 * @param page - Page number
 */
export function useSimilarMovies(
  id: number,
  page: number = 1
): UseQueryResult<TMDBResponse<Movie>, Error> {
  return useQuery({
    queryKey: ['movie', 'similar', id, page],
    queryFn: () => getSimilarMovies(id, page),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}
