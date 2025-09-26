import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import {
  websiteJsonLd,
  organizationJsonLd,
  movieStreamingServiceJsonLd,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NewMovies - Watch Movies Online Free | Stream Latest Films HD",
    template: "%s | NewMovies - Watch Online Free",
  },
  description:
    "Watch movies online free in HD quality. Stream latest blockbusters, trending films, and top-rated movies. No registration required. Instant streaming of Hollywood movies, action films, comedy, drama and more.",
  keywords: [
    "watch movies online",
    "free movies online",
    "stream movies",
    "watch films online",
    "online cinema",
    "free streaming",
    "HD movies",
    "latest movies",
    "blockbusters online",
    "hollywood movies",
    "action movies",
    "comedy films",
    "drama movies",
    "thriller movies",
    "watch movies free",
    "movie streaming",
    "cinema online",
    "films online",
    "new movies 2024",
    "popular movies",
  ],
  authors: [{ name: "NewMovies Team" }],
  creator: "NewMovies",
  publisher: "NewMovies",
  metadataBase: new URL("https://new-movies.online"),
  alternates: {
    canonical: "https://new-movies.online",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://new-movies.online",
    title: "NewMovies - Watch Movies Online Free | Stream Latest Films HD",
    description:
      "Watch movies online free in HD quality. Stream latest blockbusters, trending films, and top-rated movies. No registration required.",
    siteName: "NewMovies",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NewMovies - Watch Movies Online Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@newmovies",
    creator: "@newmovies",
    title: "NewMovies - Watch Movies Online Free | Stream Latest Films HD",
    description:
      "Watch movies online free in HD quality. Stream latest blockbusters, trending films, and top-rated movies. No registration required.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={movieStreamingServiceJsonLd} />
      </head>
      <body className={`${inter.className} font-sans`}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
