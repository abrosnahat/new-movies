"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Movie, MoviesResponse } from "@/types/tmdb";
import { MovieGrid } from "./movie-grid";
import { BackToTop } from "./back-to-top";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function searchMovies(
  query: string,
  page: number = 1
): Promise<MoviesResponse> {
  if (!query.trim()) {
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }

  const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
    query
  )}&page=${page}&api_key=${TMDB_API_KEY}`;

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

export function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setMovies([]);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await searchMovies(query);
        setMovies(results.results);
        setTotalResults(results.total_results);
        setCurrentPage(results.page);
        setTotalPages(results.total_pages);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search movies. Please try again.");
        setMovies([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // Debounced URL update for search results page
  useEffect(() => {
    if (window.location.pathname === "/search") {
      const timer = setTimeout(() => {
        const url = new URL(window.location.href);
        if (query.trim()) {
          url.searchParams.set("q", query);
        } else {
          url.searchParams.delete("q");
        }
        window.history.replaceState({}, "", url.toString());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [query]);

  const loadMoreResults = async () => {
    if (!query.trim() || loadingMore || currentPage >= totalPages) return;

    setLoadingMore(true);
    try {
      const results = await searchMovies(query, currentPage + 1);
      setMovies((prev) => [...prev, ...results.results]);
      setCurrentPage(results.page);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">Search Movies</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Find your favorite movies by title, genre, or actor
          </p>

          {/* Search Stats */}
          {query && !loading && (
            <div className="text-white/60 text-sm">
              {totalResults > 0 ? (
                <>
                  Found {totalResults.toLocaleString()} results for &quot;
                  {query}&quot;
                </>
              ) : (
                <>No results found for &quot;{query}&quot;</>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center space-y-4 py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white/70">Searching movies...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={() => setQuery(query + " ")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && movies.length > 0 && (
          <>
            <div className="transition-all duration-300">
              <MovieGrid movies={movies} />
            </div>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMoreResults}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors font-medium"
                >
                  {loadingMore ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading More...
                    </>
                  ) : (
                    `Load More (${totalResults - movies.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results State */}
        {!loading && !error && query && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                No movies found
              </h3>
              <p className="text-white/70 mb-6">
                We couldn&apos;t find any movies matching &quot;{query}&quot;.
                Try searching with different keywords.
              </p>
              <div className="space-y-2 text-sm text-white/60 text-left">
                <p>• Check your spelling</p>
                <p>• Try more general terms</p>
                <p>• Search by actor names or movie genres</p>
                <p>• Use the original movie title</p>
              </div>
            </div>
          </div>
        )}

        {/* Default State */}
        {!loading && !error && !query && (
          <div className="text-center py-12">
            <div className="glass rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                Discover Amazing Movies
              </h3>
              <p className="text-white/70 mb-6">
                Start typing above to search through thousands of movies. Find
                blockbusters, classics, indie films, and everything in between.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                <div>
                  <h4 className="font-medium text-white mb-2">Search by:</h4>
                  <ul className="space-y-1 text-left">
                    <li>• Movie titles</li>
                    <li>• Actor names</li>
                    <li>• Director names</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Popular searches:
                  </h4>
                  <ul className="space-y-1 text-left">
                    <li>• Marvel movies</li>
                    <li>• Action films</li>
                    <li>• Comedy movies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
