import { OptimizedImage } from "@/components/optimized-image";

interface TMDBImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  type?: "poster" | "backdrop" | "profile";
}

const PLACEHOLDER_IMAGES = {
  poster: "/placeholder-movie.svg",
  backdrop: "/placeholder-backdrop.svg",
  profile: "/placeholder-movie.svg",
};

export function TMDBImage({
  src,
  alt,
  type = "poster",
  ...props
}: TMDBImageProps) {
  // Используем placeholder если src пустой или null
  const imageSrc = src || PLACEHOLDER_IMAGES[type];

  return <OptimizedImage src={imageSrc} alt={alt} {...props} />;
}
