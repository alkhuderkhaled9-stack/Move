# Claude Code Context - Movies Discovery Platform

> **Purpose**: This file defines code quality standards, architectural patterns, and best practices for the Movies Discovery Platform. Claude Code MUST follow these guidelines to ensure consistency, maintainability, and production-ready code.

---

## 🏗️ Project Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 3.4+
- **UI Library**: shadcn/ui
- **State Management**: 
  - Server State: @tanstack/react-query v5
  - Client State: zustand
- **Validation**: zod
- **i18n**: next-intl
- **Database** (Optional): Supabase
- **Testing**: Playwright + Vitest

### Directory Structure
```
src/
├── app/
│   ├── [locale]/              # i18n wrapper
│   │   ├── (routes)/          # Route groups
│   │   │   ├── movies/
│   │   │   ├── search/
│   │   │   └── account/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/                   # API routes (minimal use)
├── components/
│   ├── ui/                    # shadcn components (DO NOT MODIFY)
│   ├── movies/                # Feature-specific components
│   ├── layout/                # Layout components
│   └── shared/                # Shared/common components
├── lib/
│   ├── tmdb/                  # TMDB API client
│   ├── supabase/              # Supabase client (optional)
│   ├── utils.ts               # Utility functions
│   ├── constants.ts           # Constants
│   └── validators.ts          # Zod schemas
├── hooks/                     # Custom React hooks
├── store/                     # Zustand stores
├── types/                     # TypeScript types
├── messages/                  # i18n translations
└── styles/                    # Global styles
```

---

## 📏 Code Quality Standards

### 1. TypeScript Guidelines

#### ✅ DO
```typescript
// Use explicit return types for functions
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const response = await fetch(`${API_URL}/movie/${id}`);
  const data = await response.json();
  return movieDetailsSchema.parse(data); // Validate with Zod
}

// Use strict TypeScript types
interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'compact';
  onFavorite?: (id: number) => void;
}

// Prefer type inference for simple cases
const movies = await getMovies(); // Type inferred from function return

// Use const assertions for constants
const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
} as const;

// Use discriminated unions for complex states
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Movie[] }
  | { status: 'error'; error: Error };
```

#### ❌ DON'T
```typescript
// Don't use 'any'
function processData(data: any) { } // ❌

// Don't omit return types for exported functions
export async function getMovies() { } // ❌

// Don't use non-null assertions unless absolutely necessary
const movie = movies.find(m => m.id === id)!; // ❌

// Don't ignore TypeScript errors with @ts-ignore
// @ts-ignore
const result = someFunction(); // ❌
```

---

### 2. React/Next.js Best Practices

#### Server Components (Default)
```typescript
// Use Server Components by default
export default async function MoviesPage({ 
  searchParams 
}: { 
  searchParams: { page?: string; genre?: string } 
}) {
  // Fetch data directly in Server Component
  const movies = await getMovies({
    page: Number(searchParams.page) || 1,
    genre: searchParams.genre,
  });

  return <MovieGrid movies={movies} />;
}

// Add proper metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const movie = await getMovieDetails(Number(params.id));
  
  return {
    title: `${movie.title} (${new Date(movie.release_date).getFullYear()})`,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [getImageUrl(movie.backdrop_path, 'w1280')],
    },
  };
}
```

#### Client Components (When Needed)
```typescript
'use client';

// Only use 'use client' when you need:
// 1. Interactivity (onClick, onChange, etc.)
// 2. Browser APIs (localStorage, window)
// 3. React hooks (useState, useEffect)
// 4. Event listeners

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  
  return (
    <input 
      value={query} 
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search movies..."
    />
  );
}
```

#### Component Structure
```typescript
// 1. Imports (grouped and sorted)
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import type { Movie } from '@/types/movie';

// 2. Types/Interfaces
interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'compact';
  className?: string;
}

// 3. Component
export function MovieCard({ 
  movie, 
  variant = 'default',
  className 
}: MovieCardProps) {
  const t = useTranslations('movie');
  
  // 4. Hooks (top of component)
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 5. Early returns
  if (!movie) return null;
  
  // 6. Event handlers
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // 7. Render
  return (
    <Card className={className}>
      {/* Component JSX */}
    </Card>
  );
}

// 8. Default export (if needed)
export default MovieCard;
```

---

### 3. Data Fetching Patterns

