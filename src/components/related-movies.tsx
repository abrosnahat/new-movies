"use client";

import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/tmdb";

interface RelatedMoviesProps {
  movies: Movie[];
  currentMovieId: number;
  title: string;
}

export function RelatedMovies({
  movies,
  currentMovieId,
  title,
}: RelatedMoviesProps) {
  const relatedMovies = movies
    .filter((movie) => movie.id !== currentMovieId)
    .slice(0, 6);

  if (relatedMovies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group"
              title={`Watch ${movie.title} Online Free`}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/10">
                {movie.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={`Watch ${movie.title} Online Free`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-sm font-medium line-clamp-2">
                    {movie.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Text */}
        <div className="mt-8 text-white/60 text-sm">
          <p>
            Explore more movies similar to {title}. Watch these related films
            online free in HD quality. Stream action movies, comedy films, drama
            series and more without registration.
          </p>
        </div>
      </div>
    </section>
  );
}
