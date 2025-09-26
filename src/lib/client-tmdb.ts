import { MoviesResponse } from "@/types/tmdb";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint: string): Promise<MoviesResponse> {
  const url = `${TMDB_BASE_URL}${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${TMDB_API_KEY}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export const clientTmdbApi = {
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return fetchFromTMDB(`/movie/popular?page=${page}`);
  },

  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    return fetchFromTMDB(`/movie/top_rated?page=${page}`);
  },

  async getUpcomingMovies(page: number = 1): Promise<MoviesResponse> {
    return fetchFromTMDB(`/movie/upcoming?page=${page}`);
  },
};
