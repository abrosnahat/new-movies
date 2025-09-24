"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/tmdb";
import { tmdbClient } from "@/lib/tmdb";
import { formatRating, formatYear, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (!currentMovie) return null;

  const backdropUrl = tmdbClient.getBackdropUrl(
    currentMovie.backdrop_path,
    "w1280"
  );
  const posterUrl = tmdbClient.getImageUrl(currentMovie.poster_path, "w500");
  const rating = formatRating(currentMovie.vote_average);
  const year = currentMovie.release_date
    ? formatYear(currentMovie.release_date)
    : "TBD";

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={currentMovie.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Movie Info */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="lg:col-span-7 space-y-6"
                >
                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    <span className="text-gradient">{currentMovie.title}</span>
                  </h1>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1 glass rounded-lg px-3 py-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{year}</span>
                    </div>
                  </div>

                  {/* Overview */}
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                    {truncateText(currentMovie.overview, 200)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/movie/${currentMovie.id}`}>
                      <Button size="lg" variant="primary">
                        <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Watch
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Movie Poster */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="lg:col-span-4 hidden lg:block"
                >
                  <div className="relative aspect-[2/3] max-w-sm mx-auto">
                    <Image
                      src={posterUrl}
                      alt={currentMovie.title}
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      quality={90}
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 glass rounded-full p-3 hover:bg-white/20 transition-colors"
            aria-label="Previous movie"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 glass rounded-full p-3 hover:bg-white/20 transition-colors"
            aria-label="Next movie"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
