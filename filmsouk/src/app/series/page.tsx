"use client";

import { useEffect, useState, useRef } from "react";
import { fetchFromTMDB } from "@/app/lib/tmdb";
import MovieCard from "@/app/components/MovieCard";
import { getGenreName } from "@/app/utils/genreMap";
import Image from "next/image";
import { Search, Tv } from "lucide-react";
import MovieFilterBar from "@/app/components/MovieFilterBar";
import { useLanguage } from "@/app/context/LanguageContext";

type Series = {
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

const TV_GENRE_ID: Record<string, number> = {
  action: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  kids: 10762,
  mystery: 9648,
  news: 10763,
  reality: 10764,
  scifi: 10765,
  soap: 10766,
  talk: 10767,
  war: 10768,
  western: 37,
};

export default function SeriesPage() {
  const { language, t } = useLanguage();
  const [series, setSeries] = useState<Series[]>([]);
  const [heroSeries, setHeroSeries] = useState<Series | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ genre: "", language: "", sortBy: "popularity.desc" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function mapResults(results: any[] = []): Series[] {
    return (results || []).map((m: any) => ({
      id: m.id,
      title: m.name ?? "Untitled",
      posterPath: m.poster_path ?? null,
      backdropPath: m.backdrop_path ?? null,
      rating: typeof m.vote_average === "number" ? m.vote_average : undefined,
      releaseDate: m.first_air_date,
      genres: (m.genre_ids || [])
        .map((id: number) => getGenreName(id, language === "ar" ? "ar" : "en"))
        .filter(Boolean),
      original_language: m.original_language,
      overview: m.overview,
    }));
  }

  function buildDiscoverUrl(
    page: number,
    opts?: { genre?: string; lang?: string; sortBy?: string }
  ) {
    const parts: string[] = [
      `page=${page}`,
      "include_adult=false",
      `sort_by=${opts?.sortBy || "popularity.desc"}`,
    ];
    if (opts?.sortBy === "vote_average.desc") {
      parts.push("vote_count.gte=100");
    }
    if (opts?.lang) parts.push(`with_original_language=${opts.lang}`);
    if (opts?.genre) parts.push(`with_genres=${opts.genre}`);
    return `/discover/tv?${parts.join("&")}`;
  }

  function dedupeById(arrays: any[][]) {
    const map = new Map<number, any>();
    for (const arr of arrays) {
      for (const item of arr || []) {
        map.set(item.id, item);
      }
    }
    return Array.from(map.values());
  }

  async function loadPool(opts?: {
    useDiscover?: boolean;
    genreId?: number | null;
    lang?: string;
    sortBy?: string;
    pages?: number;
  }) {
    setLoading(true);
    try {
      const pages = opts?.pages ?? 2;
      const lang = opts?.lang ?? "";
      const genreId = opts?.genreId ?? null;

      if (opts?.useDiscover) {
        const langCode = language === "ar" ? "ar-SA" : "en-US";
        const urls = Array.from({ length: pages }, (_, i) =>
          buildDiscoverUrl(i + 1, {
            genre: genreId ? String(genreId) : undefined,
            lang: lang || undefined,
            sortBy: opts?.sortBy,
          })
        );
        const responses = await Promise.all(urls.map((u) => fetchFromTMDB(u, langCode)));
        const resultsPerPage = responses.map((r) => r?.results ?? []);
        let combined = dedupeById(resultsPerPage);

        if (combined.length === 0 && genreId) {
          const genreUrls = Array.from({ length: pages }, (_, i) => buildDiscoverUrl(i + 1, { genre: String(genreId) }));
          const r2 = await Promise.all(genreUrls.map((u) => fetchFromTMDB(u, langCode)));
          combined = dedupeById(r2.map((r) => r?.results ?? []));
        }

        if (combined.length === 0) {
          const trending = await fetchFromTMDB("/trending/tv/week?page=1", langCode);
          combined = trending?.results ?? [];
        }

        const mapped = mapResults(combined);
        setSeries(mapped);
        setHeroSeries(mapped[0] ?? null);
      } else {
        const langCode = language === "ar" ? "ar-SA" : "en-US";
        const trendingUrls = Array.from({ length: pages }, (_, i) => `/trending/tv/week?page=${i + 1}`);
        const trendingResponses = await Promise.all(trendingUrls.map((u) => fetchFromTMDB(u, langCode)));
        const results = trendingResponses.map((r) => r?.results ?? []);
        const combinedTrending = dedupeById(results);
        const mappedTrending = mapResults(combinedTrending);
        setSeries(mappedTrending);
        setHeroSeries(mappedTrending[0] ?? null);
      }
    } catch (err) {
      console.error("loadPool error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPool({ useDiscover: false, pages: 2 });
  }, [language]);

  useEffect(() => {
    const lang = filters.language?.trim() || "";
    const genreKey = filters.genre?.trim() || "";
    const genreId = genreKey ? TV_GENRE_ID[genreKey] : undefined;

    if (!genreKey && !lang && filters.sortBy === "popularity.desc") {
      loadPool({ useDiscover: false, pages: 2 });
      return;
    }

    loadPool({
      useDiscover: true,
      genreId: genreId ?? null,
      lang: lang || undefined,
      sortBy: filters.sortBy,
      pages: 3,
    });
  }, [filters]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    inputRef.current?.blur();
    setLoading(true);
    try {
      const langCode = language === "ar" ? "ar-SA" : "en-US";
      const urls = Array.from({ length: 2 }, (_, i) => `/search/tv?query=${encodeURIComponent(query)}&page=${i + 1}`);
      const responses = await Promise.all(urls.map((u) => fetchFromTMDB(u, langCode)));
      const combined = dedupeById(responses.map((r) => r?.results ?? []));
      const mapped = mapResults(combined);
      setSeries(mapped);
      setHeroSeries(mapped[0] ?? null);
    } catch (err) {
      console.error("search error:", err);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <main>
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <Image
          src={heroSeries?.backdropPath ? `https://image.tmdb.org/t/p/original${heroSeries.backdropPath}` : "/images/bg-hero.jpg"}
          alt={heroSeries?.title ?? "Series"}
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/90"></div>
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="text-3xl md:text-6xl font-bold text-filmsouk-gold drop-shadow-lg flex items-center justify-center gap-4">
            <Tv size={48} /> {t("tvShows")}
          </h1>
          <p className="mt-4 text-lg text-gray-200">{t("welcomeSubtitle")}</p>
          <form onSubmit={handleSearch} className="mt-8 flex items-center bg-white/10 backdrop-blur-md rounded-full overflow-hidden">
            <Search className="ml-3 text-filmsouk-gold" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none"
            />
            <button type="submit" className="px-5 py-3 bg-filmsouk-gold text-black font-semibold hover:bg-yellow-400">{t("search")}</button>
          </form>
        </div>
      </section>

      <section className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3">
          <h2 className="text-3xl font-bold text-white">{query ? t("searchResults") : t("trendingSeries")}</h2>
          <MovieFilterBar onFilterChange={(f) => setFilters(f)} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          {loading ? (
             <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.5s]"></div>
              </div>
          ) : series.length === 0 ? (
            <p className="text-gray-400 italic">{t("noResults")}</p>
          ) : (
            series.map((s) => (
              <MovieCard
                key={s.id}
                id={s.id}
                title={s.title}
                posterPath={s.posterPath}
                rating={s.rating}
                releaseDate={s.releaseDate}
                genres={s.genres}
                type="series"
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
