'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

import { MovieCard } from '@/components/movies/MovieCard';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export default function FavoritesPage() {
  const t = useTranslations('favoritesPage');
  const { favorites } = useFavoritesStore();

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t('title')}</h1>
        {favorites.length > 0 && (
          <p className="mt-2 text-muted-foreground">
            {t('totalFavorites', { count: favorites.length })}
          </p>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">{t('noFavorites')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('noFavoritesDescription')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {favorites.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              priority={index < 10}
            />
          ))}
        </div>
      )}
    </div>
  );
}
