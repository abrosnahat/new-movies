# 🎬 NewMovies - TMDB API Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your TMDB API Key

1. Visit [themoviedb.org](https://www.themoviedb.org/)
2. Click "Sign Up" to create a free account
3. Verify your email address
4. Go to [Account Settings > API](https://www.themoviedb.org/settings/api)
5. Click "Create" or "Request an API Key"
6. Choose "Developer" option
7. Fill out the form with your application details:
   - **Application Name**: NewMovies
   - **Application URL**: http://localhost:3000 (for development)
   - **Application Summary**: Personal movie discovery app

### Step 2: Configure Environment Variables

1. Copy your API key from TMDB dashboard
2. Create `.env.local` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

3. Add your API key to `.env.local`:

```env
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### Step 3: Start the Application

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to see NewMovies in action!

## 🛠️ Production Deployment

### Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_TMDB_API_KEY`: Your production API key
   - `NEXT_PUBLIC_TMDB_BASE_URL`: https://api.themoviedb.org/3
   - `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL`: https://image.tmdb.org/t/p

### Other Platforms

For other deployment platforms, ensure you set the same environment variables in their respective dashboards.

## 🔐 API Key Security

### Development

- Never commit `.env.local` to version control (already in .gitignore)
- Use `NEXT_PUBLIC_` prefix for client-side variables
- API key is safe to use client-side for TMDB (read-only operations)

### Production

- Set environment variables in your deployment platform
- Monitor API usage in TMDB dashboard
- Regenerate keys if compromised

## 📊 TMDB API Limits

### Free Tier (Current Implementation)

- **40 requests per 10 seconds** per IP address
- **1,000 requests per day** per API key
- All endpoints used in NewMovies are within free tier

### Rate Limiting Handling

NewMovies automatically handles rate limits with:

- Request caching (5 minutes)
- Error boundaries for failed requests
- Graceful fallbacks for missing data

## 🧪 Testing Your Setup

### 1. Check API Connection

If you see the error page, verify:

- API key is correct and active
- Environment variables are loaded (restart dev server)
- No network restrictions blocking TMDB

### 2. Monitor Usage

Check your API usage at:
[TMDB Account Settings > API](https://www.themoviedb.org/settings/api)

### 3. Test Features

- ✅ Homepage loads with trending movies
- ✅ Navigation works between sections
- ✅ Search returns results
- ✅ Movie details page loads
- ✅ Images display correctly

## 🆘 Troubleshooting

### Common Issues

**1. "Error Loading Movies" on homepage**

- Check API key in `.env.local`
- Restart development server: `npm run dev`
- Verify TMDB account is active

**2. Images not loading**

- Check network connection
- Verify TMDB image URLs are accessible
- Fallback placeholders should display

**3. Search not working**

- Ensure API key has search permissions
- Check browser console for errors
- Verify debounce delay (300ms)

**4. Rate limit errors**

- Reduce request frequency during development
- Check TMDB dashboard for usage stats
- Implement request queuing if needed

### Getting Help

If you're still having issues:

1. Check the [TMDB API documentation](https://developer.themoviedb.org/docs)
2. Review [TMDB API forum](https://www.themoviedb.org/talk/category/5047958519c29526b50017d6)
3. Open an issue in the NewMovies repository

## 🎯 Next Steps

Once your setup is working:

1. Explore different movie categories
2. Test responsive design on mobile devices
3. Try the search functionality
4. Browse movie details and recommendations
5. Consider contributing new features!

---

🎬 **Happy movie browsing with NewMovies!** 🎬
