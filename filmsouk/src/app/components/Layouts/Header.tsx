"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Heart, Sparkles, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchFromTMDB } from "@/app/lib/tmdb";
import { genreMap } from "@/app/utils/genreMap";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const pathname = usePathname();

  // 🔍 Live search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length > 2) {
        const data = await fetchFromTMDB(
          `/search/movie?query=${encodeURIComponent(query)}`
        );
        if (data?.results) {
          setResults(
            data.results.slice(0, 5).map((m: any) => ({
              id: m.id,
              title: m.title,
              posterPath: m.poster_path,
              releaseDate: m.release_date,
              genres: m.genre_ids.map((id: number) => genreMap[id]),
            }))
          );
        }
      } else {
        setResults([]);
      }
    }, 400); // debounce for smoother typing

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <header className="flex items-center h-16 justify-between px-6 py-4 bg-black/50 shadow-md relative">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3 z-20">
        <Image
          src="/icons/play-icon.png"
          alt="Golden Screen Logo"
          width={50}
          height={40}
        />
        <span className="text-gray-500 font-bold text-2xl">
          <span className="text-filmsouk-gold">Golden</span>Screen
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-1 justify-center space-x-8 text-lg text-gray-300">
        <Link href="/" className="flex items-center gap-2 hover:text-filmsouk-gold transition">
          <Home size={20} /> Home
        </Link>
        <Link href="/favorites" className="flex items-center gap-2 hover:text-filmsouk-gold transition">
          <Heart size={20} /> Favorites
        </Link>
        <Link href="/new-movies" className="flex items-center gap-2 hover:text-filmsouk-gold transition">
          <Sparkles size={20} /> New Movies
        </Link>
      </nav>

      {/* Small Search Input (only on non-home pages) */}
      {pathname !== "/" && (
        <div className="relative hidden md:flex items-center">
          <Search className="ml-2 text-filmsouk-gold" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 rounded-full focus:outline-none w-40"
          />

          {/* Modern dropdown results */}
          {results.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-black/90 backdrop-blur-md rounded-lg shadow-lg p-3 z-50 animate-fadeIn">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-md transition"
                >
                  {movie.posterPath && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                      alt={movie.title}
                      width={40}
                      height={60}
                      className="rounded"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-semibold">
                      {movie.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {movie.releaseDate?.slice(0, 4)} • {movie.genres.join(", ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-gray-300 z-20"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10"
            onClick={() => setOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-64 bg-black/95 shadow-lg z-20 flex flex-col p-6 space-y-6 animate-slideIn">
            {/* Mobile search */}
            {pathname !== "/" && (
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 bg-white/10 text-white rounded-md focus:outline-none"
                />
                {results.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-black/90 rounded-lg shadow-lg p-2 z-50 animate-fadeIn">
                    {results.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md transition"
                      >
                        {movie.posterPath && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                            alt={movie.title}
                            width={30}
                            height={45}
                            className="rounded"
                          />
                        )}
                        <span className="text-white text-sm">{movie.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-300 hover:text-filmsouk-gold transition">
              <Home size={22} /> Home
            </Link>
            <Link href="/favorites" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-300 hover:text-filmsouk-gold transition">
              <Heart size={22} /> Favorites
            </Link>
            <Link href="/new-movies" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-300 hover:text-filmsouk-gold transition">
              <Sparkles size={22} /> New Movies
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
