import { Suspense } from "react";
import { Metadata } from "next";
import { getCachedUpcomingMovies } from "@/lib/cached-tmdb";
import { UpcomingMoviesGrid } from "@/components/upcoming-movies-grid";

export const metadata: Metadata = {
  title: "Upcoming Movies - Watch Latest Releases Online | NewMovies",
  description:
    "Watch upcoming and latest movie releases online free in HD. Stream new blockbusters, sequels and anticipated films. Stay updated with the newest movies coming soon.",
  keywords:
    "upcoming movies, new releases, latest movies 2024, new films online, movie releases, coming soon movies",
  openGraph: {
    title: "Upcoming Movies - Watch Latest Releases Online | NewMovies",
    description:
      "Watch upcoming and latest movie releases online free in HD. Stream new blockbusters, sequels and anticipated films.",
    url: "https://new-movies.online/upcoming",
  },
  alternates: {
    canonical: "https://new-movies.online/upcoming",
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

async function UpcomingContent() {
  try {
    const upcomingMovies = await getCachedUpcomingMovies();

    return (
      <UpcomingMoviesGrid
        initialMovies={upcomingMovies.results}
        initialPage={upcomingMovies.page}
        totalPages={upcomingMovies.total_pages}
      />
    );
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Error Loading Movies
          </h1>
          <p className="text-white/70 text-lg">
            Unable to fetch upcoming movies. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export default function UpcomingPage() {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <UpcomingContent />
    </Suspense>
  );
}
