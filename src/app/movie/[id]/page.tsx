import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  Globe,
  MapPin,
  Tag,
  MessageSquare,
  Users,
  Camera,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import { tmdbClient } from "@/lib/tmdb";
import {
  formatRating,
  formatYear,
  formatRuntime,
  formatCurrency,
  getCountryFlag,
  getLanguageFlag,
  getMovieWatchUrl,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MovieList } from "@/components/movie-list";
import { TrailerButton } from "@/components/trailer-button";
import { ScrollToTop } from "@/components/scroll-to-top";

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
    const [
      movieDetails,
      credits,
      videos,
      images,
      reviews,
      keywords,
      externalIds,
      releaseDates,
      watchProviders,
      similarMovies,
      recommendations,
    ] = await Promise.all([
      tmdbClient.getMovieDetails(movieId),
      tmdbClient.getMovieCredits(movieId),
      tmdbClient.getMovieVideos(movieId),
      tmdbClient.getMovieImages(movieId),
      tmdbClient.getMovieReviews(movieId),
      tmdbClient.getMovieKeywords(movieId),
      tmdbClient.getMovieExternalIds(movieId),
      tmdbClient.getMovieReleaseDates(movieId),
      tmdbClient.getMovieWatchProviders(movieId),
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

    // Get movie watch URL
    const watchUrl = getMovieWatchUrl(movieDetails.title);

    // Get director and main cast
    const director = credits.crew.find((person) => person.job === "Director");
    const producers = credits.crew
      .filter((person) => person.job === "Producer")
      .slice(0, 3);
    const writers = credits.crew
      .filter(
        (person) => person.job === "Writer" || person.job === "Screenplay"
      )
      .slice(0, 3);
    const cinematographer = credits.crew.find(
      (person) => person.job === "Director of Photography"
    );
    const composer = credits.crew.find(
      (person) => person.job === "Original Music Composer"
    );
    const mainCast = credits.cast.slice(0, 12);

    return (
      <div className="min-h-screen">
        <ScrollToTop />
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

        {/* Watch Movie Section */}
        {watchUrl && (
          <section className="py-16 bg-gradient-to-b from-black/80 to-black/50">
            <div className="container mx-auto px-6 lg:px-8">
              {/* Back Button */}
              <div className="mb-8">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="glass rounded-full text-white/80 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Movies
                  </Button>
                </Link>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center">
                  <Play className="h-8 w-8 mr-3 text-red-500" />
                  Watch Movie
                </h2>
                <p className="text-white/80 text-lg">
                  Stream {movieDetails.title} online
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={watchUrl}
                    title={`Watch ${movieDetails.title}`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{ border: "none" }}
                  />
                </div>

                <div className="mt-6 text-center">
                  <p className="text-white/60 text-sm">
                    If the video doesn&apos;t load, try refreshing the page or
                    check your internet connection.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Movie Details Section */}
        <section className="py-16 bg-black/50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cast & Crew */}
              <div className="lg:col-span-2 space-y-8">
                {/* Crew Information */}
                <Card glass>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Key Crew
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {director && (
                        <div>
                          <h4 className="text-white/80 text-sm font-medium mb-1">
                            Director
                          </h4>
                          <p className="text-white">{director.name}</p>
                        </div>
                      )}
                      {producers.length > 0 && (
                        <div>
                          <h4 className="text-white/80 text-sm font-medium mb-1">
                            Producers
                          </h4>
                          <div className="space-y-1">
                            {producers.map((producer) => (
                              <p
                                key={producer.id}
                                className="text-white text-sm"
                              >
                                {producer.name}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {writers.length > 0 && (
                        <div>
                          <h4 className="text-white/80 text-sm font-medium mb-1">
                            Writers
                          </h4>
                          <div className="space-y-1">
                            {writers.map((writer) => (
                              <p key={writer.id} className="text-white text-sm">
                                {writer.name}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {cinematographer && (
                        <div>
                          <h4 className="text-white/80 text-sm font-medium mb-1">
                            Cinematography
                          </h4>
                          <p className="text-white">{cinematographer.name}</p>
                        </div>
                      )}
                      {composer && (
                        <div>
                          <h4 className="text-white/80 text-sm font-medium mb-1">
                            Music
                          </h4>
                          <p className="text-white">{composer.name}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Cast */}
                {mainCast.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Cast ({credits.cast.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mainCast.map((actor) => (
                          <div key={actor.id} className="text-center">
                            <div className="relative aspect-square w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-white/10">
                              {actor.profile_path ? (
                                <Image
                                  src={tmdbClient.getImageUrl(
                                    actor.profile_path,
                                    "w185"
                                  )}
                                  alt={actor.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users className="h-8 w-8 text-white/40" />
                                </div>
                              )}
                            </div>
                            <p className="text-white text-sm font-medium">
                              {actor.name}
                            </p>
                            <p className="text-white/60 text-xs">
                              {actor.character}
                            </p>
                          </div>
                        ))}
                      </div>
                      {credits.cast.length > 12 && (
                        <p className="text-center text-white/60 text-sm mt-4">
                          ... and {credits.cast.length - 12} more
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Keywords */}
                {keywords.keywords && keywords.keywords.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Tag className="h-5 w-5 mr-2" />
                        Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywords.keywords.slice(0, 15).map((keyword) => (
                          <span
                            key={keyword.id}
                            className="glass rounded-full px-3 py-1 text-sm text-white/90"
                          >
                            {keyword.name}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews */}
                {reviews.results && reviews.results.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Reviews ({reviews.total_results})
                      </h3>
                      <div className="space-y-4">
                        {reviews.results.slice(0, 3).map((review) => (
                          <div
                            key={review.id}
                            className="border-l-2 border-white/20 pl-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-white font-medium">
                                {review.author}
                              </p>
                              {review.author_details.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-white/70">
                                    {review.author_details.rating}/10
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {review.content.length > 300
                                ? `${review.content.substring(0, 300)}...`
                                : review.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Videos */}
                {videos.results && videos.results.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Play className="h-5 w-5 mr-2" />
                        Videos ({videos.results.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videos.results.slice(0, 6).map((video) => (
                          <div key={video.id} className="glass rounded-lg p-3">
                            <p className="text-white font-medium text-sm mb-1">
                              {video.name}
                            </p>
                            <p className="text-white/60 text-xs">
                              {video.type} • {video.site}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Images Gallery */}
                {images.backdrops && images.backdrops.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Gallery ({images.backdrops.length} images)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.backdrops.slice(0, 6).map((image, index) => (
                          <div key={index} className="relative aspect-video">
                            <Image
                              src={tmdbClient.getImageUrl(
                                image.file_path,
                                "w500"
                              )}
                              alt={`${movieDetails.title} image ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
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

                      <div className="flex justify-between">
                        <span className="text-white/60">Language</span>
                        <span className="text-white flex items-center gap-1">
                          <span className="text-base">
                            {getLanguageFlag(movieDetails.original_language)}
                          </span>
                          {movieDetails.original_language.toUpperCase()}
                        </span>
                      </div>

                      {movieDetails.popularity && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Popularity</span>
                          <span className="text-white">
                            {Math.round(movieDetails.popularity)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* External Links */}
                {(externalIds.imdb_id ||
                  externalIds.facebook_id ||
                  externalIds.twitter_id ||
                  externalIds.instagram_id) && (
                  <Card glass>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        External Links
                      </h3>
                      <div className="space-y-2">
                        {externalIds.imdb_id && (
                          <a
                            href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            IMDb
                          </a>
                        )}
                        {externalIds.facebook_id && (
                          <a
                            href={`https://www.facebook.com/${externalIds.facebook_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Facebook
                          </a>
                        )}
                        {externalIds.twitter_id && (
                          <a
                            href={`https://twitter.com/${externalIds.twitter_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Twitter
                          </a>
                        )}
                        {externalIds.instagram_id && (
                          <a
                            href={`https://www.instagram.com/${externalIds.instagram_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Instagram
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Countries and Languages */}
                <Card glass>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Countries & Languages
                    </h3>

                    {movieDetails.production_countries.length > 0 && (
                      <div>
                        <h4 className="text-white/80 text-sm font-medium mb-2">
                          Production Countries
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails.production_countries.map((country) => (
                            <span
                              key={country.iso_3166_1}
                              className="glass rounded-full px-3 py-1 text-xs text-white/90 flex items-center gap-1"
                            >
                              <span className="text-base">
                                {getCountryFlag(country.iso_3166_1)}
                              </span>
                              {country.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {movieDetails.spoken_languages.length > 0 && (
                      <div>
                        <h4 className="text-white/80 text-sm font-medium mb-2">
                          Spoken Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails.spoken_languages.map((language) => (
                            <span
                              key={language.iso_639_1}
                              className="glass rounded-full px-3 py-1 text-xs text-white/90 flex items-center gap-1"
                            >
                              <span className="text-base">
                                {getLanguageFlag(language.iso_639_1)}
                              </span>
                              {language.english_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Release Information */}
                {releaseDates.results && releaseDates.results.length > 0 && (
                  <Card glass>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Release Dates
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {releaseDates.results.slice(0, 10).map((release) => (
                          <div key={release.iso_3166_1} className="text-sm">
                            {release.release_dates.map((date, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-1"
                              >
                                <span className="text-white/80 flex items-center gap-2">
                                  <span className="text-base">
                                    {getCountryFlag(release.iso_3166_1)}
                                  </span>
                                  {release.iso_3166_1}
                                </span>
                                <span className="text-white/60">
                                  {new Date(
                                    date.release_date
                                  ).toLocaleDateString()}
                                  {date.certification && (
                                    <span className="ml-2 glass rounded px-1 text-xs">
                                      {date.certification}
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Watch Providers */}
                {watchProviders.results &&
                  Object.keys(watchProviders.results).length > 0 && (
                    <Card glass>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <Play className="h-5 w-5 mr-2" />
                          Where to Watch
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(watchProviders.results)
                            .slice(0, 5)
                            .map(([country, providers]) => (
                              <div key={country}>
                                <h4 className="text-white/80 text-sm font-medium mb-2">
                                  {country.toUpperCase()}
                                </h4>
                                <div className="space-y-2">
                                  {providers.flatrate && (
                                    <div>
                                      <span className="text-xs text-white/60">
                                        Streaming:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {providers.flatrate
                                          .slice(0, 5)
                                          .map((provider) => (
                                            <span
                                              key={provider.provider_id}
                                              className="glass rounded px-2 py-1 text-xs text-white/90"
                                            >
                                              {provider.provider_name}
                                            </span>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  {providers.rent && (
                                    <div>
                                      <span className="text-xs text-white/60">
                                        Rent:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {providers.rent
                                          .slice(0, 5)
                                          .map((provider) => (
                                            <span
                                              key={provider.provider_id}
                                              className="glass rounded px-2 py-1 text-xs text-white/90"
                                            >
                                              {provider.provider_name}
                                            </span>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  {providers.buy && (
                                    <div>
                                      <span className="text-xs text-white/60">
                                        Buy:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {providers.buy
                                          .slice(0, 5)
                                          .map((provider) => (
                                            <span
                                              key={provider.provider_id}
                                              className="glass rounded px-2 py-1 text-xs text-white/90"
                                            >
                                              {provider.provider_name}
                                            </span>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

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
