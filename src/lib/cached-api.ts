import { cache } from "react";
import { tmdbClient } from "@/lib/tmdb";

// Кэшированные версии API вызовов
export const getCachedMovieDetails = cache(async (movieId: number) => {
  return tmdbClient.getMovieDetails(movieId);
});

export const getCachedMovieCredits = cache(async (movieId: number) => {
  return tmdbClient.getMovieCredits(movieId);
});

export const getCachedMovieVideos = cache(async (movieId: number) => {
  return tmdbClient.getMovieVideos(movieId);
});

export const getCachedMovieImages = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieImages(movieId);
  } catch {
    return { backdrops: [], posters: [] };
  }
});

export const getCachedMovieReviews = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieReviews(movieId);
  } catch {
    return { results: [], total_results: 0 };
  }
});

export const getCachedMovieKeywords = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieKeywords(movieId);
  } catch {
    return { keywords: [] };
  }
});

export const getCachedMovieExternalIds = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieExternalIds(movieId);
  } catch {
    return {
      imdb_id: null,
      facebook_id: null,
      twitter_id: null,
      instagram_id: null,
    };
  }
});

export const getCachedMovieReleaseDates = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieReleaseDates(movieId);
  } catch {
    return { results: [] };
  }
});

export const getCachedMovieWatchProviders = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieWatchProviders(movieId);
  } catch {
    return { results: {} };
  }
});

export const getCachedSimilarMovies = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getSimilarMovies(movieId);
  } catch {
    return { results: [] };
  }
});

export const getCachedMovieRecommendations = cache(async (movieId: number) => {
  try {
    return await tmdbClient.getMovieRecommendations(movieId);
  } catch {
    return { results: [] };
  }
});
