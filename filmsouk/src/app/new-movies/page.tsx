"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/app/components/MovieCard";
import { getMovies } from "@/app/lib/tmdb";
import { Film } from "lucide-react"; // ✅ clean icon

export default function NewMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    async function loadMovies() {
      const data = await getMovies("/movie/now_playing?language=en-US&page=1");
      setMovies(data);
    }
    loadMovies();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-md">
          <Film className="text-filmsouk-gold w-6 h-6" /> {/* ✅ clean icon */}
        </div>
        <h1 className="text-3xl font-bold text-filmsouk-gold tracking-wide">
          New Movies
        </h1>
      </div>

      {/* Grid */}
      {movies.length > 0 ? (
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
        <p className="text-gray-400 italic">No new movies available right now.</p>
      )}
    </main>
  );
}
