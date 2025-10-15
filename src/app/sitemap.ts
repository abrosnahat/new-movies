import { MetadataRoute } from "next";
import {
  getCachedPopularMovies,
  getCachedTrendingMovies,
} from "@/lib/cached-tmdb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://new-movies.online";

  // Only homepage
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  try {
    // Get only movies from homepage (trending + popular)
    const [trendingMovies, popularMovies] = await Promise.all([
      getCachedTrendingMovies("week"),
      getCachedPopularMovies(),
    ]);

    // Combine movies from homepage only
    const homepageMovies = [
      ...trendingMovies.results,
      ...popularMovies.results,
    ];

    // Deduplicate
    const uniqueMovies = homepageMovies.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );

    // Create movie pages (only from homepage)
    const moviePages = uniqueMovies.map((movie) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...moviePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
