import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NewMovies - Discover Amazing Movies",
  description:
    "Explore the latest, trending, and top-rated movies with NewMovies. Your ultimate destination for movie discovery.",
  keywords: [
    "movies",
    "cinema",
    "films",
    "entertainment",
    "TMDB",
    "movie database",
  ],
  authors: [{ name: "NewMovies Team" }],
  creator: "NewMovies",
  metadataBase: new URL("https://NewMovies.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://NewMovies.vercel.app",
    title: "NewMovies - Discover Amazing Movies",
    description:
      "Explore the latest, trending, and top-rated movies with NewMovies.",
    siteName: "NewMovies",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewMovies - Discover Amazing Movies",
    description:
      "Explore the latest, trending, and top-rated movies with NewMovies.",
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
      <body className={`${inter.className} font-sans`}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
