// SEO utility functions for content optimization

interface MovieForSEO {
  title: string;
  release_date?: string;
  genres?: Array<{ name: string }>;
  vote_average?: number;
  runtime?: number;
  overview?: string;
}

export function generatePageTitle(
  title: string,
  suffix: string = "NewMovies"
): string {
  return title.length > 60
    ? `${title.substring(0, 57)}... | ${suffix}`
    : `${title} | ${suffix}`;
}

export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  if (content.length <= maxLength) return content;

  // Find the last complete sentence within the limit
  const truncated = content.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastPeriod > maxLength - 50) {
    return truncated.substring(0, lastPeriod + 1);
  } else if (lastSpace > maxLength - 20) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

export function generateKeywords(movie: MovieForSEO): string[] {
  const keywords: string[] = [];

  // Add movie title variations
  keywords.push(`watch ${movie.title} online`);
  keywords.push(`${movie.title} streaming`);
  keywords.push(`${movie.title} free online`);
  keywords.push(`${movie.title} HD`);

  // Add year if available
  if (movie.release_date) {
    const year = new Date(movie.release_date).getFullYear();
    keywords.push(`${movie.title} ${year}`);
    keywords.push(`${year} movies`);
  }

  // Add genres
  if (movie.genres && movie.genres.length > 0) {
    movie.genres.forEach((genre) => {
      keywords.push(`${genre.name.toLowerCase()} movies online`);
      keywords.push(`watch ${genre.name.toLowerCase()} films`);
    });
  }

  // Add general streaming keywords
  keywords.push("free movie streaming");
  keywords.push("watch movies online");
  keywords.push("HD movies online");
  keywords.push("stream movies free");

  return keywords;
}

export function generateRichSnippetText(movie: MovieForSEO): string {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const rating = movie.vote_average
    ? `Rating: ${movie.vote_average.toFixed(1)}/10`
    : "";
  const runtime = movie.runtime
    ? `Duration: ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "";
  const genres = movie.genres ? movie.genres.map((g) => g.name).join(", ") : "";

  let text = `Watch ${movie.title}`;
  if (year) text += ` (${year})`;
  text += " online free in HD quality.";

  if (genres) text += ` Genre: ${genres}.`;
  if (rating) text += ` ${rating}.`;
  if (runtime) text += ` ${runtime}.`;

  if (movie.overview) {
    const shortOverview = generateMetaDescription(movie.overview, 200);
    text += ` ${shortOverview}`;
  }

  text += " Stream instantly without registration.";

  return text;
}

export function generateFAQSchema(movie: MovieForSEO) {
  const faqs = [
    {
      question: `How can I watch ${movie.title} online for free?`,
      answer: `You can watch ${movie.title} online for free on NewMovies in HD quality. No registration or subscription required. Simply click play and start streaming instantly.`,
    },
    {
      question: `Is ${movie.title} available in HD quality?`,
      answer: `Yes, ${movie.title} is available to stream in high definition (HD) quality on NewMovies. We provide the best viewing experience with crystal clear video and audio.`,
    },
    {
      question: `Do I need to create an account to watch ${movie.title}?`,
      answer: `No, you don't need to create an account or register to watch ${movie.title}. Our free streaming service allows instant access to movies without any sign-up process.`,
    },
    {
      question: `What genre is ${movie.title}?`,
      answer:
        movie.genres && movie.genres.length > 0
          ? `${movie.title} is a ${movie.genres
              .map((g) => g.name)
              .join(", ")} movie.`
          : `${movie.title} is available for streaming on NewMovies.`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
