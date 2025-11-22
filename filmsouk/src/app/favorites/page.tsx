"use client";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-filmsouk-gold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">You haven’t added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {favorites.map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              posterPath={m.posterPath}
              rating={m.rating}
              releaseDate={m.releaseDate}
              genres={m.genres}
            />
          ))}
        </div>
      )}
    </main>
  );
}