# 🎬 NewMovies - Apple-Style Movie Discovery Platform

A stunning, production-ready movie discovery platform built with Next.js 15, featuring Apple's signature glassmorphism design language and powered by The Movie Database (TMDB) API.

## ✨ Features

### 🎨 Design & UX

- **Modern Card UI**: Elegant translucent panels with subtle effects
- **Responsive Design**: Mobile-first approach with perfect scaling across all devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Apple System Fonts**: Inter font family for crisp, readable typography
- **Dark Theme**: Immersive dark interface with subtle lighting effects

### 🎬 Movie Discovery

- **Hero Carousel**: Featured trending movies with auto-rotation
- **Category Browsing**: Popular, Top Rated, Upcoming, and Trending sections
- **Movie Details**: Comprehensive information with cast, crew, and production details
- **Search Functionality**: Real-time search with debounced queries
- **Related Content**: Similar movies and personalized recommendations
- **High-Quality Images**: Optimized posters and backdrops with fallback placeholders

### ⚡ Performance & Technical

- **Next.js 15**: Latest features including React 19 and Turbopack
- **Server Components**: Optimized data fetching and reduced client bundle
- **Image Optimization**: Next.js Image component with lazy loading
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **TypeScript**: Full type safety throughout the application
- **Responsive Caching**: Smart data caching with revalidation strategies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- TMDB API account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/NewMovies.git
cd NewMovies
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 4. Get Your TMDB API Key

1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to [API Settings](https://www.themoviedb.org/settings/api)
4. Request an API key
5. Copy your API key to the `.env.local` file

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see NewMovies in action!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── movie/[id]/        # Dynamic movie detail pages
│   ├── popular/           # Popular movies page
│   ├── top-rated/         # Top rated movies page
│   ├── upcoming/          # Upcoming movies page
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Homepage with hero and movie lists
│   └── globals.css        # Global styles with glassmorphism
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Card, etc.)
│   ├── hero-section.tsx  # Featured movies carousel
│   ├── movie-card.tsx    # Individual movie card component
│   ├── movie-grid.tsx    # Grid layout for movie lists
│   ├── movie-list.tsx    # Horizontal scrolling movie lists
│   └── navigation.tsx    # Main navigation with search
├── lib/                  # Utility functions and API client
│   ├── tmdb.ts          # TMDB API client with typed methods
│   └── utils.ts         # Helper functions and utilities
└── types/               # TypeScript type definitions
    └── tmdb.ts         # TMDB API response types
```

## 🎨 Design System

### Color Palette

- **Background**: Pure black with gradient overlays
- **Card Surfaces**: `rgba(255, 255, 255, 0.1)` with subtle transparency
- **Borders**: `rgba(255, 255, 255, 0.2)` for subtle definition
- **Text**: White with varying opacity levels for hierarchy
- **Accent**: Apple's signature blue `#007AFF`

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Fallback**: Apple system fonts (-apple-system, BlinkMacSystemFont)
- **Sizes**: Responsive scale from 12px to 72px
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Layout

- **Container**: Responsive max-width with consistent padding
- **Grid**: CSS Grid with responsive columns
- **Spacing**: 8px base unit with consistent scale
- **Borders**: 12px border radius for modern feel

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography

### Data & API

- **API**: The Movie Database (TMDB) v3
- **HTTP Client**: Fetch with custom wrapper
- **Caching**: Next.js built-in caching with revalidation
- **Image Optimization**: Next.js Image component

### Development Tools

- **Linting**: ESLint with Next.js configuration
- **Formatting**: Prettier (recommended)
- **Type Checking**: TypeScript compiler
- **Build Tool**: Turbopack for faster builds

## 📱 Responsive Design

NewMovies is designed mobile-first with breakpoints for:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

Key responsive features:

- Collapsible navigation with mobile menu
- Adaptive movie grid (2-6 columns)
- Scalable typography and spacing
- Touch-friendly interface elements

## 🚀 Performance Optimizations

### Loading & Caching

- Server-side rendering for fast initial loads
- Image lazy loading with smooth transitions
- API response caching (5 minutes default)
- Prefetching for critical movie data

### Bundle Optimization

- Tree shaking for smaller bundle sizes
- Code splitting at route level
- Dynamic imports for non-critical components
- Optimized asset delivery via Vercel Edge Network

### User Experience

- Skeleton loading states for perceived performance
- Debounced search to reduce API calls
- Smooth page transitions with Framer Motion
- Error boundaries with graceful fallbacks

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/NewMovies)

### Other Platforms

- **Netlify**: Works with Next.js adapter
- **AWS Amplify**: Static export support

## 🤝 Contributing

We welcome contributions to NewMovies! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB**: For providing the comprehensive movie database API
- **Apple**: For inspiration from their design language
- **Vercel**: For the excellent Next.js framework and hosting platform
- **Community**: For the amazing open-source libraries used in this project

## 📞 Support

If you have any questions or need help getting started:

- 📧 Email: support@NewMovies.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/NewMovies/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/NewMovies/discussions)

---

Made with ❤️ and ☕ by the NewMovies team
