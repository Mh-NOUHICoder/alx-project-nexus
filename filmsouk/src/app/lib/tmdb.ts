import { genreMap } from "@/app/utils/genreMap";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

export async function fetchFromTMDB(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}&api_key=${API_KEY}`);
    if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
    return res.json();
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
