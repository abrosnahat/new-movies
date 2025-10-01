"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/tmdb";
import { tmdbClient } from "@/lib/tmdb";
import { formatRating, formatYear, truncateText } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  size?: "sm" | "md" | "lg";
}

export function MovieCard({ movie, index = 0, size = "lg" }: MovieCardProps) {
  const posterUrl = tmdbClient.getImageUrl(movie.poster_path, "w500");
  const year = movie.release_date ? formatYear(movie.release_date) : "TBD";
  const rating = formatRating(movie.vote_average);

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  const sizeClasses = {
    sm: "aspect-[2/3] w-full max-w-[180px] h-full",
    md: "aspect-[2/3] w-full max-w-[220px] h-full",
    lg: "aspect-[2/3] w-full max-w-[320px] h-full",
  };

  const titleClasses = {
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-lg font-bold",
  };

  return (
    <div className="group">
      <Link href={`/movie/${movie.id}`}>
        <Card
          className={`${sizeClasses[size]} overflow-hidden p-0 flex flex-col hover:scale-105 transition-transform duration-300 bg-white/10 border border-white/20`}
        >
          <div className="relative flex flex-col h-full w-full">
            {/* Movie Poster */}
            <div className="relative flex-shrink-0 aspect-[2/3] w-full overflow-hidden rounded-t-xl">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 6}
              />

              {/* Hover Overlay */}
              <motion.div
                variants={overlayVariants}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end"
              >
                <div className="p-4 w-full">
                  <h4 className="text-white font-bold text-sm mb-2 line-clamp-2">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 text-white/90 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{year}</span>
                    </div>
                  </div>
                  {movie.overview && (
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                      {truncateText(movie.overview, 120)}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1">
                <div className="flex items-center gap-1 text-xs text-white">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
