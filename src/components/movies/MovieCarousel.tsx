'use client';

import { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from './MovieCard';
import { MovieCarouselSkeleton } from '@/components/shared/MovieCarouselSkeleton';
import type { Movie } from '@/lib/tmdb/types';
import { cn } from '@/lib/utils';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  className?: string;
}

export function MovieCarousel({
  title,
  movies,
  loading = false,
  className,
}: MovieCarouselProps) {
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === 'ar';

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
    direction: isRTL ? 'rtl' : 'ltr',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (!emblaApi) return;

    let autoplayInterval: NodeJS.Timeout;
    let isPaused = false;

    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        if (!isPaused && emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else if (!isPaused) {
          emblaApi.scrollTo(0);
        }
      }, 5000);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };

    // Get the carousel container
    const container = emblaApi.containerNode();

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoplay();

    
    return () => {
      stopAutoplay();
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [emblaApi]);

  if (loading) {
    return (
      <section className={cn('space-y-4', className)}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <MovieCarouselSkeleton />
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="h-8 w-8"
            aria-label="Previous slide"
          >
            {isRTL ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="h-8 w-8"
            aria-label="Next slide"
          >
            {isRTL ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="w-[160px] flex-shrink-0 sm:w-[180px] md:w-[200px] lg:w-[220px]"
            >
              <MovieCard movie={movie} priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
