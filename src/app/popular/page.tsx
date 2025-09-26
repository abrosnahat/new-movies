import { Suspense } from "react";
import { Metadata } from "next";
import { tmdbClient } from "@/lib/tmdb";
import { MovieGrid } from "@/components/movie-grid";

export const metadata: Metadata = {
  title: "Popular Movies - Watch Online Free in HD | NewMovies",
  description:
    "Watch the most popular movies online free in HD quality. Stream trending blockbusters, action films, comedies and dramas. Updated daily with the latest popular movies.",
  keywords:
    "popular movies online, trending movies, watch popular films, blockbusters online, most watched movies, popular cinema",
  openGraph: {
    title: "Popular Movies - Watch Online Free in HD | NewMovies",
    description:
      "Watch the most popular movies online free in HD quality. Stream trending blockbusters, action films, comedies and dramas.",
    url: "https://new-movies.online/popular",
  },
  alternates: {
    canonical: "https://new-movies.online/popular",
  },
};

function MovieGridSkeleton() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-white/10 rounded w-2/3 mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[2/3] bg-white/10 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded animate-pulse" />
                <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function PopularContent() {
  try {
    const popularMovies = await tmdbClient.getPopularMovies();

    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-gradient">Popular Movies</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover the most popular movies that everyone&apos;s talking
              about
            </p>
          </div>

          <MovieGrid movies={popularMovies.results} showOverview={false} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching popular movies:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Error Loading Movies
          </h1>
          <p className="text-white/70 text-lg">
            Unable to fetch popular movies. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export default function PopularPage() {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <PopularContent />
    </Suspense>
  );
}
