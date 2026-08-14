# Netflix Clone (HTML + CSS + JS only)

A front-end-only clone of Netflix's UI — no frameworks, no build step, no backend.

## Structure
```
netflix-clone/
├── index.html      → Landing/marketing page (logged-out netflix.com)
├── browse.html      → The main app (post-login browse experience)
├── css/style.css     → All styling (shared design tokens: --nf-red, --nf-bg, etc.)
├── js/data.js       → Sample movie/show data (rows, titles, posters)
├── js/landing.js     → Landing page behavior (nav, email form, FAQ accordion)
└── js/browse.js      → Browse app behavior (rows, hover previews, modal, search, My List)
```

## Run it
No build tools needed. Either:
1. Double-click `index.html` to open it directly in a browser, or
2. Serve it locally for the best experience (avoids some browser file:// restrictions):
   ```
   cd netflix-clone
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`

## What's implemented
- **Landing page**: hero with email capture + validation, feature sections, FAQ accordion, footer — matches netflix.com's logged-out layout.
- **Sign-in flow**: entering an email (or clicking "Sign In") takes you into `browse.html`.
- **Browse page**:
  - Top nav that goes solid black on scroll, with a mobile hamburger menu
  - Full-bleed hero billboard with Play / More Info
  - Horizontally scrollable content rows (arrow buttons + native drag/swipe)
  - Hover-to-preview cards that scale up with quick actions (Play, Add to My List, Like, More Info)
  - A "Top 10" ranked row with large numerals
  - A details modal (click any card) with synopsis, cast, genres, match %
  - Working client-side search that filters titles across all rows
  - **My List**: add/remove from cards or the modal, persisted in `localStorage`, with its own nav tab and empty state
  - Nav filters for Home / TV Shows / Movies / New & Popular / My List (client-side, demo data)

## Notes
- Poster/backdrop images are placeholder art (deterministic per-title via picsum.photos seeds) since no movie database API key is wired in. Swap `js/data.js`'s `posterUrl`/`backdropUrl` helpers for a real source (e.g. TMDB) if you add your own API key.
- This is a learning/portfolio project — not affiliated with or endorsed by Netflix, Inc.
