import { TMDB_BASE_URL } from "@/lib/constants";
import {
  TMDBError,
  type Movie,
  type MovieDetails,
  type Credits,
  type TMDBResponse,
} from "./types";
import {
  movieSchema,
  movieDetailsSchema,
  creditsSchema,
  tmdbResponseSchema,
} from "./schemas";

// Get API key from environment variables
function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new TMDBError("TMDB API key is not configured");
  }
  return apiKey;
}

// Generic fetch function with error handling and validation
async function tmdbFetch<T>(
  endpoint: string,
  schema: { parse: (data: unknown) => T },
  cacheOptions?: RequestInit["cache"]
): Promise<T> {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE_URL}${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${apiKey}`;

  try {
    const response = await fetch(url, {
      cache: cacheOptions,
      next: cacheOptions ? undefined : { revalidate: 0 },
    });

    if (!response.ok) {
      throw new TMDBError(
        `TMDB API error: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data: unknown = await response.json();

    // Validate the response with Zod schema
    const validatedData = schema.parse(data);

    return validatedData;
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new TMDBError(`Failed to fetch from TMDB: ${error.message}`);
    }

    throw new TMDBError("Unknown error occurred while fetching from TMDB");
  }
}

// Get trending movies
export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week"
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch(
    `/trending/movie/${timeWindow}`,
    tmdbResponseSchema(movieSchema),
    "force-cache" // Cache for 1 hour
  );
}

// Get popular movies
export async function getPopularMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch(
    `/movie/popular?page=${page}`,
    tmdbResponseSchema(movieSchema),
    "force-cache" // Cache for 1 hour
  );
}

// Get movie details
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbFetch(
    `/movie/${id}`,
    movieDetailsSchema,
    "force-cache" // Cache for 24 hours
  );
}

// Get movie credits (cast and crew)
export async function getMovieCredits(id: number): Promise<Credits> {
  return tmdbFetch(
    `/movie/${id}/credits`,
    creditsSchema,
    "force-cache" // Cache for 24 hours
  );
}

// Search movies
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  const encodedQuery = encodeURIComponent(query);
  return tmdbFetch(
    `/search/movie?query=${encodedQuery}&page=${page}`,
    tmdbResponseSchema(movieSchema),
    "no-store" // Don't cache search results
  );
}

// Get top rated movies
export async function getTopRatedMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch(
    `/movie/top_rated?page=${page}`,
    tmdbResponseSchema(movieSchema),
    "force-cache"
  );
}

// Get upcoming movies
export async function getUpcomingMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch(
    `/movie/upcoming?page=${page}`,
    tmdbResponseSchema(movieSchema),
    "force-cache"
  );
}

// Get now playing movies
export async function getNowPlayingMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch(
    `/movie/now_playing?page=${page}`,
    tmdbResponseSchema(movieSchema),
    "force-cache"
  );
}
