# Movies Discovery Platform

A modern, multilingual movies discovery platform built with Next.js 15, featuring Arabic (RTL) and English (LTR) support, dark/light themes, and integration with TMDB API.

## 🚀 Features

- ✅ **Next.js 15** with App Router
- ✅ **TypeScript** (strict mode)
- ✅ **Tailwind CSS** for styling
- ✅ **shadcn/ui** components
- ✅ **next-intl** for internationalization (Arabic/English)
- ✅ **RTL Support** for Arabic
- ✅ **Dark/Light Theme** with next-themes
- ✅ **TMDB API** integration with Zod validation
- ✅ **Custom Fonts**: Cairo (Arabic), Inter (English)
- ✅ **React Query** ready for data fetching
- ✅ **Zustand** ready for state management

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Homepage
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root redirect
├── components/
│   ├── ui/                # shadcn components
│   ├── layout/            # Navbar, Footer
│   ├── shared/            # Theme toggle, Language toggle
│   └── theme-provider.tsx # Theme provider
├── lib/
│   ├── tmdb/              # TMDB API client
│   │   ├── client.ts      # API functions
│   │   ├── types.ts       # TypeScript types
│   │   └── schemas.ts     # Zod schemas
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # Constants & helpers
├── messages/
│   ├── en.json            # English translations
│   └── ar.json            # Arabic translations
├── i18n.ts                # i18n configuration
└── middleware.ts          # Next.js middleware
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure TMDB API Key

1. Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Add your API key to `.env.local`:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
   ```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar)

## 🌍 Internationalization

The app supports:
- **English** (LTR) - `/en`
- **Arabic** (RTL) - `/ar`

### Adding Translations

Edit translation files in `src/messages/`:
- `en.json` - English translations
- `ar.json` - Arabic translations

## 🎨 Theme Support

- Light mode
- Dark mode
- System preference

Toggle theme using the sun/moon icon in the navbar.

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔧 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl
- **Theme**: next-themes
- **API Client**: TMDB
- **Validation**: Zod
- **State Management**: Zustand (ready)
- **Data Fetching**: React Query (ready)

## 📝 TMDB API Functions

Available API functions in `src/lib/tmdb/client.ts`:

- `getTrendingMovies()` - Get trending movies
- `getPopularMovies()` - Get popular movies
- `getMovieDetails(id)` - Get movie details
- `getMovieCredits(id)` - Get movie cast & crew
- `searchMovies(query)` - Search movies
- `getTopRatedMovies()` - Get top rated movies
- `getUpcomingMovies()` - Get upcoming movies
- `getNowPlayingMovies()` - Get now playing movies

All responses are validated with Zod schemas for type safety.

## 🎯 Next Steps

The foundation is ready! You can now:

1. Build the movies listing page
2. Create movie detail pages
3. Implement search functionality
4. Add favorites feature
5. Create movie carousels
6. Add filtering and sorting

## 📄 License

ISC
