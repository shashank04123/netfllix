/* ==========================================================================
   Netflix Clone — Content Data
   Poster/backdrop art is generated from deterministic placeholder seeds
   (no API key required). Swap the `img`/`backdrop` URLs for a real
   TMDB-backed source if you plug in your own API key later.
   ========================================================================== */

function posterUrl(seed) {
  return `https://picsum.photos/seed/${seed}/400/600`;
}
function backdropUrl(seed) {
  return `https://picsum.photos/seed/${seed}-bg/1280/720`;
}

const GENRES = ["Thriller", "Drama", "Sci-Fi", "Comedy", "Action", "Crime", "Fantasy", "Documentary", "Romance", "Horror"];

const TITLES = [
  "Crimson Horizon", "The Last Signal", "Velvet Static", "Northbound", "Glass House Rules",
  "Midnight Cartel", "Echoes of Tomorrow", "Salt & Steel", "The Quiet Storm", "Paper Kingdoms",
  "Neon Requiem", "Borrowed Time", "The Ivory Coastline", "Static Bloom", "Winter's Ledger",
  "The Fifth Floor", "Hollow Crown", "Ashes to Amber", "Broken Compass", "The Long Con",
  "Ghost Protocol Redux", "Silver Tongue", "The Architect's Daughter", "Concrete Sky", "Wildfire Season",
  "The Cartographer", "Dust and Diamonds", "Low Tide", "The Understudy", "Feral Hearts",
  "Nightshade", "The Last Ember", "Static Horizon", "Blackout City", "The Forgotten Room",
  "Crown of Thorns", "The Signal Fire", "Rewind", "Nine Lives Left", "The Locksmith",
];

function shuffleSeeded(arr, seedOffset) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (i * 9301 + 49297 + seedOffset * 233) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRow(rowSeed, count = 16) {
  const titles = shuffleSeeded(TITLES, rowSeed).slice(0, count);
  return titles.map((title, idx) => {
    const slug = (title + rowSeed + idx).replace(/\s+/g, "-").toLowerCase();
    return {
      id: `${rowSeed}-${idx}`,
      title,
      img: posterUrl(slug),
      backdrop: backdropUrl(slug),
      match: 75 + ((rowSeed * 7 + idx * 13) % 25),
      year: 2016 + ((rowSeed + idx) % 9),
      rating: ["PG", "PG-13", "R", "TV-MA", "TV-14"][(rowSeed + idx) % 5],
      duration: `${1 + ((idx + rowSeed) % 2)}h ${10 + ((idx * 7) % 50)}m`,
      genres: [GENRES[(rowSeed + idx) % GENRES.length], GENRES[(rowSeed + idx + 3) % GENRES.length], GENRES[(rowSeed + idx + 5) % GENRES.length]],
      desc: "When everything they trusted falls apart, an unlikely group of allies must risk it all on a plan with no guarantee of survival.",
      isOriginal: (rowSeed + idx) % 4 === 0,
    };
  });
}

const ROWS = [
  { title: "Trending Now", items: buildRow(1) },
  { title: "Netflix Originals", items: buildRow(2), tall: true },
  { title: "Continue Watching for You", items: buildRow(3), progress: true },
  { title: "Because You Watched The Last Signal", items: buildRow(4) },
  { title: "Action & Adventure", items: buildRow(5) },
  { title: "Award-Winning Dramas", items: buildRow(6) },
  { title: "Mind-Bending Sci-Fi", items: buildRow(7) },
  { title: "Comedies to Watch This Weekend", items: buildRow(8) },
  { title: "Critically Acclaimed Crime Stories", items: buildRow(9) },
  { title: "Top 10 in Your Country Today", items: buildRow(10).map((it, i) => ({ ...it, rank: i + 1 })), ranked: true },
];

const HERO_FEATURE = {
  title: "Crimson Horizon",
  tagline: "A NETFLIX FILM",
  desc: "A disgraced intelligence officer resurfaces in a city built on lies, chasing one last truth that could burn it all down — and take her with it.",
  backdrop: "https://picsum.photos/seed/hero-crimson-horizon/1600/900",
  match: 97,
  year: 2026,
  rating: "TV-MA",
  duration: "2h 12m",
};
