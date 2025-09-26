"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MovieListProps {
  title: string;
  movies: Movie[];
  showOverview?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function MovieList({
  title,
  movies,
  showOverview = false,
  size = "lg",
  href,
}: MovieListProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current
    ? scrollPosition <
      scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth
    : true;

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
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Section Header */}
      <div className="container mx-auto px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {href ? (
              <Link href={href} className="group cursor-pointer">
                <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  {title}
                  <span className="ml-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1">
                    →
                  </span>
                </h2>
              </Link>
            ) : (
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Movies Scroll Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto py-4 px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="flex-shrink-0 aspect-[2/3] w-[320px]"
            >
              <MovieCard
                movie={movie}
                index={index}
                showOverview={showOverview}
                size={size}
              />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden flex justify-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
