import { z } from "zod";

// Genre schema
export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Movie schema
export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string().default(''),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().default(''),
  vote_average: z.number().default(0),
  vote_count: z.number().default(0),
  popularity: z.number().default(0),
  genre_ids: z.array(z.number()).default([]),
  adult: z.boolean().default(false),
  video: z.boolean().default(false),
  original_language: z.string().default('en'),
});

// Production Company schema
export const productionCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullable(),
  origin_country: z.string(),
});

// Production Country schema
export const productionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

// Spoken Language schema
export const spokenLanguageSchema = z.object({
  iso_639_1: z.string(),
  name: z.string(),
  english_name: z.string(),
});

// Movie Details schema
export const movieDetailsSchema = movieSchema
  .omit({ genre_ids: true })
  .extend({
    runtime: z.number(),
    genres: z.array(genreSchema),
    budget: z.number(),
    revenue: z.number(),
    status: z.string(),
    tagline: z.string().nullable(),
    homepage: z.string().nullable(),
    imdb_id: z.string().nullable(),
    production_companies: z.array(productionCompanySchema),
    production_countries: z.array(productionCountrySchema),
    spoken_languages: z.array(spokenLanguageSchema),
  });

// Cast schema
export const castSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
  cast_id: z.number(),
  credit_id: z.string(),
  gender: z.number(),
  known_for_department: z.string(),
});

// Crew schema
export const crewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
  credit_id: z.string(),
  gender: z.number(),
});

// Credits schema
export const creditsSchema = z.object({
  cast: z.array(castSchema),
  crew: z.array(crewSchema),
});

// TMDB Response schema
export const tmdbResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    page: z.number(),
    results: z.array(itemSchema),
    total_pages: z.number(),
    total_results: z.number(),
  });
