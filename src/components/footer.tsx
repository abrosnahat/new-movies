import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">NewMovies</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Watch movies online free in HD quality. Stream the latest
              blockbusters, classic films, and international cinema without
              registration.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://t.me/new_movies_website"
                target="_blank"
                className="text-white/70 hover:text-white transition-colors"
                rel="noopener noreferrer"
                aria-label="Join our Telegram channel"
              >
                Telegram
              </Link>
            </div>
          </div>

          {/* Movie Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Browse Movies</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/popular"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/top-rated"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Top Rated Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Upcoming Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Genres</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-white/70">Action Movies Online</span>
              </li>
              <li>
                <span className="text-white/70">Comedy Films Free</span>
              </li>
              <li>
                <span className="text-white/70">Drama Movies HD</span>
              </li>
              <li>
                <span className="text-white/70">Thriller Movies</span>
              </li>
              <li>
                <span className="text-white/70">Horror Films</span>
              </li>
              <li>
                <span className="text-white/70">Sci-Fi Movies</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>✓ Free HD Streaming</li>
              <li>✓ No Registration Required</li>
              <li>✓ Mobile Friendly</li>
              <li>✓ Latest Movies</li>
              <li>✓ Multiple Genres</li>
              <li>✓ Instant Playback</li>
            </ul>
          </div>
        </div>

        {/* SEO Footer Text */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="text-white/60 text-sm leading-relaxed">
            <p className="mb-4">
              <strong className="text-white">NewMovies</strong> is your ultimate
              destination for watching movies online free. Stream the latest
              Hollywood blockbusters, indie films, international cinema, and
              classic movies in high definition quality. Our extensive library
              includes action movies, romantic comedies, thrilling dramas,
              horror films, sci-fi adventures, and documentaries from around the
              world.
            </p>
            <p className="mb-4">
              Enjoy instant streaming without the need for registration,
              subscription, or downloads. Our platform is optimized for all
              devices - watch on your computer, tablet, or mobile phone. With
              new movies added regularly, you&apos;ll always find something
              exciting to watch.
            </p>
            <p>
              Keywords: watch movies online free, stream movies HD, free movie
              streaming, online cinema, latest movies {currentYear}, Hollywood
              movies online, action films, comedy movies, drama series, thriller
              movies, horror films, sci-fi movies, free streaming service.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © {currentYear} NewMovies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
