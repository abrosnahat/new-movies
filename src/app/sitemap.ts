import { MetadataRoute } from "next";
import { tmdbClient } from "@/lib/tmdb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://new-movies.online";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-rated`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/upcoming`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  try {
    // Get popular movies for sitemap
    const [popularMovies, topRatedMovies] = await Promise.all([
      tmdbClient.getPopularMovies(),
      tmdbClient.getTopRatedMovies(),
    ]);

    // Combine and deduplicate movies
    const allMovies = [...popularMovies.results, ...topRatedMovies.results];
    const uniqueMovies = allMovies.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );

    // Create movie pages
    const moviePages = uniqueMovies.slice(0, 1000).map((movie) => ({
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
