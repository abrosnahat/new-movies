import Image from "next/image";

interface SimpleImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function SimpleImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  ...props
}: SimpleImageProps) {
  if (!src) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className} ${
          fill ? "absolute inset-0" : ""
        }`}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
      quality={75}
      placeholder="empty"
      loading={priority ? "eager" : "lazy"}
      unoptimized={true} // Временно отключаем оптимизацию
      {...props}
    />
  );
}
