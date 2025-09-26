export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NewMovies",
  url: "https://new-movies.online",
  description:
    "Watch movies online free in HD quality. Stream latest blockbusters, trending films, and top-rated movies.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://new-movies.online/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NewMovies",
  url: "https://new-movies.online",
  logo: "https://new-movies.online/logo.png",
  description:
    "Your ultimate destination for watching movies online free in HD quality",
  sameAs: ["https://t.me/new_movies_website"],
};

export const movieStreamingServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NewMovies Streaming Service",
  url: "https://new-movies.online",
  description: "Free online movie streaming service with HD quality films",
  applicationCategory: "Entertainment",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free movie streaming service",
  },
  featureList: [
    "HD Quality Streaming",
    "No Registration Required",
    "Latest Movies",
    "Multiple Genres",
    "Mobile Friendly",
  ],
};

interface MovieData {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  genres?: Array<{ name: string }>;
  runtime?: number;
  adult: boolean;
  vote_average: number;
  vote_count: number;
}

export function generateMovieJsonLd(movie: MovieData) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date,
    genre: movie.genres?.map((g) => g.name) || [],
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    contentRating: movie.adult ? "R" : "PG-13",
    aggregateRating: movie.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          ratingCount: movie.vote_count,
          bestRating: 10,
          worstRating: 1,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://new-movies.online/movie/${movie.id}`,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://new-movies.online/movie/${movie.id}`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
          "https://schema.org/IOSPlatform",
          "https://schema.org/AndroidPlatform",
        ],
      },
      expectsAcceptanceOf: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        eligibleRegion: {
          "@type": "Country",
          name: "Worldwide",
        },
      },
    },
  };
}
