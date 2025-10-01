"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Movie, MoviesResponse } from "@/types/tmdb";
import { MovieGrid } from "./movie-grid";
import { BackToTop } from "./back-to-top";

interface PopularMoviesGridProps {
  initialMovies: Movie[];
  initialPage: number;
  totalPages: number;
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchPopularMovies(page: number): Promise<MoviesResponse> {
  const url = `${TMDB_BASE_URL}/movie/popular?page=${page}&api_key=${TMDB_API_KEY}`;

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

export function PopularMoviesGrid({
  initialMovies,
  initialPage,
  totalPages: initialTotalPages,
}: PopularMoviesGridProps) {
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
      const response = await fetchPopularMovies(nextPage);

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
  }, [currentPage, totalPages]);

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
            <span className="text-gradient">Popular Movies</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
            Discover the most popular movies that everyone&apos;s talking about
          </p>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            <div className="glass rounded-xl p-6 text-left">
              <h2 className="text-lg font-semibold text-white mb-3">
                Watch Popular Movies Online Free in HD
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Stream the most popular movies online free in crystal-clear HD
                quality. Our collection features trending blockbusters,
                critically acclaimed films, and audience favorites that are
                currently making waves in cinemas worldwide. From action-packed
                superhero adventures to heartwarming romantic comedies, discover
                why these movies are capturing global attention.
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                Updated daily with the latest popular releases, our platform
                offers instant streaming of Hollywood&apos;s biggest hits,
                international cinema, and award-winning films. Experience the
                movies everyone&apos;s talking about with no sign-up required -
                just click and watch your favorite popular movies in high
                definition.
              </p>
            </div>
          </div>

          <div className="text-sm text-white/50">
            Showing {movies.length} of {totalPages * 20} movies
          </div>
        </div>

        <div className="transition-all duration-300">
          <MovieGrid movies={movies} />
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

        {/* Bottom SEO Content */}
        <div className="mt-16 mb-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Why Watch Popular Movies Online?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-white/80">
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Trending Entertainment
                  </h4>
                  <p className="leading-relaxed">
                    Stay current with the most popular movies that are
                    dominating box offices and streaming charts worldwide. From
                    blockbuster franchises to viral indie hits, discover what
                    everyone&apos;s watching.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    HD Quality Streaming
                  </h4>
                  <p className="leading-relaxed">
                    Experience popular movies in crystal-clear high definition
                    with optimized streaming technology. No buffering, no
                    interruptions - just seamless movie watching from any
                    device.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Always Updated
                  </h4>
                  <p className="leading-relaxed">
                    Our popular movies collection updates daily with the latest
                    trending films, ensuring you never miss the next big hit or
                    cultural phenomenon taking the world by storm.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Free & Instant
                  </h4>
                  <p className="leading-relaxed">
                    Watch popular movies online free with no sign-up required.
                    Click, stream, and enjoy the most talked-about films without
                    any subscription fees or hidden costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
