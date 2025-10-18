'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/constants';
import type { Movie } from '@/lib/tmdb/types';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  movie: Movie;
  className?: string;
}

export function HeroSection({ movie, className }: HeroSectionProps) {
  const router = useRouter();
  const t = useTranslations('home.hero');
  const [imageError, setImageError] = useState(false);

  const backdropUrl = imageError
    ? getImageUrl(movie.poster_path, 'backdrop', 'large')
    : getImageUrl(movie.backdrop_path, 'backdrop', 'large');

  const handleWatchNow = () => {
    router.push(`/movies/${movie.id}`);
  };

  const handleMoreInfo = () => {
    router.push(`/movies/${movie.id}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn('relative w-full overflow-hidden', className)}
    >
      {/* Background Image */}
      <div className="relative h-[60vh] w-full md:h-[70vh] lg:h-[80vh]">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={() => setImageError(true)}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container pb-12 md:pb-16 lg:pb-20 px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl space-y-4"
          >
            {/* Rating Badge */}
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-1 bg-black/70 text-white backdrop-blur-sm"
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>
            </Badge>

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            {/* Overview */}
            <p className="line-clamp-3 text-base text-muted-foreground md:text-lg">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={handleWatchNow}
                className="gap-2"
              >
                <Play className="h-5 w-5" />
                {t('watchNow')}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleMoreInfo}
                className="gap-2"
              >
                <Info className="h-5 w-5" />
                {t('moreInfo')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
