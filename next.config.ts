import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration for TMDB
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "mc.yandex.ru",
        port: "",
        pathname: "/watch/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Добавляем качества изображений (включая 90 для существующих изображений)
    qualities: [25, 50, 75, 90, 100],
    // Кэширование изображений
    minimumCacheTTL: 31536000, // 1 год
    // Добавляем обработку ошибок
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Отключаем автоматический prefetch для всех ссылок
    linkNoTouchStart: true,
    // Оптимизация сборки
    optimizeCss: true,
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Compression
  compress: true,

  // Дополнительные оптимизации производительности
  poweredByHeader: false,
  reactStrictMode: true,

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Bundle analyzer (optional)
  ...(process.env.ANALYZE === "true" && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),
};

export default nextConfig;
