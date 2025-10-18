import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MovieCardSkeletonProps {
  className?: string;
}

export function MovieCardSkeleton({ className }: MovieCardSkeletonProps) {
  return (
    <div className={cn('', className)}>
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-0">
          {/* Poster Skeleton */}
          <Skeleton className="aspect-[2/3] w-full" />

          {/* Info Skeleton */}
          <div className="space-y-2 p-3">
            {/* Title */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            {/* Year */}
            <Skeleton className="h-3 w-16" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
