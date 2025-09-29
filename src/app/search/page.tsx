import { Suspense } from "react";
import { Metadata } from "next";
import { SearchResults } from "@/components/search-results";

export const metadata: Metadata = {
  title: "Search Movies - Find Your Favorite Films | NewMovies",
  description:
    "Search and discover movies by title, genre, actor, or director. Find your favorite films from our vast collection of popular, top-rated, and upcoming movies.",
  keywords:
    "search movies, find movies online, movie search, film search, discover movies, movie database",
  openGraph: {
    title: "Search Movies - Find Your Favorite Films | NewMovies",
    description:
      "Search and discover movies by title, genre, actor, or director. Find your favorite films from our vast collection.",
    url: "https://new-movies.online/search",
  },
  alternates: {
    canonical: "https://new-movies.online/search",
  },
};

function SearchSkeleton() {
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

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults />
    </Suspense>
  );
}
