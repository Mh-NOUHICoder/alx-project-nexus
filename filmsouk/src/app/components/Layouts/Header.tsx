"use client";
import Image from "next/image";
import Link from "next/link";
import { Home, Heart, Star } from "lucide-react"; // ✅ icons

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black shadow-md">
      {/* Logo */}
      <Link href="/">
      <div className="flex items-center space-x-3">
        <Image src="/icons/play-icon.png" alt="FilmSouk Logo" width={50} height={40} />
        <span className="text-gray-500 font-bold text-2xl"><span className=" text-filmsouk-gold">Golden</span>Screen</span>
      </div>
      </Link>

      {/* Navigation */}
      <nav className="flex space-x-6 text-lg text-gray-300">
        <Link href="/" className="flex items-center gap-2 hover:text-[#D4AF37]  hover:scale-110 transition">
          <Home size={20} className="" /> Home
        </Link>
        <Link href="/favorites" className="flex items-center gap-2 hover:text-[#D4AF37]  hover:scale-110 transition">
          <Heart size={20} /> Favorites
        </Link>
        <Link
          href="/new-movies"
          className="flex items-center gap-2 hover:text-[#D4AF37]  hover:scale-110 transition"
        >
          <Star size={20} />
          <span>New Movies</span>
        </Link>
      </nav>
    </header>
  );
}
