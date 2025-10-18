'use client';

import { Film } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message?: string;
  description?: string;
  className?: string;
}

export function EmptyState({ message, description, className }: EmptyStateProps) {
  const t = useTranslations('common');

  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          {/* Empty Icon */}
          <div className="rounded-full bg-muted p-4">
            <Film className="h-10 w-10 text-muted-foreground" />
          </div>

          {/* Empty Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {message || t('noMoviesFound')}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
