import { MovieCardSkeleton } from './MovieCardSkeleton';
import { cn } from '@/lib/utils';

interface MovieCarouselSkeletonProps {
  className?: string;
}

export function MovieCarouselSkeleton({ className }: MovieCarouselSkeletonProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="min-w-[150px] flex-shrink-0 sm:min-w-[180px] md:min-w-[200px]"
          >
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
