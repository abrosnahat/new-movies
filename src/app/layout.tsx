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
import Script from "next/script";

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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
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

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104316810', 'ym');

            ym(104316810, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/104316810"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
      </body>
    </html>
  );
}
