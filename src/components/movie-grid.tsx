"use client";

import { Movie } from "@/types/tmdb";
import { MovieCard } from "@/components/movie-card";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
}

export function MovieGrid({ movies, title }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <div className="space-y-8">
      {title && (
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">{title}</span>
          </h1>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="lg" />
        ))}
      </div>
    </div>
  );
}
