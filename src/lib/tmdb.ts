import {
  MovieDetails,
  MoviesResponse,
  Credits,
  VideosResponse,
  SearchResponse,
  Genre,
  MovieImages,
  ReviewsResponse,
  KeywordsResponse,
  ExternalIds,
  ReleaseDatesResponse,
  WatchProvidersResponse,
} from "@/types/tmdb";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

if (!API_KEY || !BASE_URL) {
  throw new Error("TMDB API key or base URL is not configured");
}

// Время кеширования для разных типов данных (в секундах)
const CACHE_TIMES = {
  // Список фильмов меняется редко - кешируем на 1 час
  MOVIE_LISTS: 3600,
  // Детали фильма почти статичны - кешируем на 24 часа
  MOVIE_DETAILS: 86400,
  // Жанры вообще не меняются - кешируем на 7 дней
  GENRES: 604800,
  // Поиск кешируем на 30 минут
  SEARCH: 1800,
  // Трендовые фильмы обновляются чаще - 30 минут
  TRENDING: 1800,
  // Статические данные (изображения, видео) - 7 дней
  STATIC_DATA: 604800,
};

class TMDBClient {
  // In-memory cache для критически важных данных
  private memoryCache: Map<string, { data: unknown; expires: number }> =
    new Map();

  private getFromMemoryCache<T>(key: string): T | null {
    const cached = this.memoryCache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data as T;
    }
    if (cached) {
      this.memoryCache.delete(key);
    }
    return null;
  }

  private setMemoryCache<T>(key: string, data: T, ttlSeconds: number): void {
    this.memoryCache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  private async fetchFromTMDB<T>(
    endpoint: string,
    params: Record<string, string> = {},
    cacheTime: number = CACHE_TIMES.MOVIE_LISTS,
    tags: string[] = []
  ): Promise<T> {
    // Проверяем memory cache
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    const cachedData = this.getFromMemoryCache<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const fullUrl = `${BASE_URL}${endpoint}`;
    const url = new URL(fullUrl);
    url.searchParams.append("api_key", API_KEY!);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      next: {
        revalidate: cacheTime,
        tags: tags.length > 0 ? tags : [endpoint.split("/")[1] || "tmdb"],
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Сохраняем в memory cache
    this.setMemoryCache(cacheKey, data, cacheTime);

    return data;
  }

  // Popular movies
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      "/movie/popular",
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_LISTS,
      ["popular", "movies"]
    );
  }

  // Top rated movies
  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      "/movie/top_rated",
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_LISTS,
      ["top-rated", "movies"]
    );
  }

  // Now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      "/movie/now_playing",
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_LISTS,
      ["now-playing", "movies"]
    );
  }

  // Upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      "/movie/upcoming",
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_LISTS,
      ["upcoming", "movies"]
    );
  }

  // Trending movies
  async getTrendingMovies(
    timeWindow: "day" | "week" = "week"
  ): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      `/trending/movie/${timeWindow}`,
      {
        language: "en-US",
      },
      CACHE_TIMES.TRENDING,
      ["trending", "movies"]
    );
  }

  // Movie details
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromTMDB<MovieDetails>(
      `/movie/${movieId}`,
      {
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_DETAILS,
      ["movie-details", `movie-${movieId}`]
    );
  }

  // Movie credits
  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromTMDB<Credits>(
      `/movie/${movieId}/credits`,
      {},
      CACHE_TIMES.STATIC_DATA,
      ["movie-credits", `movie-${movieId}`]
    );
  }

  // Movie videos
  async getMovieVideos(movieId: number): Promise<VideosResponse> {
    return this.fetchFromTMDB<VideosResponse>(
      `/movie/${movieId}/videos`,
      {
        language: "en-US",
      },
      CACHE_TIMES.STATIC_DATA,
      ["movie-videos", `movie-${movieId}`]
    );
  }

  // Movie images
  async getMovieImages(movieId: number): Promise<MovieImages> {
    return this.fetchFromTMDB<MovieImages>(
      `/movie/${movieId}/images`,
      {},
      CACHE_TIMES.STATIC_DATA,
      ["movie-images", `movie-${movieId}`]
    );
  }

  // Movie reviews
  async getMovieReviews(
    movieId: number,
    page: number = 1
  ): Promise<ReviewsResponse> {
    return this.fetchFromTMDB<ReviewsResponse>(
      `/movie/${movieId}/reviews`,
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.STATIC_DATA,
      ["movie-reviews", `movie-${movieId}`]
    );
  }

  // Movie keywords
  async getMovieKeywords(movieId: number): Promise<KeywordsResponse> {
    return this.fetchFromTMDB<KeywordsResponse>(
      `/movie/${movieId}/keywords`,
      {},
      CACHE_TIMES.STATIC_DATA,
      ["movie-keywords", `movie-${movieId}`]
    );
  }

  // Movie external IDs
  async getMovieExternalIds(movieId: number): Promise<ExternalIds> {
    return this.fetchFromTMDB<ExternalIds>(
      `/movie/${movieId}/external_ids`,
      {},
      CACHE_TIMES.STATIC_DATA,
      ["movie-external-ids", `movie-${movieId}`]
    );
  }

  // Movie release dates
  async getMovieReleaseDates(movieId: number): Promise<ReleaseDatesResponse> {
    return this.fetchFromTMDB<ReleaseDatesResponse>(
      `/movie/${movieId}/release_dates`,
      {},
      CACHE_TIMES.STATIC_DATA,
      ["movie-release-dates", `movie-${movieId}`]
    );
  }

  // Movie watch providers
  async getMovieWatchProviders(
    movieId: number
  ): Promise<WatchProvidersResponse> {
    return this.fetchFromTMDB<WatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`,
      {},
      CACHE_TIMES.STATIC_DATA,
      ["movie-watch-providers", `movie-${movieId}`]
    );
  }

  // Similar movies
  async getSimilarMovies(
    movieId: number,
    page: number = 1
  ): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      `/movie/${movieId}/similar`,
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_LISTS,
      ["similar-movies", `movie-${movieId}`]
    );
  }

  // Movie recommendations
  async getMovieRecommendations(
    movieId: number,
    page: number = 1
  ): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(
      `/movie/${movieId}/recommendations`,
      {
        page: page.toString(),
        language: "en-US",
      },
      CACHE_TIMES.MOVIE_LISTS,
      ["movie-recommendations", `movie-${movieId}`]
    );
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    return this.fetchFromTMDB<SearchResponse>(
      "/search/movie",
      {
        query: encodeURIComponent(query),
        page: page.toString(),
        language: "en-US",
        include_adult: "false",
      },
      CACHE_TIMES.SEARCH,
      ["search"]
    );
  }

  // Discover movies with filters
  async discoverMovies(
    params: {
      page?: number;
      genre?: number;
      year?: number;
      sortBy?: string;
      minRating?: number;
    } = {}
  ): Promise<MoviesResponse> {
    const queryParams: Record<string, string> = {
      page: (params.page || 1).toString(),
      language: "en-US",
      include_adult: "false",
      include_video: "false",
    };

    if (params.genre) {
      queryParams.with_genres = params.genre.toString();
    }

    if (params.year) {
      queryParams.year = params.year.toString();
    }

    if (params.sortBy) {
      queryParams.sort_by = params.sortBy;
    } else {
      queryParams.sort_by = "popularity.desc";
    }

    if (params.minRating) {
      queryParams["vote_average.gte"] = params.minRating.toString();
    }

    return this.fetchFromTMDB<MoviesResponse>(
      "/discover/movie",
      queryParams,
      CACHE_TIMES.MOVIE_LISTS,
      ["discover", "movies"]
    );
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromTMDB<{ genres: Genre[] }>(
      "/genre/movie/list",
      {
        language: "en-US",
      },
      CACHE_TIMES.GENRES,
      ["genres"]
    );
  }

  // Helper method to get image URL
  getImageUrl(path: string | null, size: string = "w500"): string {
    if (!path) return "/placeholder-movie.svg";
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  // Helper method to get backdrop URL
  getBackdropUrl(path: string | null, size: string = "w1280"): string {
    if (!path) return "/placeholder-backdrop.svg";
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  // Очистка memory cache (полезно для тестирования)
  clearMemoryCache(): void {
    this.memoryCache.clear();
  }

  // Получить размер memory cache
  getMemoryCacheSize(): number {
    return this.memoryCache.size;
  }

  // Удалить устаревшие элементы из memory cache
  cleanExpiredCache(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expires < now) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

export const tmdbClient = new TMDBClient();
