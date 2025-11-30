"use client";

import { useEffect, useState , useRef } from "react";
import { fetchFromTMDB } from "@/app/lib/tmdb";
import MovieCard from "@/app/components/MovieCard";
import { genreMap } from "@/app/utils/genreMap";
import Image from "next/image";
import { Search } from "lucide-react";
import MovieFilterBar from "@/app/components/MovieFilterBar";

type Movie = {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  rating?: number;
  releaseDate?: string;
  genres: string[];
  original_language?: string;
  overview?: string;
};

const GENRE_ID: Record<string, number> = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  thriller: 53,
  animation: 16,
  adventure: 12,
  fantasy: 14,
  scifi: 878,
  mystery: 9648,
  crime: 80,
  family: 10751,
  music: 10402,
  history: 36,
  war: 10752,
  western: 37,
  documentary: 99,
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ genre: "", language: "" });
  const [loading, setLoading] = useState(false);

  function mapResults(results: any[] = []): Movie[] {
    return (results || []).map((m: any) => ({
      id: m.id,
      title: m.title ?? m.name ?? "Untitled",
      posterPath: m.poster_path ?? null,
      backdropPath: m.backdrop_path ?? null,
      rating: typeof m.vote_average === "number" ? m.vote_average : undefined,
      releaseDate: m.release_date ?? m.first_air_date,
      genres: (m.genre_ids || [])
        .map((id: number) => genreMap[id])
        .filter(Boolean),
      original_language: m.original_language,
      overview: m.overview,
    }));
  }

  // Build safe discover URL for a page
  function buildDiscoverUrl(
    page: number,
    opts?: { genre?: string; lang?: string }
  ) {
    const parts: string[] = [
      `page=${page}`,
      "include_adult=false",
      "sort_by=popularity.desc",
    ];
    if (opts?.lang) parts.push(`with_original_language=${opts.lang}`);
    if (opts?.genre) parts.push(`with_genres=${opts.genre}`);
    return `/discover/movie?${parts.join("&")}`;
  }

  // Merge and dedupe by id
  function dedupeById(arrays: any[][]) {
    const map = new Map<number, any>();
    for (const arr of arrays) {
      for (const item of arr || []) {
        map.set(item.id, item);
      }
    }
    return Array.from(map.values());
  }

  // Core loader: fetches multiple pages from discover (or trending fallback)
  async function loadPool(opts?: {
    useDiscover?: boolean;
    genreId?: number | null;
    lang?: string;
    pages?: number;
  }) {
    setLoading(true);
    try {
      const pages = opts?.pages ?? 3;
      const lang = opts?.lang ?? "";
      const genreId = opts?.genreId ?? null;

      if (opts?.useDiscover) {
        // Build urls for multiple pages
        const urls = Array.from({ length: pages }, (_, i) =>
          buildDiscoverUrl(i + 1, {
            genre: genreId ? String(genreId) : undefined,
            lang: lang || undefined,
          })
        );
        console.log("Discover URLs:", urls);

        // Fetch in parallel
        const responses = await Promise.all(urls.map((u) => fetchFromTMDB(u)));
        const resultsPerPage = responses.map((r) => r?.results ?? []);
        let combined = dedupeById(resultsPerPage);

        // If discover returns nothing, try relaxed queries (genre-only or lang-only)
        if (combined.length === 0) {
          if (genreId) {
            const genreUrls = Array.from({ length: pages }, (_, i) =>
              buildDiscoverUrl(i + 1, { genre: String(genreId) })
            );
            const r2 = await Promise.all(
              genreUrls.map((u) => fetchFromTMDB(u))
            );
            combined = dedupeById(r2.map((r) => r?.results ?? []));
          }
        }
        if (combined.length === 0) {
          if (lang) {
            const langUrls = Array.from({ length: pages }, (_, i) =>
              buildDiscoverUrl(i + 1, { lang })
            );
            const r3 = await Promise.all(langUrls.map((u) => fetchFromTMDB(u)));
            combined = dedupeById(r3.map((r) => r?.results ?? []));
          }
        }

        // Final fallback: trending
        if (combined.length === 0) {
          const trending = await fetchFromTMDB("/trending/movie/week?page=1");
          combined = trending?.results ?? [];
        }

        const mapped = mapResults(combined);
        setMovies(mapped);
        setHeroMovie(mapped[0] ?? null);
        setLoading(false);
        return;
      }

      // If not using discover, default to trending multi-page
      const trendingUrls = Array.from(
        { length: pages },
        (_, i) => `/trending/movie/week?page=${i + 1}`
      );
      const trendingResponses = await Promise.all(
        trendingUrls.map((u) => fetchFromTMDB(u))
      );
      const trendingResults = trendingResponses.map((r) => r?.results ?? []);
      const combinedTrending = dedupeById(trendingResults);
      const mappedTrending = mapResults(combinedTrending);
      setMovies(mappedTrending);
      setHeroMovie(mappedTrending[0] ?? null);
    } catch (err) {
      console.error("loadPool error:", err);
      setMovies([]);
      setHeroMovie(null);
    } finally {
      setLoading(false);
    }
  }

  // Initial load: fetch a bigger pool (trending pages)
  useEffect(() => {
    loadPool({ useDiscover: false, pages: 2 }); // trending pages 1..2 initially
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect when filters change: use discover with genre/lang
  useEffect(() => {
    const lang = filters.language?.trim() || "";
    const genreKey = filters.genre?.trim() || "";
    const genreId = genreKey ? GENRE_ID[genreKey] : undefined;

    // If no filters, load trending pool again
    if (!genreKey && !lang) {
      loadPool({ useDiscover: false, pages: 2 });
      return;
    }

    // Use discover to fetch 3 pages by default
    loadPool({
      useDiscover: true,
      genreId: genreId ?? null,
      lang: lang || undefined,
      pages: 3,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Search: fetch discover-like search pages (multi-page) and set movies

  // <-- define the ref here
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;


    // Hide keyboard immediately (best-effort)
    inputRef.current?.blur();
    if (typeof navigator !== "undefined" && "virtualKeyboard" in navigator) {
      // @ts-ignore experimental API
      navigator.virtualKeyboard?.hide?.();
    }

    setLoading(true);
    try {
      // fetch first 3 pages of search
      const urls = Array.from(
        { length: 3 },
        (_, i) =>
          `/search/movie?query=${encodeURIComponent(query)}&page=${i + 1}`
      );
      const responses = await Promise.all(urls.map((u) => fetchFromTMDB(u)));
      const combined = dedupeById(responses.map((r) => r?.results ?? []));
      const mapped = mapResults(combined);
      setMovies(mapped);
      setHeroMovie(mapped[0] ?? null);
    } catch (err) {
      console.error("search error:", err);
      setMovies([]);
      setHeroMovie(null);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  // Render
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={
            heroMovie?.backdropPath
              ? `https://image.tmdb.org/t/p/original${heroMovie.backdropPath}`
              : "/images/bg-hero.jpg"
          }
          alt={heroMovie?.title ?? "Welcome"}
          fill
          className="object-cover object-top object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/90"></div>

        <div className="relative z-10  text-shadow-sm text-center px-6 max-w-2xl animate-fadeIn">
          <h1 className="text-3xl md:text-6xl font-bold text-filmsouk-gold drop-shadow-lg">
            Welcome to Golden <span className="text-gray-200/70">Screen</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Discover trending films, timeless classics, and hidden gems.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex items-center bg-white/10 backdrop-blur-md rounded-full shadow-md overflow-hidden"
          >
            <Search className="ml-3 text-filmsouk-gold" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-filmsouk-gold text-black font-semibold hover:bg-yellow-400 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="p-6">
        {/* Heading + Filters row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3 ">
          <h1 className="text-3xl font-bold text-white text-center md:text-left">
            {query ? "Search Results" : "Trending Movies"}
          </h1>
          <div className="mt-2 md:mt-0 flex justify-center md:justify-end">
            <MovieFilterBar onFilterChange={(f) => setFilters(f)} />
          </div>
        </div>

        {/* Movies grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-2">
          {loading ? (
            <div className="flex flex-row gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          ) : movies.length === 0 ? (
            <p className="text-gray-400 italic col-span-full">
              No movies to show.
            </p>
          ) : (
            movies.map((m) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                posterPath={m.posterPath ?? ""}
                rating={m.rating}
                releaseDate={m.releaseDate}
                genres={m.genres}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
