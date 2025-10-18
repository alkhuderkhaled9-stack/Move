'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  const t = useTranslations('errors');

  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          {/* Error Icon */}
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {t('somethingWentWrong')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {message || t('defaultError')}
            </p>
          </div>

          {/* Retry Button */}
          {onRetry && (
            <Button onClick={onRetry} variant="default" className="mt-2">
              {t('tryAgain')}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
