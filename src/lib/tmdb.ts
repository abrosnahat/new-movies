import {
  MovieDetails,
  MoviesResponse,
  Credits,
  VideosResponse,
  SearchResponse,
  Genre,
} from "@/types/tmdb";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

if (!API_KEY || !BASE_URL) {
  throw new Error("TMDB API key or base URL is not configured");
}

class TMDBClient {
  private async fetchFromTMDB<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const fullUrl = `${BASE_URL}${endpoint}`;
    const url = new URL(fullUrl);
    url.searchParams.append("api_key", API_KEY!);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Popular movies
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>("/movie/popular", {
      page: page.toString(),
      language: "en-US",
    });
  }

  // Top rated movies
  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>("/movie/top_rated", {
      page: page.toString(),
      language: "en-US",
    });
  }

  // Now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>("/movie/now_playing", {
      page: page.toString(),
      language: "en-US",
    });
  }

  // Upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>("/movie/upcoming", {
      page: page.toString(),
      language: "en-US",
    });
  }

  // Trending movies
  async getTrendingMovies(
    timeWindow: "day" | "week" = "week"
  ): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(`/trending/movie/${timeWindow}`, {
      language: "en-US",
    });
  }

  // Movie details
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromTMDB<MovieDetails>(`/movie/${movieId}`, {
      language: "en-US",
    });
  }

  // Movie credits
  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);
  }

  // Movie videos
  async getMovieVideos(movieId: number): Promise<VideosResponse> {
    return this.fetchFromTMDB<VideosResponse>(`/movie/${movieId}/videos`, {
      language: "en-US",
    });
  }

  // Similar movies
  async getSimilarMovies(
    movieId: number,
    page: number = 1
  ): Promise<MoviesResponse> {
    return this.fetchFromTMDB<MoviesResponse>(`/movie/${movieId}/similar`, {
      page: page.toString(),
      language: "en-US",
    });
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
      }
    );
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    return this.fetchFromTMDB<SearchResponse>("/search/movie", {
      query: encodeURIComponent(query),
      page: page.toString(),
      language: "en-US",
      include_adult: "false",
    });
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

    return this.fetchFromTMDB<MoviesResponse>("/discover/movie", queryParams);
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromTMDB<{ genres: Genre[] }>("/genre/movie/list", {
      language: "en-US",
    });
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
}

export const tmdbClient = new TMDBClient();
