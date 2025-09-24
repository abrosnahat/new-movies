# 🚀 NewMovies Deployment Guide

## One-Click Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/NewMovies&env=NEXT_PUBLIC_TMDB_API_KEY&envDescription=Get%20your%20API%20key%20from%20TMDB&envLink=https://www.themoviedb.org/settings/api)

## Manual Deployment

### Prerequisites

- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))
- Node.js 18+ for local builds
- Git repository with your code

### Platform-Specific Instructions

#### Vercel

1. **Connect Repository**

   ```bash
   # Option 1: Via CLI
   npm i -g vercel
   vercel --prod

   # Option 2: Via Dashboard
   # Visit vercel.com/new and import your repository
   ```

2. **Configure Environment Variables**

   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_production_api_key
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

3. **Deploy**
   ```bash
   # Automatic deployment on git push
   git push origin main
   ```

#### Netlify

1. **Build Settings**

   ```bash
   # Build command
   npm run build

   # Publish directory
   out
   ```

2. **Configure Next.js for Static Export**

   ```javascript
   // next.config.ts
   const nextConfig = {
     output: "export",
     trailingSlash: true,
     images: {
       unoptimized: true,
     },
   };
   ```

3. **Environment Variables**
   Add the same TMDB variables in Netlify dashboard

#### Railway

1. **Connect Repository**

   ```bash
   # Via CLI
   npm install -g @railway/cli
   railway login
   railway link
   railway up
   ```

2. **Configure Variables**
   ```bash
   railway variables set NEXT_PUBLIC_TMDB_API_KEY=your_key
   railway variables set NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   railway variables set NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

## Performance Optimization

### Build Optimization

```bash
# Check bundle size
npm run build
npm run analyze

# Clean cache if needed
npm run clean
```

### CDN Configuration

For optimal performance, configure your CDN to cache:

- Static assets: 1 year
- API responses: 5 minutes
- HTML pages: 1 hour

### Image Optimization

NewMovies automatically optimizes images via:

- Next.js Image component
- WebP conversion
- Responsive sizing
- Lazy loading

## Production Checklist

### Before Deployment

- [ ] TMDB API key is valid and active
- [ ] Environment variables are set correctly
- [ ] Application builds without errors (`npm run build`)
- [ ] All pages load correctly in production mode
- [ ] Images display with proper fallbacks
- [ ] Search functionality works
- [ ] Mobile responsiveness is tested

### Security

- [ ] API key is not exposed in client-side code
- [ ] HTTPS is enabled
- [ ] CSP headers are configured (if needed)
- [ ] Rate limiting is handled gracefully

### Monitoring

- [ ] Error tracking is set up (Sentry, LogRocket, etc.)
- [ ] Analytics are configured (Google Analytics, Vercel Analytics)
- [ ] Performance monitoring (Web Vitals)
- [ ] TMDB API usage monitoring

## Custom Domain Setup

### Vercel

1. Go to your project settings
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify

1. Site settings > Domain management
2. Add custom domain
3. Update DNS with provided records

### Cloudflare (DNS + CDN)

1. Add site to Cloudflare
2. Update nameservers
3. Configure caching rules for optimal performance

## Environment Management

### Development

```env
NEXT_PUBLIC_TMDB_API_KEY=dev_key_here
# Use development API key for testing
```

### Staging

```env
NEXT_PUBLIC_TMDB_API_KEY=staging_key_here
# Separate key for staging environment
```

### Production

```env
NEXT_PUBLIC_TMDB_API_KEY=prod_key_here
# Production key with higher rate limits
```

## Troubleshooting Deployment

### Common Issues

**1. Build Failures**

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**2. Environment Variables Not Loading**

- Restart the application after adding variables
- Check variable names match exactly
- Ensure no extra spaces or quotes

**3. API Rate Limits in Production**

- Monitor TMDB usage dashboard
- Implement request caching
- Add error boundaries for failed requests

**4. Image Loading Issues**

- Verify TMDB image URLs are accessible
- Check Next.js Image configuration
- Ensure fallback placeholders work

## Performance Metrics

Expected performance scores:

- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

## Support

Need help with deployment?

- 📧 Email: deploy@NewMovies.app
- 💬 Discord: NewMovies Community
- 📖 Docs: [Full Documentation](https://docs.NewMovies.app)

---

🎬 **Your NewMovies is ready for the world!** 🌍
