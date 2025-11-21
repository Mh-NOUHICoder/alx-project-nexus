"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchFromTMDB } from "../../lib/tmdb";
import { genreMap } from "../../utils/genreMap";
import { X } from "lucide-react"; // ✅ Lucide close icon

export default function MovieDetails() {
  const { id } = useParams(); // movie ID from URL
  const [movie, setMovie] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      const data = await fetchFromTMDB(`/movie/${id}?append_to_response=credits,videos`);
      if (data) {
        setMovie(data);

        // Check if already in favorites
        const stored = localStorage.getItem("favorites");
        if (stored) {
          const favorites = JSON.parse(stored);
          setIsFavorite(favorites.some((f: any) => f.id === data.id));
        }
      }
    }
    loadMovie();
  }, [id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    if (!isFavorite) {
      favorites.push({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        genres: movie.genres.map((g: any) => genreMap[g.id]),
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      const updated = favorites.filter((f: any) => f.id !== movie.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  if (!movie) return <p className="text-center text-gray-400">Loading...</p>;

  // Find YouTube trailer
  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover object-top opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"></div>

        <div className="absolute bottom-10 left-10 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-filmsouk-gold">{movie.title}</h1>
          {movie.original_title !== movie.title && (
            <p className="text-lg text-gray-300">{movie.original_title}</p>
          )}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleFavoriteClick}
              className="bg-black/60 p-3 rounded-full hover:bg-filmsouk-gold transition"
            >
              {isFavorite ? (
                <FaHeart size={24} className="text-filmsouk-gold" />
              ) : (
                <FaRegHeart size={24} className="text-white" />
              )}
            </button>
            <span className="text-gray-200">{movie.release_date?.slice(0, 4)}</span>
            <span className="text-filmsouk-gold font-bold">{movie.vote_average.toFixed(1)} ⭐</span>
            <span>{movie.runtime} min</span>
          </div>

          {/* Watch Trailer Button */}
          {trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="mt-4 px-6 py-3 bg-filmsouk-gold text-black font-semibold rounded-lg shadow-md hover:scale-105 hover:cursor-pointer transition"
            >
              🎬 Watch Trailer
            </button>
          )}
        </div>
      </section>

      {/* Details Section */}
      <section className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((g: any) => (
            <span
              key={g.id}
              className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
            >
              {genreMap[g.id] || g.name}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movie.credits.cast.slice(0, 8).map((actor: any) => (
            <div key={actor.id} className="text-center">
              <Image
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                width={120}
                height={180}
                className="rounded-lg mx-auto"
              />
              <p className="mt-2 text-sm">{actor.name}</p>
              <p className="text-xs text-gray-400">as {actor.character}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowTrailer(false)} // close when clicking outside
        >
          <div
            className="relative w-full max-w-3xl aspect-video bg-black rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>

            {/* Close button */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full  hover:text-filmsouk-gold cursor-pointer transition"
            >
              <X size={24} /> {/* ✅ Lucide close icon */}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
