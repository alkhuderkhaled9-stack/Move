'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/constants';
import type { Movie } from '@/lib/tmdb/types';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  className?: string;
}

export function MovieCard({ movie, priority = false, className }: MovieCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    router.push(`/movies/${movie.id}`);
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const imageUrl = imageError
    ? '/placeholder-movie.jpg'
    : getImageUrl(movie.poster_path, 'poster', 'medium');

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('cursor-pointer w-full', className)}
      onClick={handleClick}
      data-testid="movie-card"
    >
      <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={imageUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 hover:scale-110"
              style={{ objectFit: 'cover' }}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
              onError={() => setImageError(true)}
            />

            {/* Rating Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-black/70 text-white backdrop-blur-sm"
              >
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </Badge>
            </div>
          </div>

          {/* Movie Info */}
          <div className="space-y-2 p-3">
            {/* Title */}
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
              {movie.title}
            </h3>

            {/* Release Year */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{releaseYear}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
