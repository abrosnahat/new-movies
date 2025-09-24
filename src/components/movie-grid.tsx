"use client";

import { Movie } from "@/types/tmdb";
import { MovieCard } from "@/components/movie-card";
import { motion } from "framer-motion";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  showOverview?: boolean;
}

export function MovieGrid({
  movies,
  title,
  showOverview = false,
}: MovieGridProps) {
  if (!movies.length) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {title && (
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">{title}</span>
          </h1>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            showOverview={showOverview}
            size="lg"
          />
        ))}
      </div>
    </motion.div>
  );
}