#### Server Components
```typescript
// Use native fetch with caching
export async function getTrendingMovies() {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
    { 
      next: { revalidate: 3600 } // ISR: revalidate every hour
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  
  const data = await response.json();
  return trendingMoviesSchema.parse(data);
}

// For dynamic data (no cache)
export async function getUserFavorites(userId: string) {
  const response = await fetch(
    `${API_URL}/users/${userId}/favorites`,
    { cache: 'no-store' } // Always fetch fresh data
  );
  
  return response.json();
}
```

#### Client Components (React Query)
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function useMovies(filters: MovieFilters) {
  return useQuery({
    queryKey: ['movies', filters],
    queryFn: () => getMovies(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
  });
}

// With suspense (recommended)
export function useMovieDetails(id: number) {
  return useSuspenseQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id),
  });
}
```

#### Server Actions
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addFavoriteSchema = z.object({
  movieId: z.number(),
  userId: z.string(),
});

export async function addToFavorites(formData: FormData) {
  const parsed = addFavoriteSchema.safeParse({
    movieId: Number(formData.get('movieId')),
    userId: formData.get('userId'),
  });
  
  if (!parsed.success) {
    return { error: 'Invalid input' };
  }
  
  // Database operation
  await db.favorites.create({
    data: parsed.data,
  });
  
  revalidatePath('/account/favorites');
  return { success: true };
}
```

---

### 4. Styling Guidelines

#### Tailwind CSS Best Practices
```typescript
// ✅ Use Tailwind utility classes
<div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-md">
  <Image src={posterUrl} alt={title} />
</div>

// ✅ Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<Button 
  className={cn(
    "w-full",
    variant === 'primary' && "bg-primary text-primary-foreground",
    variant === 'secondary' && "bg-secondary text-secondary-foreground",
    disabled && "opacity-50 cursor-not-allowed"
  )}
/>

// ✅ Extract repeated patterns to components
<Card className="movie-card">
  {/* ... */}
</Card>

// ❌ Don't use inline styles
<div style={{ marginTop: '20px' }}> // ❌

// ❌ Don't create custom CSS classes for simple utilities
.margin-top { margin-top: 20px; } // ❌ Use mt-5 instead
```

#### Component Variants Pattern
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} 
    />
  );
}
```

---

### 5. Error Handling

#### API Error Handling
```typescript
// Custom error class
export class TMDBError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'TMDBError';
  }
}

// API wrapper with error handling
export async function tmdbFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`,
      options
    );
    
    if (!response.ok) {
      throw new TMDBError(
        `TMDB API error: ${response.statusText}`,
        response.status,
        endpoint
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error;
    }
    throw new Error(`Network error: ${error.message}`);
  }
}
```

#### React Error Boundaries
```typescript
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

#### Error Pages
```typescript
// app/[locale]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button onClick={reset} className="mt-4">
          Try again
        </button>
      </div>
    </div>
  );
}

// app/[locale]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
}
```

---

### 6. Performance Optimization

#### Image Optimization
```typescript
import Image from 'next/image';

// ✅ Always use Next/Image
<Image
  src={getImageUrl(movie.poster_path, 'w500')}
  alt={movie.title}
  width={500}
  height={750}
  className="rounded-lg"
  placeholder="blur"
  blurDataURL={getBlurDataUrl()}
  priority={index < 4} // Priority for above-fold images
/>

