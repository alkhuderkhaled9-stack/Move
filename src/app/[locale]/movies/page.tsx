'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';

import { MovieCard } from '@/components/movies/MovieCard';
import { MovieCardSkeleton } from '@/components/shared/MovieCardSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDiscoverMovies, useGenres } from '@/hooks/useMovies';

const SORT_OPTIONS = [
  { value: 'popularity.desc', labelKey: 'popularityDesc' },
  { value: 'popularity.asc', labelKey: 'popularityAsc' },
  { value: 'release_date.desc', labelKey: 'releaseDateDesc' },
  { value: 'release_date.asc', labelKey: 'releaseDateAsc' },
  { value: 'vote_average.desc', labelKey: 'voteAverageDesc' },
  { value: 'vote_average.asc', labelKey: 'voteAverageAsc' },
  { value: 'title.asc', labelKey: 'titleAsc' },
  { value: 'title.desc', labelKey: 'titleDesc' },
];

export default function MoviesPage() {
  const t = useTranslations('moviesPage');
  const tCommon = useTranslations('common');

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch genres
  const { data: genresData, isLoading: genresLoading } = useGenres();

  // Fetch movies with filters
  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
    refetch,
  } = useDiscoverMovies({
    page,
    with_genres: selectedGenres.join(','),
    sort_by: sortBy,
  });

  // Handle genre toggle
  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setPage(1); // Reset to first page
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setPage(1);
  };

  // Loading state
  if (moviesLoading && page === 1) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (moviesError) {
    return (
      <div className="container py-8">
        <ErrorState message={moviesError.message} onRetry={refetch} />
      </div>
    );
  }

  const movies = moviesData?.results || [];
  const totalResults = moviesData?.total_results || 0;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('showingResults', { count: totalResults })}
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <Filter className="mr-2 h-4 w-4" />
          {t('filters')}
        </Button>

        {/* Desktop Filters */}
        <div className="hidden md:flex md:flex-wrap md:gap-2">
          {/* All Genres Badge */}
          <Badge
            variant={selectedGenres.length === 0 ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={clearFilters}
          >
            {t('allGenres')}
          </Badge>

          {/* Genre Badges */}
          {!genresLoading &&
            genresData?.genres.slice(0, 10).map((genre) => (
              <Badge
                key={genre.id}
                variant={
                  selectedGenres.includes(String(genre.id))
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer"
                onClick={() => toggleGenre(String(genre.id))}
              >
                {genre.name}
              </Badge>
            ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(`sort.${option.labelKey}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 rounded-lg border bg-card p-4 md:hidden"
        >
          <h3 className="mb-3 font-semibold">{t('genres')}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedGenres.length === 0 ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={clearFilters}
            >
              {t('allGenres')}
            </Badge>
            {!genresLoading &&
              genresData?.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={
                    selectedGenres.includes(String(genre.id))
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => toggleGenre(String(genre.id))}
                >
                  {genre.name}
                </Badge>
              ))}
          </div>
        </motion.div>
      )}

      {/* Clear Filters Button */}
      {selectedGenres.length > 0 && (
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            {t('clearFilters')}
          </Button>
        </div>
      )}

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                priority={index < 10}
              />
            ))}
          </div>

          {/* Pagination */}
          {moviesData && moviesData.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || moviesLoading}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {/* Show page numbers */}
                {Array.from({ length: Math.min(5, moviesData.total_pages) })
                  .map((_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (moviesData.total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= moviesData.total_pages - 2) {
                      pageNum = moviesData.total_pages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return pageNum;
                  })
                  .map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      disabled={moviesLoading}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setPage((p) => Math.min(moviesData.total_pages, p + 1))
                }
                disabled={page === moviesData.total_pages || moviesLoading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Loading overlay for pagination */}
      {moviesLoading && page > 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">{tCommon('loading')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
