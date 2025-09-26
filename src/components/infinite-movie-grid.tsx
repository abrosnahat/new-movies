"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Movie, MoviesResponse } from "@/types/tmdb";
import { MovieGrid } from "./movie-grid";
import { BackToTop } from "./back-to-top";

interface InfiniteMovieGridProps {
  initialMovies: Movie[];
  initialPage: number;
  totalPages: number;
  fetchMovies: (page: number) => Promise<MoviesResponse>;
  title: string;
  description: string;
}

export function InfiniteMovieGrid({
  initialMovies,
  initialPage,
  totalPages: initialTotalPages,
  fetchMovies,
  title,
  description,
}: InfiniteMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadNextPage = useCallback(async () => {
    if (isLoadingRef.current || currentPage >= totalPages) return;

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await fetchMovies(nextPage);

      // Filter out duplicates just in case
      setMovies((prevMovies) => {
        const existingIds = new Set(prevMovies.map((movie) => movie.id));
        const newMovies = response.results.filter(
          (movie) => !existingIds.has(movie.id)
        );
        return [...prevMovies, ...newMovies];
      });

      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error("Error loading next page:", err);
      setError("Failed to load more movies. Please try again.");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentPage, totalPages, fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && currentPage < totalPages) {
          loadNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadTriggerRef.current) {
      observer.observe(loadTriggerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage, loading, currentPage, totalPages]);

  const hasMorePages = currentPage < totalPages;

  return (
    <div className="min-h-screen pt-24">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">{title}</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-4">
            {description}
          </p>
          <div className="text-sm text-white/50">
            Showing {movies.length} of {totalPages * 20} movies
          </div>
        </div>

        <div className="transition-all duration-300">
          <MovieGrid movies={movies} showOverview={false} />
        </div>

        {/* Loading trigger element */}
        {hasMorePages && (
          <div ref={loadTriggerRef} className="mt-12 pb-8">
            {loading ? (
              <div className="space-y-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  <p className="text-white/70">Loading more movies...</p>
                </div>

                {/* Skeleton grid for loading state */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="space-y-4 animate-pulse"
                    >
                      <div className="aspect-[2/3] bg-white/10 rounded-xl" />
                      <div className="space-y-2">
                        <div className="h-5 bg-white/10 rounded" />
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/50">Scroll down to load more movies</p>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-8 text-center">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-200">{error}</p>
              <button
                onClick={loadNextPage}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* End of results message */}
        {!hasMorePages && movies.length > 0 && (
          <div className="mt-12 pb-8 text-center">
            <div className="inline-flex items-center space-x-2 text-white/50">
              <div className="h-px bg-white/20 flex-1 w-20"></div>
              <p>You&apos;ve seen all {movies.length} movies</p>
              <div className="h-px bg-white/20 flex-1 w-20"></div>
            </div>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
}
