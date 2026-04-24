"use client";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useLanguage } from "@/app/context/LanguageContext";

export default function FavoritesPage() {
  const { t } = useLanguage();
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
      <h1 className="text-3xl text-center font-bold text-gray-400/50 dark:text-gray-400/80 mt-8 mb-6">{t("myFavorites")}</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">{t("noFavorites")}</p>
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
              type={m.type}
            />
          ))}
        </div>
      )}
    </main>
  );
}