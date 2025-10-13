import { unstable_cache } from "next/cache";
import { tmdbClient } from "./tmdb";

/**
 * Обертки для методов TMDB с агрессивным кешированием через unstable_cache
 * Это дополнительный уровень кеширования на уровне сервера Next.js
 */

// Кешированные списки фильмов (1 час)
export const getCachedPopularMovies = unstable_cache(
  async (page: number = 1) => {
    return tmdbClient.getPopularMovies(page);
  },
  ["popular-movies"],
  {
    revalidate: 3600, // 1 час
    tags: ["popular-movies", "movies"],
  }
);

export const getCachedTopRatedMovies = unstable_cache(
  async (page: number = 1) => {
    return tmdbClient.getTopRatedMovies(page);
  },
  ["top-rated-movies"],
  {
    revalidate: 3600, // 1 час
    tags: ["top-rated-movies", "movies"],
  }
);

export const getCachedNowPlayingMovies = unstable_cache(
  async (page: number = 1) => {
    return tmdbClient.getNowPlayingMovies(page);
  },
  ["now-playing-movies"],
  {
    revalidate: 3600, // 1 час
    tags: ["now-playing-movies", "movies"],
  }
);

export const getCachedUpcomingMovies = unstable_cache(
  async (page: number = 1) => {
    return tmdbClient.getUpcomingMovies(page);
  },
  ["upcoming-movies"],
  {
    revalidate: 3600, // 1 час
    tags: ["upcoming-movies", "movies"],
  }
);

// Кешированные трендовые фильмы (30 минут)
export const getCachedTrendingMovies = unstable_cache(
  async (timeWindow: "day" | "week" = "week") => {
    return tmdbClient.getTrendingMovies(timeWindow);
  },
  ["trending-movies"],
  {
    revalidate: 1800, // 30 минут
    tags: ["trending-movies", "movies"],
  }
);

// Кешированные детали фильма (24 часа)
export const getCachedMovieDetails = unstable_cache(
  async (movieId: number) => {
    return tmdbClient.getMovieDetails(movieId);
  },
  ["movie-details"],
  {
    revalidate: 86400, // 24 часа
    tags: ["movie-details"],
  }
);

// Кешированные жанры (7 дней - почти статичны)
export const getCachedGenres = unstable_cache(
  async () => {
    return tmdbClient.getGenres();
  },
  ["genres"],
  {
    revalidate: 604800, // 7 дней
    tags: ["genres"],
  }
);

// Кешированный поиск (30 минут)
export const getCachedSearchMovies = unstable_cache(
  async (query: string, page: number = 1) => {
    return tmdbClient.searchMovies(query, page);
  },
  ["search-movies"],
  {
    revalidate: 1800, // 30 минут
    tags: ["search"],
  }
);

// Кешированные похожие фильмы (1 час)
export const getCachedSimilarMovies = unstable_cache(
  async (movieId: number, page: number = 1) => {
    return tmdbClient.getSimilarMovies(movieId, page);
  },
  ["similar-movies"],
  {
    revalidate: 3600, // 1 час
    tags: ["similar-movies"],
  }
);

// Кешированные рекомендации (1 час)
export const getCachedMovieRecommendations = unstable_cache(
  async (movieId: number, page: number = 1) => {
    return tmdbClient.getMovieRecommendations(movieId, page);
  },
  ["movie-recommendations"],
  {
    revalidate: 3600, // 1 час
    tags: ["movie-recommendations"],
  }
);

// Кешированные кредиты (7 дней - статичны)
export const getCachedMovieCredits = unstable_cache(
  async (movieId: number) => {
    return tmdbClient.getMovieCredits(movieId);
  },
  ["movie-credits"],
  {
    revalidate: 604800, // 7 дней
    tags: ["movie-credits"],
  }
);

// Кешированные видео (7 дней - почти статичны)
export const getCachedMovieVideos = unstable_cache(
  async (movieId: number) => {
    return tmdbClient.getMovieVideos(movieId);
  },
  ["movie-videos"],
  {
    revalidate: 604800, // 7 дней
    tags: ["movie-videos"],
  }
);

// Кешированный discover (1 час)
export const getCachedDiscoverMovies = unstable_cache(
  async (
    params: {
      page?: number;
      genre?: number;
      year?: number;
      sortBy?: string;
      minRating?: number;
    } = {}
  ) => {
    return tmdbClient.discoverMovies(params);
  },
  ["discover-movies"],
  {
    revalidate: 3600, // 1 час
    tags: ["discover-movies", "movies"],
  }
);

/**
 * Функция для инвалидации кеша по тегам
 * Используйте в Server Actions или API Routes
 */
export async function revalidateMovieCache(tags: string[] = ["movies"]) {
  const { revalidateTag } = await import("next/cache");
  tags.forEach((tag) => revalidateTag(tag));
}

/**
 * Функция для предзагрузки критичных данных
 * Вызывайте на главной странице для прогрева кеша
 */
export async function preloadCriticalData() {
  try {
    // Загружаем критичные данные параллельно
    await Promise.allSettled([
      getCachedPopularMovies(1),
      getCachedTrendingMovies("week"),
      getCachedGenres(),
      getCachedTopRatedMovies(1),
    ]);
  } catch (error) {
    console.error("Error preloading critical data:", error);
  }
}
