'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getImageUrl } from '@/lib/constants';
import type { Cast } from '@/lib/tmdb/types';
import { cn } from '@/lib/utils';

interface CastSectionProps {
  cast: Cast[];
  className?: string;
}

export function CastSection({ cast, className }: CastSectionProps) {
  const displayCast = cast.slice(0, 10); // Show first 10 cast members

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-2xl font-bold">Cast</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayCast.map((person) => (
          <CastCard key={person.cast_id} person={person} />
        ))}
      </div>
    </div>
  );
}

interface CastCardProps {
  person: Cast;
}

function CastCard({ person }: CastCardProps) {
  const [imageError, setImageError] = useState(false);

  const profileUrl = person.profile_path
    ? getImageUrl(person.profile_path, 'profile', 'medium')
    : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Profile Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          {profileUrl && !imageError ? (
            <Image
              src={profileUrl}
              alt={person.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-1 text-sm font-semibold">{person.name}</h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {person.character}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
