// TMDB API Configuration
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Image sizes
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
} as const;

// Genre IDs mapping
export const GENRE_IDS: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Helper function to get image URL
export function getImageUrl(
  path: string | null,
  type: "poster" | "backdrop" | "profile" = "poster",
  size: "small" | "medium" | "large" | "original" = "medium"
): string {
  if (!path) {
    // Return a placeholder image
    return `https://via.placeholder.com/500x750?text=No+Image`;
  }

  const sizeValue = IMAGE_SIZES[type][size];
  return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`;
}
