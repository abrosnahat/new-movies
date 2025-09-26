import { Suspense } from "react";
import { Metadata } from "next";
import { tmdbClient } from "@/lib/tmdb";
import { TopRatedMoviesGrid } from "@/components/top-rated-movies-grid";

export const metadata: Metadata = {
  title: "Top Rated Movies - Watch Best Films Online Free | NewMovies",
  description:
    "Watch the highest rated movies online free in HD quality. Stream critically acclaimed films, award winners and cinema classics. The best movies ever made available for free streaming.",
  keywords:
    "top rated movies, best movies online, highest rated films, award winning movies, classic cinema, critically acclaimed movies",
  openGraph: {
    title: "Top Rated Movies - Watch Best Films Online Free | NewMovies",
    description:
      "Watch the highest rated movies online free in HD quality. Stream critically acclaimed films, award winners and cinema classics.",
    url: "https://new-movies.online/top-rated",
  },
  alternates: {
    canonical: "https://new-movies.online/top-rated",
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

async function TopRatedContent() {
  try {
    const topRatedMovies = await tmdbClient.getTopRatedMovies();

    return (
      <TopRatedMoviesGrid
        initialMovies={topRatedMovies.results}
        initialPage={topRatedMovies.page}
        totalPages={topRatedMovies.total_pages}
      />
    );
  } catch (error) {
    console.error("Error fetching top rated movies:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Error Loading Movies
          </h1>
          <p className="text-white/70 text-lg">
            Unable to fetch top rated movies. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export default function TopRatedPage() {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <TopRatedContent />
    </Suspense>
  );
}
