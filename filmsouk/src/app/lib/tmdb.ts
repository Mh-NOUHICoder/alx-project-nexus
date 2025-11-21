import { genreMap } from "@/app/utils/genreMap";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

/**
 * Generic fetch wrapper for TMDb
 */
export async function fetchFromTMDB(endpoint: string) {
  try {
    // Append API key
    const separator = endpoint.includes("?") ? "&" : "?";

    const res = await fetch(`${API_BASE_URL}${endpoint}${separator}api_key=${API_KEY}`);
    if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("TMDb fetch failed:", error);
    return null;
  }
}

/**
 * Fetch movies and map genre_ids to names
 */
export async function getMovies(endpoint: string) {
  const data = await fetchFromTMDB(endpoint);
  if (!data) return [];

  return data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    genres: movie.genre_ids.map((id: number) => genreMap[id]), // ✅ mapped names
  }));
}

export async function getWatchProviders(movieId: string) {
  return fetchFromTMDB(`/movie/${movieId}/watch/providers`);
}