// Helper function for TMDB images
export function getImageUrl(
  path: string | null, 
  size: 'w200' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
```

#### Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false, // Disable SSR if component uses browser APIs
});

// Route-based code splitting (automatic in Next.js App Router)
// Each page in app/ is automatically code-split
```

#### Memoization
```typescript
'use client';

import { useMemo, useCallback } from 'react';

export function MovieGrid({ movies }: { movies: Movie[] }) {
  // Memoize expensive computations
  const sortedMovies = useMemo(
    () => movies.sort((a, b) => b.vote_average - a.vote_average),
    [movies]
  );
  
  // Memoize callbacks
  const handleMovieClick = useCallback((id: number) => {
    router.push(`/movies/${id}`);
  }, [router]);
  
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {sortedMovies.map(movie => (
        <MovieCard 
          key={movie.id} 
          movie={movie}
          onClick={handleMovieClick}
        />
      ))}
    </div>
  );
}
```

---

### 7. Accessibility (a11y)

```typescript
// ✅ Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/movies">Movies</Link></li>
  </ul>
</nav>

// ✅ ARIA labels
<button 
  aria-label="Add to favorites"
  onClick={handleFavorite}
>
  <HeartIcon />
</button>

// ✅ Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>

// ✅ Focus management
import { useRef, useEffect } from 'react';

export function Modal({ isOpen }: { isOpen: boolean }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);
  
  return (
    <dialog open={isOpen}>
      <button ref={closeButtonRef}>Close</button>
    </dialog>
  );
}

// ✅ Skip to content link
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0"
>
  Skip to content
</a>
```

---

### 8. Internationalization (i18n)

```typescript
// Structure for translations
// messages/en.json
{
  "nav": {
    "home": "Home",
    "movies": "Movies",
    "search": "Search"
  },
  "movie": {
    "rating": "Rating",
    "releaseDate": "Release Date",
    "addToFavorites": "Add to Favorites"
  },
  "errors": {
    "movieNotFound": "Movie not found",
    "networkError": "Network error. Please try again."
  }
}

// messages/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "movies": "الأفلام",
    "search": "بحث"
  },
  "movie": {
    "rating": "التقييم",
    "releaseDate": "تاريخ الإصدار",
    "addToFavorites": "إضافة للمفضلة"
  }
}

// Usage in components
import { useTranslations } from 'next-intl';

export function MovieDetails({ movie }: { movie: Movie }) {
  const t = useTranslations('movie');
  
  return (
    <div>
      <p>{t('rating')}: {movie.vote_average}</p>
      <p>{t('releaseDate')}: {formatDate(movie.release_date)}</p>
    </div>
  );
}

// RTL Support
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const direction = params.locale === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <html lang={params.locale} dir={direction}>
      <body className={params.locale === 'ar' ? 'font-cairo' : 'font-inter'}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

### 9. Testing Standards

#### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MovieCard } from './MovieCard';

describe('MovieCard', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    vote_average: 8.5,
  };
  
  it('renders movie title', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
  
  it('displays correct rating', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });
});
```

#### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Movies Page', () => {
  test('should display trending movies on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for movies to load
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Check if at least one movie card is visible
    const movieCards = await page.locator('[data-testid="movie-card"]');
    await expect(movieCards.first()).toBeVisible();
  });
  
  test('should navigate to movie details', async ({ page }) => {
    await page.goto('/');
    
    // Click first movie card
    await page.locator('[data-testid="movie-card"]').first().click();
    
    // Should navigate to details page
    await expect(page).toHaveURL(/\/movies\/\d+/);
    
    // Should show movie title
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('should filter movies by genre', async ({ page }) => {
    await page.goto('/movies');
    
    // Select action genre
    await page.locator('[data-testid="genre-filter"]').selectOption('28');
    
    // URL should update
    await expect(page).toHaveURL(/genre=28/);
    
    // Movies should reload
    await page.waitForLoadState('networkidle');
  });
});
```

---

### 10. Security Best Practices

```typescript
// ✅ Validate all user input
const schema = z.object({
  query: z.string().min(1).max(100),
  page: z.number().min(1).max(500),
});

export async function searchMovies(searchParams: unknown) {
  const validated = schema.safeParse(searchParams);
  
  if (!validated.success) {
    throw new Error('Invalid search parameters');
  }
  
  return tmdbFetch(`/search/movie`, {
    query: validated.data.query,
    page: validated.data.page,
  });
}

// ✅ Sanitize HTML content
import DOMPurify from 'isomorphic-dompurify';

export function SafeHTML({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ Environment variables
// NEVER commit API keys
// Use NEXT_PUBLIC_ prefix only for client-side vars
const TMDB_API_KEY = process.env.TMDB_API_KEY; // Server-only
const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL; // Client-accessible

// ✅ Rate limiting (for API routes)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Handle request
}
```

---

### 11. Git Workflow

#### Commit Messages (Conventional Commits)
```bash
# Format: <type>(<scope>): <subject>

feat(movies): add genre filter component
fix(search): resolve debounce timing issue
docs(readme): update installation steps
style(ui): adjust card spacing for mobile
refactor(api): extract TMDB client to separate file
test(movies): add unit tests for MovieCard
chore(deps): update dependencies
perf(images): optimize poster loading
```

#### Branch Naming
```bash
feature/movie-details-page
bugfix/search-pagination
hotfix/api-key-exposure
refactor/tmdb-client
```

---

### 12. File Naming Conventions

```
✅ Components: PascalCase
  - MovieCard.tsx
  - SearchBar.tsx
  - ThemeToggle.tsx

✅ Utilities/Hooks: camelCase
  - utils.ts
  - useMovies.ts
  - formatDate.ts

✅ Types: PascalCase
  - Movie.ts
  - User.ts
  - ApiResponse.ts

✅ Constants: UPPER_SNAKE_CASE
  - API_ENDPOINTS.ts
  - GENRE_MAP.ts

✅ Pages: lowercase with hyphens
  - page.tsx
  - not-found.tsx
  - [id]/page.tsx
```

---

### 13. Comments and Documentation

```typescript
// ✅ Use JSDoc for public APIs
/**
 * Fetches movie details from TMDB API
 * @param id - The TMDB movie ID
 * @returns Promise resolving to movie details
 * @throws {TMDBError} When movie is not found or API fails
 */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  // Implementation
}

