'use client';

import { useEffect, useState } from "react";
import { fetchFromTMDB } from "./lib/tmdb";
import MovieCard from "./components/MovieCard";
import { genreMap } from "./utils/genreMap";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  // 🔍 Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    if (data) {
      const mapped = data.results.map((m: any) => ({
        id: m.id,
        title: m.title,
        posterPath: m.poster_path,
        rating: m.vote_average,
        releaseDate: m.release_date,
        genres: m.genre_ids.map((id: number) => genreMap[id]),
      }));
      setMovies(mapped); // ✅ replace grid with search results
    }
  };

  // 📈 Load trending movies initially
  useEffect(() => {
    async function loadMovies() {
      const data = await fetchFromTMDB("/trending/movie/week?");
      if (data) {
        const mapped = data.results.map((m: any) => ({
          id: m.id,
          title: m.title,
          posterPath: m.poster_path,
          rating: m.vote_average,
          releaseDate: m.release_date,
          genres: m.genre_ids.map((id: number) => genreMap[id]),
        }));
        setMovies(mapped);
      }
    }
    loadMovies();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center ">
        <Image
          src="/images/bg-hero.jpg" // ✅ must be in /public/images
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/50"></div>

        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-filmsouk-gold drop-shadow-lg">
            Welcome to Golden Screen
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Discover trending films, timeless classics, and hidden gems.
          </p>

          {/* Clean Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex items-center bg-white/10 backdrop-blur-md rounded-full shadow-md overflow-hidden"
          >
            <Search className="ml-3 text-filmsouk-gold" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-filmsouk-gold text-black font-semibold hover:bg-yellow-400 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
        <div className=" col-span-full ">
          <h1 className="text-3xl font-bold text-white mb-6">Trending Movies</h1>
        </div>
        {movies.map((m) => (
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
      </section>
    </main>
  );
}
