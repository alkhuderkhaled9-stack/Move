'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { useSearchMovies } from '@/hooks/useMovies';
import { useDebounce } from '@/hooks/useDebounce';
import { getImageUrl } from '@/lib/utils';

export function SearchDropdown() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations('nav');
  const tSearch = useTranslations('searchPage');

  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Fetch search results
  const { data: searchResults, isLoading } = useSearchMovies(
    debouncedQuery,
    1,
    debouncedQuery.length > 0
  );

  const movies = searchResults?.results?.slice(0, 5) || [];

  // Show dropdown when there's a query and results
  useEffect(() => {
    if (debouncedQuery && (movies.length > 0 || isLoading)) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedQuery, movies.length, isLoading]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  // Handle movie click
  const handleMovieClick = (movieId: number) => {
    router.push(`/${locale}/movies/${movieId}`);
    setShowDropdown(false);
    setQuery('');
  };

  // Handle "View all results" click
  const handleViewAll = () => {
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={t('search')}
          className="w-[200px] lg:w-[300px] pl-8 pr-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (debouncedQuery && movies.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {isLoading && (
          <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full rounded-lg border bg-popover shadow-lg z-50">
          {isLoading && movies.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {tSearch('searching')}
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="max-h-[400px] overflow-y-auto">
                {movies.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleMovieClick(movie.id)}
                    className="flex w-full items-center gap-3 p-3 transition-colors hover:bg-accent"
                  >
                    {/* Poster */}
                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                      {movie.poster_path ? (
                        <Image
                          src={getImageUrl(movie.poster_path, 'w200')}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left">
                      <p className="line-clamp-1 font-medium">{movie.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'N/A'}{' '}
                        • ⭐ {movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* View all results */}
              <button
                onClick={handleViewAll}
                className="w-full border-t p-3 text-center text-sm font-medium text-primary transition-colors hover:bg-accent"
              >
                {tSearch('resultsFor', { query: debouncedQuery })} →
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
