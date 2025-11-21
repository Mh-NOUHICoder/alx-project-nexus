"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // ✅ use react-icons

interface MovieCardProps {
  id: number;
  title: string;
  arabicTitle?: string;
  posterPath: string;
  rating?: number;
  releaseDate?: string;
  genres?: string[];
}

export default function MovieCard({
  id,
  title,
  arabicTitle,
  posterPath,
  rating,
  releaseDate,
  genres = [],
}: MovieCardProps) {
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const primaryGenres = genres.slice(0, 2);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);

    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    if (!isFavorite) {
      // Add movie
      favorites.push({ id, title, posterPath, rating, releaseDate, genres });
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      // Remove movie
      const updated = favorites.filter((f: any) => f.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  return (
    <Link href={`/movies/${id}`} className="block">
      <div className="relative group w-full max-w-xs rounded-xl overflow-hidden shadow-xl border border-filmsouk-gold bg-black hover:cursor-pointer">
        {/* Poster */}
        <Image
          src={`${IMG_BASE_URL}${posterPath}`}
          alt={title}
          width={300}
          height={450}
          className="w-full h-auto object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
        />

        {/* Subtle darkness on poster */}
        <div className="absolute inset-0 bg-black/15"></div>

        {/* Favorite icon (top-left) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 z-30 bg-black/60 backdrop-blur-sm p-2 rounded-full hover:bg-filmsouk-gold transition"
        >
          {isFavorite ? (
            <FaHeart size={20} className="text-filmsouk-gold" />
          ) : (
            <FaRegHeart size={20} className="text-white" />
          )}
        </button>

        {/* Grouped infos (top-right, hidden until hover) */}
        <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="px-3 py-3 flex flex-col items-end gap-2 text-xs text-white">
            {primaryGenres.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {primaryGenres.map((g, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-white/50 text-black rounded-md font-semibold"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
            {releaseDate && (
              <span className="bg-gray-800/80 px-2 py-1 rounded-md">
                {new Date(releaseDate).getFullYear()}
              </span>
            )}
            {typeof rating === "number" && (
              <span className="bg-black/10 text-filmsouk-gold font-bold px-2 py-1 rounded-md shadow-sm">
                {rating.toFixed(1)} ⭐
              </span>
            )}
          </div>
        </div>

        {/* Play icon (center, smooth animation) */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Image
            src="/icons/play-icon.png"
            alt="Play Icon"
            width={72}
            height={72}
            className="opacity-0 group-hover:opacity-100 transition duration-500 ease-out
                     group-hover:scale-110 group-hover:rotate-12"
          />
        </div>

        {/* Bottom glass title */}
        <div className="absolute bottom-0 w-full z-30 bg-black/10 backdrop-blur-sm">
          <div className="px-4 pt-2">
            <hr className="border-t border-gray-600 mb-2" />
          </div>
          <div className="px-4 pb-3 text-center">
            <h3 className="text-lg font-medium text-white leading-tight">
              {title}
            </h3>
            {arabicTitle && (
              <p className="text-sm text-gray-300 font-medium">{arabicTitle}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
