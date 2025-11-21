"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Heart, Star, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

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
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-filmsouk-gold hover:scale-110 transition"
        >
          <Home size={20} /> Home
        </Link>
        <Link
          href="/favorites"
          className="flex items-center gap-2 hover:text-filmsouk-gold hover:scale-110 transition"
        >
          <Heart size={20} /> Favorites
        </Link>
        <Link
          href="/new-movies"
          className="flex items-center gap-2 hover:text-filmsouk-gold hover:scale-110 transition"
        >
          <Star size={20} /> New Movies
        </Link>
      </nav>

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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10"
            onClick={() => setOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-black/95 shadow-lg z-20 flex flex-col p-6 space-y-6 animate-slideIn">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-300 hover:text-filmsouk-gold transition"
            >
              <Home size={22} /> Home
            </Link>
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-300 hover:text-filmsouk-gold transition"
            >
              <Heart size={22} /> Favorites
            </Link>
            <Link
              href="/new-movies"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-300 hover:text-filmsouk-gold transition"
            >
              <Star size={22} /> New Movies
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
