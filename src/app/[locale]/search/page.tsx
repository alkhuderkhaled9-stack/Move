'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { MovieCard } from '@/components/movies/MovieCard';
import { MovieCardSkeleton } from '@/components/shared/MovieCardSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { Input } from '@/components/ui/input';
import { useSearchMovies } from '@/hooks/useMovies';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchPage() {
  const t = useTranslations('searchPage');
  const searchParams = useSearchParams();

  // Get initial query from URL
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 500);

  // Fetch search results
  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useSearchMovies(debouncedQuery, 1, debouncedQuery.length > 0);

  // Update query from URL when it changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const movies = searchResults?.results || [];
  const totalResults = searchResults?.total_results || 0;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t('title')}</h1>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 text-base"
            autoFocus
          />
        </div>

        {/* Results count */}
        {debouncedQuery && !isLoading && movies.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t('resultsFor', { query: debouncedQuery })} - {t('foundMovies', { count: totalResults })}
          </p>
        )}
      </div>

      {/* Content */}
      <div>
        {/* No query state */}
        {!debouncedQuery && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">{t('noQuery')}</h3>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && debouncedQuery && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && debouncedQuery && (
          <ErrorState message={error.message} onRetry={refetch} />
        )}

        {/* No results */}
        {!isLoading && !error && debouncedQuery && movies.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                {t('noResults', { query: debouncedQuery })}
              </h3>
              <p className="text-sm text-muted-foreground">{t('tryDifferent')}</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                priority={index < 10}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
