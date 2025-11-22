// app/lib/tmdb.ts
import { genreMap } from "@/app/utils/genreMap";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

// Fetch raw JSON from TMDB (returns the full payload)
export async function fetchFromTMDB(endpoint: string) {
  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${API_BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });

    if (!res.ok) {
      const text = await res.text();
      console.error("TMDB error:", res.status, text);
      return null;
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("TMDB fetch failed:", error);
    return null;
  }
}

/**
 * getMovies: returns a normalized array ready for your UI.
 * Use this when you want mapped movies (not raw payloads).
 */
export async function getMovies(endpoint: string) {
  const data = await fetchFromTMDB(endpoint);
  if (!data || !Array.isArray(data.results)) return [];

  return data.results.map((m: any) => ({
    id: m.id,
    title: m.title,
    original_title: m.original_title,
    posterPath: m.poster_path,
    backdropPath: m.backdrop_path,
    rating: m.vote_average,
    releaseDate: m.release_date,
    genres: (m.genre_ids || []).map((id: number) => genreMap[id]).filter(Boolean),
    original_language: m.original_language,
  }));
}

/**
 * Optional: get raw results array when you need full control (e.g., merging pages)
 */
export async function getResults(endpoint: string) {
  const data = await fetchFromTMDB(endpoint);
  return data?.results ?? [];
}

export async function getWatchProviders(movieId: string) {
  return fetchFromTMDB(`/movie/${movieId}/watch/providers`);
}