// ✅ Explain complex logic
// Calculate aspect ratio to prevent layout shift
// Based on TMDB poster dimensions (2:3 ratio)
const aspectRatio = (3 / 2) * 100;

// ✅ TODO comments with context
// TODO: Add caching layer for frequently accessed movies
// TODO: Implement virtual scrolling for large lists (> 1000 items)

// ❌ Don't state the obvious
const movies = []; // Create an empty array ❌
```

---

### 14. Environment Variables Template

```env
# .env.example (commit this)
# .env.local (DO NOT commit)

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
TMDB_API_ACCESS_TOKEN=your_access_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Movies Discovery"

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics (Production)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_FAVORITES=false
NEXT_PUBLIC_ENABLE_WATCHLIST=false
```

---

### 15. Performance Checklist

Before committing code, ensure:

- [ ] No console.log statements in production code
- [ ] Images use Next/Image with proper sizes
- [ ] No unnecessary re-renders (use React DevTools Profiler)
- [ ] Heavy computations are memoized
- [ ] API calls are deduplicated (React Query handles this)
- [ ] Proper loading states for async operations
- [ ] Error boundaries in place
- [ ] Accessibility audit passed (use axe DevTools)
- [ ] Lighthouse score > 90 for performance
- [ ] Bundle size is reasonable (<200KB initial JS)

---

### 16. Code Review Checklist

When reviewing code (or self-reviewing):

- [ ] Follows TypeScript strict mode (no 'any')
- [ ] Uses Server Components where possible
- [ ] Proper error handling
- [ ] Includes loading and error states
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] RTL support for Arabic
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Performant (no unnecessary renders)
- [ ] Tested (unit tests for logic, E2E for flows)
- [ ] Documented (complex logic has comments)
- [ ] No security vulnerabilities (API keys, XSS, etc.)
- [ ] Follows project conventions

---

## 🚨 Critical Rules

### NEVER
1. ❌ Commit API keys or secrets
2. ❌ Use 'any' type in TypeScript
3. ❌ Ignore accessibility
4. ❌ Skip error handling
5. ❌ Use inline styles (use Tailwind)
6. ❌ Modify shadcn/ui components directly
7. ❌ Fetch data in Client Components (use Server Components or React Query)
8. ❌ Ignore TypeScript errors
9. ❌ Skip validation for user input
10. ❌ Use non-semantic HTML

### ALWAYS
1. ✅ Validate with Zod
2. ✅ Use Server Components by default
3. ✅ Add proper TypeScript types
4. ✅ Handle loading and error states
5. ✅ Optimize images with Next/Image
6. ✅ Test critical user flows
7. ✅ Follow accessibility guidelines
8. ✅ Use semantic HTML
9. ✅ Add proper metadata for SEO
10. ✅ Write meaningful commit messages

---

## 📚 Quick Reference

### Useful Snippets

```typescript
// Custom hook pattern
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Server action pattern
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const schema = z.object({
  movieId: z.number(),
});

export async function addToFavorites(formData: FormData) {
  const result = schema.safeParse({
    movieId: Number(formData.get('movieId')),
  });
  
  if (!result.success) {
    return { error: 'Invalid input' };
  }
  
  // Database operation
  await db.favorites.create({ data: result.data });
  
  revalidatePath('/favorites');
  return { success: true };
}

// Parallel data fetching
const [movies, genres] = await Promise.all([
  getMovies(),
  getGenres(),
]);
```

---

## 🎯 Remember

**Quality over speed**: Take time to write clean, maintainable code. Future you (and your team) will thank you.

**User first**: Every decision should prioritize user experience - performance, accessibility, and usability.

**Stay consistent**: Follow these guidelines consistently across the entire codebase.

---

*Last Updated: 2025-01-14*
*Version: 1.0.0*