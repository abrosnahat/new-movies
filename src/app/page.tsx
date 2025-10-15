import { Suspense } from "react";
import { Metadata } from "next";
import {
  getCachedPopularMovies,
  getCachedTrendingMovies,
  getCachedTopRatedMovies,
  getCachedUpcomingMovies,
  preloadCriticalData,
} from "@/lib/cached-tmdb";
import { HeroSection } from "@/components/hero-section";
import { MovieList } from "@/components/movie-list";

export const metadata: Metadata = {
  title: "Watch Movies Online Free - Stream Latest Films in HD | NewMovies",
  description:
    "Watch the latest movies online free in HD quality. Stream blockbusters, action films, comedies, dramas and more. No sign-up required. Instant streaming of Hollywood movies and international cinema.",
  keywords:
    "watch movies online free, stream movies, latest movies 2024, HD movies online, free movie streaming, blockbusters online, hollywood movies, action movies online, comedy films, drama movies",
  openGraph: {
    title: "Watch Movies Online Free - Stream Latest Films in HD | NewMovies",
    description:
      "Watch the latest movies online free in HD quality. Stream blockbusters, action films, comedies, dramas and more. No sign-up required.",
    type: "website",
    url: "https://new-movies.online",
  },
  twitter: {
    title: "Watch Movies Online Free - Stream Latest Films in HD | NewMovies",
    description:
      "Watch the latest movies online free in HD quality. Stream blockbusters, action films, comedies, dramas and more. No sign-up required.",
  },
  alternates: {
    canonical: "https://new-movies.online",
  },
};

// Loading component
function MovieListSkeleton() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="h-8 bg-white/10 rounded w-48 mb-6 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-60">
              <div className="aspect-[2/3] bg-white/10 rounded-xl animate-pulse" />
              <div className="mt-4 space-y-2">
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

function HeroSkeleton() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex items-center">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-16 bg-white/10 rounded animate-pulse" />
            <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
              <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:block">
            <div className="aspect-[2/3] max-w-sm mx-auto bg-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Server component to fetch data
async function HomeContent() {
  try {
    // Предзагружаем критичные данные для прогрева кеша
    await preloadCriticalData();

    // Fetch data in parallel with caching
    const [trendingMovies, popularMovies, topRatedMovies, upcomingMovies] =
      await Promise.all([
        getCachedTrendingMovies("week"),
        getCachedPopularMovies(),
        getCachedTopRatedMovies(),
        getCachedUpcomingMovies(),
      ]);

    // Use trending movies for hero section (first 5)
    const heroMovies = trendingMovies.results.slice(0, 5);

    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection movies={heroMovies} />
        </Suspense>

        {/* Movie Lists */}
        <div className="space-y-8">
          <Suspense fallback={<MovieListSkeleton />}>
            <MovieList
              title="Trending This Week"
              movies={trendingMovies.results}
              size="lg"
            />
          </Suspense>

          <Suspense fallback={<MovieListSkeleton />}>
            <MovieList
              title="Popular Movies"
              movies={popularMovies.results}
              size="lg"
            />
          </Suspense>

          <Suspense fallback={<MovieListSkeleton />}>
            <MovieList
              title="Top Rated"
              movies={topRatedMovies.results}
              size="lg"
            />
          </Suspense>

          <Suspense fallback={<MovieListSkeleton />}>
            <MovieList
              title="Coming Soon"
              movies={upcomingMovies.results}
              size="lg"
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching movies:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-white/70 text-lg mb-8">
            We&apos;re having trouble loading the movies. Please check your TMDB
            API configuration.
          </p>
          <div className="glass rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">
              Quick Setup:
            </h3>
            <ol className="text-sm text-white/80 text-left space-y-1">
              <li>
                1. Get your API key from{" "}
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  TMDB
                </a>
              </li>
              <li>2. Add it to your .env.local file</li>
              <li>3. Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div>
          <HeroSkeleton />
          <MovieListSkeleton />
          <MovieListSkeleton />
          <MovieListSkeleton />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
