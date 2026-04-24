"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/app/components/MovieCard";
import { getMovies } from "@/app/lib/tmdb";
import { Film } from "lucide-react";
import MovieFilterBar from "@/app/components/MovieFilterBar";
import { useLanguage } from "@/app/context/LanguageContext";

type Movie = {
  id: number;
  title: string;
  original_title: string;
  posterPath: string;
  backdropPath?: string;
  rating: number;
  releaseDate: string;
  genres: string[];
  original_language: string;
};

const GENRE_ID: Record<string, number> = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  animation: 16,
  thriller: 53,
  scifi: 878,
};

export default function NewMoviesPage() {
  const { language, t } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState({ genre: "", language: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const langCode = language === "ar" ? "ar-SA" : "en-US";
      const filterLang = filters.language?.toLowerCase() || "";
      const genreId = filters.genre ? GENRE_ID[filters.genre] : undefined;

      // Build discover query safely
      const parts = ["page=1", "include_adult=false", "sort_by=popularity.desc"];
      if (filterLang) parts.push(`with_original_language=${filterLang}`);
      if (genreId) parts.push(`with_genres=${genreId}`);
      const url = `/discover/movie?${parts.join("&")}`;

      console.log("Discover URL:", url);
      const discovered = await getMovies(url, langCode);

      // Fallback if empty
      const final = discovered.length
        ? discovered
        : await getMovies(`/movie/now_playing?page=1`, langCode);

      setMovies(final);
      setLoading(false);
    }
    loadMovies();
  }, [filters, language]);

  return (
    <main className="min-h-screen bg-black text-white p-6 mt-12 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-400 tracking-wider">{t("newMovies")}</h1>
      </div>

      <MovieFilterBar onFilterChange={setFilters} />

      {loading ? (
        <div className="flex gap-2 mt-6">
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.2s]"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.4s]"></div>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              arabicTitle={
                movie.original_title !== movie.title ? movie.original_title : undefined
              }
              posterPath={movie.posterPath}
              rating={movie.rating}
              releaseDate={movie.releaseDate}
              genres={movie.genres}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic mt-6">{t("noResults")}</p>
      )}
    </main>
  );
}
