'use client';

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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Live search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length > 2) {
        const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
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
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full h-12 z-50 flex items-center justify-between px-6 py-4
                 bg-black/60  border-b border-white/10 transition-all duration-300"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3 z-20">
        <Image src="/icons/play-icon.png" alt="Golden Screen Logo" width={50} height={40} />
        <span className="text-gray-300 font-bold text-2xl">
          <span className="text-[#D4AF37]">Golden</span>Screen
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-1 justify-center space-x-8 text-lg text-gray-300">
        <Link href="/" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
          <Home size={20} /> Home
        </Link>
        <Link href="/favorites" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
          <Heart size={20} /> Favorites
        </Link>
        <Link href="/new-movies" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
          <Sparkles size={20} /> New Movies
        </Link>
      </nav>
      

      {/* Small Search Input (only on non-home pages) */}
      {pathname !== "/" && (
        <div className="relative hidden md:flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 w-44"
            aria-label="Search movies"
          />
          <Search className="ml-2 text-[#D4AF37]" size={18} />
          {results.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-neutral-950/95 backdrop-blur-md rounded-lg border border-white/10 shadow-xl p-3 z-50">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  onClick={handleResultClick}
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
                    <span className="text-white text-sm font-semibold">{movie.title}</span>
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
        className="md:hidden text-gray-200 z-20"
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Drawer */}
      {open && (
        <>
          {/* Darker overlay for clarity */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-neutral-950/95 backdrop-blur-md
                       border-l border-white/10 shadow-2xl z-50 flex flex-col p-6 gap-6"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/icons/play-icon.png" alt="Golden Screen" width={28} height={22} />
                <span className="text-white font-semibold text-lg">
                  <span className="text-[#D4AF37]">Golden</span>Screen
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 rounded"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Optional divider */}
            <div className="h-px w-full bg-white/10" />

            {/* Mobile search (only on non-home pages) */}
            {pathname !== "/" && (
              <div className="relative">
                <label htmlFor="mobile-search" className="sr-only">Search movies</label>
                <input
                  id="mobile-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                />
                {results.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-neutral-950/95 rounded-lg border border-white/10 shadow-xl p-2">
                    {results.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-md transition"
                      >
                        {movie.posterPath && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                            alt={movie.title}
                            width={32}
                            height={48}
                            className="rounded"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">{movie.title}</span>
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

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-2 py-3 rounded-md text-white hover:bg-white/10 transition"
              >
                <Home size={22} className="text-[#D4AF37]" />
                <span className="text-base font-medium">Home</span>
              </Link>
              <Link
                href="/favorites"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-2 py-3 rounded-md text-white hover:bg-white/10 transition"
              >
                <Heart size={22} className="text-[#D4AF37]" />
                <span className="text-base font-medium">Favorites</span>
              </Link>
              <Link
                href="/new-movies"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-2 py-3 rounded-md text-white hover:bg-white/10 transition"
              >
                <Sparkles size={22} className="text-[#D4AF37]" />
                <span className="text-base font-medium">New Movies</span>
              </Link>
            </nav>

            {/* Safe area padding at bottom */}
            <div className="mt-auto pt-4">
              <div className="h-px w-full bg-white/10 mb-4" />
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Golden Screen</p>
            </div>
          </div>
        </>
      )}
    </header>
  );
}