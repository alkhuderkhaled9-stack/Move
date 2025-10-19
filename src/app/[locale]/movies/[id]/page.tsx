'use client';

import { useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Star,
  DollarSign,
  Film,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getImageUrl } from '@/lib/constants';
import { useMovieDetails, useMovieCredits, useSimilarMovies } from '@/hooks/useMovies';
import { CastSection } from '@/components/movies/CastSection';
import { MovieCarousel } from '@/components/movies/MovieCarousel';
import { ErrorState } from '@/components/shared/ErrorState';
import { useTranslations } from 'next-intl';

interface MovieDetailsPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const resolvedParams = use(params);
  const movieId = parseInt(resolvedParams.id);
  const router = useRouter();
  const t = useTranslations('movie');
  const [imageError, setImageError] = useState(false);

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
    refetch: refetchMovie,
  } = useMovieDetails(movieId);

  const {
    data: credits,
  } = useMovieCredits(movieId);

  const {
    data: similarMovies,
    isLoading: similarLoading,
  } = useSimilarMovies(movieId);

  if (movieError) {
    return (
      <div className="container py-8">
        <ErrorState
          message={movieError.message}
          onRetry={refetchMovie}
        />
      </div>
    );
  }

  if (movieLoading || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const backdropUrl = imageError
    ? getImageUrl(movie.poster_path, 'backdrop', 'large')
    : getImageUrl(movie.backdrop_path, 'backdrop', 'large');

  const posterUrl = getImageUrl(movie.poster_path, 'poster', 'large');
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image */}
        <div className="relative h-[50vh] w-full md:h-[60vh] lg:h-[70vh]">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            onError={() => setImageError(true)}
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-8 md:pb-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-col gap-6 md:flex-row">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <div className="relative h-[300px] w-[200px] overflow-hidden rounded-lg shadow-2xl md:h-[450px] md:w-[300px]">
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 space-y-4"
              >
                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="mt-2 text-lg italic text-muted-foreground">
                      &ldquo;{movie.tagline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({movie.vote_count} votes)
                    </span>
                  </div>

                  <Separator orientation="vertical" className="h-4" />

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{releaseYear}</span>
                  </div>

                  {movie.runtime > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <div>
                  <h2 className="mb-2 text-xl font-semibold">{t('overview')}</h2>
                  <p className="text-muted-foreground">{movie.overview}</p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {movie.budget > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-semibold">{formatMoney(movie.budget)}</p>
                      </div>
                    </div>
                  )}

                  {movie.revenue > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-semibold">{formatMoney(movie.revenue)}</p>
                      </div>
                    </div>
                  )}

                  {movie.status && (
                    <div className="flex items-center gap-2">
                      <Film className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-semibold">{movie.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {credits && credits.cast && credits.cast.length > 0 && (
        <div className="container py-12">
          <CastSection cast={credits.cast} />
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies && similarMovies.results && similarMovies.results.length > 0 && (
        <div className="container py-12">
          <MovieCarousel
            title="Similar Movies"
            movies={similarMovies.results}
            loading={similarLoading}
          />
        </div>
      )}
    </div>
  );
}
