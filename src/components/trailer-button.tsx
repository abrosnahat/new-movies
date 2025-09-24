"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrailerModal } from "@/components/trailer-modal";

interface TrailerButtonProps {
  trailerKey: string;
  movieTitle?: string;
  size?: "sm" | "lg" | "default" | "icon";
  variant?: "primary" | "secondary";
  className?: string;
}

export function TrailerButton({
  trailerKey,
  movieTitle,
  size = "lg",
  variant = "primary",
  className = "",
}: TrailerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        className={`group ${className}`}
        onClick={handleClick}
      >
        <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
        Watch Trailer
      </Button>

      <TrailerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trailerKey={trailerKey}
        movieTitle={movieTitle}
      />
    </>
  );
}
