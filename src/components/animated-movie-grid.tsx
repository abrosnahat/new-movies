"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "./movie-card";

interface AnimatedMovieGridProps {
  movies: Movie[];
  showOverview?: boolean;
}

export function AnimatedMovieGrid({
  movies,
  showOverview = false,
}: AnimatedMovieGridProps) {
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [lastMovieCount, setLastMovieCount] = useState(0);

  useEffect(() => {
    if (movies.length > lastMovieCount) {
      // New movies added, animate them in
      const newMovies = movies.slice(lastMovieCount);
      let index = 0;

      const timer = setInterval(() => {
        if (index < newMovies.length) {
          setDisplayedMovies((prev) => [...prev, newMovies[index]]);
          index++;
        } else {
          clearInterval(timer);
          setLastMovieCount(movies.length);
        }
      }, 50); // 50ms delay between each movie appearing

      return () => clearInterval(timer);
    } else if (movies.length <= lastMovieCount) {
      // Initial load or reset
      setDisplayedMovies(movies);
      setLastMovieCount(movies.length);
    }
  }, [movies, lastMovieCount]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {displayedMovies.map((movie, index) => {
        const isNewMovie =
          index >= lastMovieCount - (movies.length - lastMovieCount);
        return (
          <div
            key={movie.id}
            className={`transform transition-all duration-500 ${
              isNewMovie ? "animate-in fade-in slide-in-from-bottom-4" : ""
            }`}
            style={{
              animationDelay: isNewMovie
                ? `${
                    (index -
                      (lastMovieCount - (movies.length - lastMovieCount))) *
                    50
                  }ms`
                : "0ms",
            }}
          >
            <MovieCard movie={movie} showOverview={showOverview} />
          </div>
        );
      })}
    </div>
  );
}
