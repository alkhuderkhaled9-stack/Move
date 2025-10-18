'use client';

import { useTranslations } from 'next-intl';
import { HeroSection } from '@/components/movies/HeroSection';
import { MovieCarousel } from '@/components/movies/MovieCarousel';
import { ErrorState } from '@/components/shared/ErrorState';
import { useTrendingMovies, usePopularMovies } from '@/hooks/useMovies';

export default function HomePage() {
  const t = useTranslations('home');

  // Fetch trending and popular movies
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useTrendingMovies('week');

  const {
    data: popularData,
    isLoading: popularLoading,
    error: popularError,
    refetch: refetchPopular,
  } = usePopularMovies(1);

  // Show error state if both queries fail
  if (trendingError && popularError) {
    return (
      <div className="container py-8">
        <ErrorState
          message={trendingError.message}
          onRetry={() => {
            refetchTrending();
            refetchPopular();
          }}
        />
      </div>
    );
  }

  // Get the first trending movie for hero section
  const heroMovie = trendingData?.results[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      {heroMovie && !trendingLoading && (
        <HeroSection movie={heroMovie} />
      )}

      {/* Main Content */}
      <div className="container space-y-12">
        {/* Trending Movies Section */}
        {trendingError ? (
          <ErrorState
            message={trendingError.message}
            onRetry={refetchTrending}
          />
        ) : (
          <MovieCarousel
            title={t('trending')}
            movies={trendingData?.results || []}
            loading={trendingLoading}
          />
        )}

        {/* Popular Movies Section */}
        {popularError ? (
          <ErrorState
            message={popularError.message}
            onRetry={refetchPopular}
          />
        ) : (
          <MovieCarousel
            title={t('popular')}
            movies={popularData?.results || []}
            loading={popularLoading}
          />
        )}
      </div>
    </div>
  );
}
