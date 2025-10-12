# 🎬 Initialize Movies Discovery Platform

Hey Claude! I need you to set up a new Next.js 14 project for a movies discovery platform. 

## Quick Overview
Build a modern movies app that:
- Supports **Arabic (RTL)** and **English (LTR)**
- Fetches data from **TMDB API**
- Has a beautiful UI with **shadcn/ui** and **dark/light themes**
- Follows production-ready best practices

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- next-intl (translations)
- React Query (data fetching)
- Zustand (state)
- Zod (validation)

---

## Your Task

**Before you start**: Read `.claude-code-context.md` file - it contains all the coding standards and patterns you must follow.

Then, please do the following:

### 1. Initialize Project
```bash
npx create-next-app@latest movies-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd movies-app
```

### 2. Install Dependencies
Install these packages:
- **Core**: `@tanstack/react-query`, `zustand`, `zod`, `next-intl`
- **UI**: `framer-motion`, `embla-carousel-react`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Media**: `react-player`
- **Utils**: `date-fns`
- **Dev**: `@types/node`, `@total-typescript/ts-reset`

Then setup shadcn/ui and install these components: `button`, `card`, `input`, `skeleton`, `dropdown-menu`, `dialog`, `badge`, `separator`, `avatar`, `select`, `slider`

### 3. Setup Project Structure
Create this folder structure in `src/`:
```
src/
├── app/[locale]/         # i18n routes
├── components/
│   ├── ui/              # shadcn components
│   ├── movies/          # Movie components
│   ├── layout/          # Navbar, Footer
│   └── shared/          # Reusable components
├── lib/
│   ├── tmdb/           # TMDB API client
│   ├── utils.ts
│   └── constants.ts
├── hooks/
├── store/
├── types/
└── messages/           # en.json, ar.json
```

### 4. Configure i18n
- Setup `next-intl` with Arabic and English
- Create `middleware.ts` for locale routing
- Add font support: **Inter** (English) and **Cairo** (Arabic)
- Enable **RTL** for Arabic with proper `dir` attribute
- Create translation files (`messages/en.json`, `messages/ar.json`) with these keys:
  - `nav`: home, movies, search, favorites
  - `common`: loading, error, tryAgain, noResults
  - `movie`: rating, releaseDate, runtime, genres, overview, cast
  - `search`: placeholder, results
  - `theme`: light, dark, system

### 5. Setup TMDB API Client
In `lib/tmdb/`:
- Create **types** (Movie, MovieDetails, Genre, Cast, etc.)
- Create **Zod schemas** for validation
- Create **API functions**: 
  - `getTrendingMovies()`
  - `getPopularMovies()`
  - `getMovieDetails(id)`
  - `searchMovies(query)`
- Add proper error handling with custom `TMDBError` class
- Use appropriate cache strategies (1hr for trending, 24hrs for details, no-cache for search)

### 6. Configure Files
Update these configs:
- **tsconfig.json**: Enable strict mode + extra strict options
- **tailwind.config.ts**: Add shadcn theme + Arabic font + RTL support
- **next.config.js**: Add next-intl plugin + TMDB image domains
- **globals.css**: Add shadcn CSS variables + RTL support

### 7. Create Utilities
In `lib/`:
- `utils.ts`: `cn()`, `formatDate()`, `formatRuntime()`, `formatRating()`
- `constants.ts`: TMDB URLs, image sizes, genre IDs, `getImageUrl()` helper

### 8. Environment Setup
Create:
- `.env.local` with `NEXT_PUBLIC_TMDB_API_KEY`
- `.env.example` as a template (commit this one)

### 9. Create Basic Components
- **Navbar**: With logo, nav links, language toggle, theme toggle, search bar
- **ThemeProvider**: For dark/light mode switching
- **LanguageToggle**: To switch between AR/EN

### 10. Create Homepage
Simple homepage (`app/[locale]/page.tsx`) that shows:
- "Welcome to Movies Discovery" heading
- A placeholder for trending movies (we'll build this next)

---

## Expected Result

After you're done, I should be able to:
1. Run `npm run dev`
2. Visit `http://localhost:3000/en` and `http://localhost:3000/ar`
3. See the homepage in both languages with RTL working in Arabic
4. Toggle between light/dark themes
5. Switch languages using the language toggle
6. Have a fully configured TMDB API client ready to use

---

## Important Rules
- Follow **TypeScript strict mode** - no `any` types
- Use **Server Components** by default
- Validate all API responses with **Zod**
- Use **proper error handling** everywhere
- Make it **accessible** (ARIA labels, semantic HTML)
- Keep code **clean and well-organized**
- Add **proper TypeScript types** for everything

---

## Notes
- Don't build the full UI yet - just the foundation
- Make sure RTL works perfectly for Arabic
- Test both light and dark themes
- Ensure language switching works smoothly
- Leave helpful comments in complex parts

Ready to start? Let's build this! 🚀