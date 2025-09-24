import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { tmdbClient } from "@/lib/tmdb";
import {
  formatRating,
  formatYear,
  formatRuntime,
  formatCurrency,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MovieList } from "@/components/movie-list";
import { TrailerButton } from "@/components/trailer-button";

interface MoviePageProps {
  params: {
    id: string;
  };
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
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
            <div className="lg:col-span-4">
              <div className="aspect-[2/3] max-w-sm mx-auto bg-white/10 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function MovieContent({ id }: { id: string }) {
  try {
    const movieId = parseInt(id);
    if (isNaN(movieId)) {
      notFound();
    }

    // Fetch movie details and related data in parallel
    const [movieDetails, credits, videos, similarMovies, recommendations] =
      await Promise.all([
        tmdbClient.getMovieDetails(movieId),
        tmdbClient.getMovieCredits(movieId),
        tmdbClient.getMovieVideos(movieId),
        tmdbClient.getSimilarMovies(movieId),
        tmdbClient.getMovieRecommendations(movieId),
      ]);

    const backdropUrl = tmdbClient.getBackdropUrl(
      movieDetails.backdrop_path,
      "w1280"
    );
    const posterUrl = tmdbClient.getImageUrl(movieDetails.poster_path, "w500");
    const rating = formatRating(movieDetails.vote_average);
    const year = movieDetails.release_date
      ? formatYear(movieDetails.release_date)
      : "TBD";
    const runtime = movieDetails.runtime
      ? formatRuntime(movieDetails.runtime)
      : "";

    // Find the main trailer
    const trailer =
      videos.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      ) || videos.results.find((video) => video.site === "YouTube");

    // Get director and main cast
    const director = credits.crew.find((person) => person.job === "Director");
    const mainCast = credits.cast.slice(0, 6);

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={movieDetails.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Back Button */}
          <div className="absolute top-24 left-6 lg:left-8 z-20">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="glass rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Movie Info */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    <span className="text-gradient">{movieDetails.title}</span>
                  </h1>

                  {/* Tagline */}
                  {movieDetails.tagline && (
                    <p className="text-xl md:text-2xl text-white/80 italic">
                      &ldquo;{movieDetails.tagline}&rdquo;
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1 glass rounded-lg px-3 py-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{year}</span>
                    </div>
                    {runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{runtime}</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="glass rounded-full px-3 py-1 text-sm text-white/90"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Overview */}
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
                    {movieDetails.overview}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {trailer && (
                      <TrailerButton
                        trailerKey={trailer.key}
                        movieTitle={movieDetails.title}
                      />
                    )}
                    {movieDetails.homepage && (
                      <a
                        href={"https://t.me/new_movies_website"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="lg" variant="secondary">
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Telegram Channel
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                {/* Movie Poster */}
                <div className="lg:col-span-4">
                  <div className="relative aspect-[2/3] max-w-sm mx-auto">
                    <Image
                      src={posterUrl}
                      alt={movieDetails.title}
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      quality={90}
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Movie Details Section */}
        <section className="py-16 bg-black/50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cast & Crew */}
              <div className="lg:col-span-2 space-y-8">
                {/* Director */}
                {director && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Director
                      </h3>
                      <p className="text-white/80">{director.name}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Cast */}
                {mainCast.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Main Cast
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mainCast.map((actor) => (
                          <div key={actor.id} className="text-center">
                            {actor.profile_path && (
                              <div className="relative aspect-square w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                                <Image
                                  src={tmdbClient.getImageUrl(
                                    actor.profile_path,
                                    "w185"
                                  )}
                                  alt={actor.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <p className="text-white text-sm font-medium">
                              {actor.name}
                            </p>
                            <p className="text-white/60 text-xs">
                              {actor.character}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Movie Stats */}
              <div className="space-y-6">
                <Card glass>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-white">
                      Movie Details
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Status</span>
                        <span className="text-white">
                          {movieDetails.status}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/60">Rating</span>
                        <span className="text-white">{rating}/10</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-white/60">Votes</span>
                        <span className="text-white">
                          {movieDetails.vote_count.toLocaleString()}
                        </span>
                      </div>

                      {movieDetails.budget > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Budget</span>
                          <span className="text-white">
                            {formatCurrency(movieDetails.budget)}
                          </span>
                        </div>
                      )}

                      {movieDetails.revenue > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Revenue</span>
                          <span className="text-white">
                            {formatCurrency(movieDetails.revenue)}
                          </span>
                        </div>
                      )}

                      {movieDetails.runtime && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Runtime</span>
                          <span className="text-white">{runtime}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Production Companies */}
                {movieDetails.production_companies.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Production
                      </h3>
                      <div className="space-y-2">
                        {movieDetails.production_companies
                          .slice(0, 3)
                          .map((company) => (
                            <p
                              key={company.id}
                              className="text-white/80 text-sm"
                            >
                              {company.name}
                            </p>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Similar Movies */}
        {similarMovies.results.length > 0 && (
          <section className="py-16">
            <MovieList
              title="Similar Movies"
              movies={similarMovies.results}
              size="lg"
            />
          </section>
        )}

        {/* Recommendations */}
        {recommendations.results.length > 0 && (
          <section className="py-16">
            <MovieList
              title="You Might Also Like"
              movies={recommendations.results}
              size="lg"
            />
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<MovieDetailSkeleton />}>
      <MovieContent id={id} />
    </Suspense>
  );
}
