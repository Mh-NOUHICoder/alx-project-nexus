import { Coffee, Film, Heart } from 'lucide-react';
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/10 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="text-filmsouk-gold font-semibold text-lg">
          Golden Screen <span className="text-white">| الشاشة الذهبية</span>
        </div>

        {/* Navigation (without Movies link) */}
        <nav className="flex gap-6 text-sm">
          <a href="/new-movies" className="hover:text-[#D4AF37]  hover:scale-110 transition">New Releases</a>
          <a href="/favorites" className="hover:text-[#D4AF37]  hover:scale-110 transition">Favorites</a>
        </nav>

        {/* Fun closing line */}
        <p className="text-xs text-center md:text-right italic flex items-center gap-2 text-gray-400">
                <Heart className="w-4 h-4 text-red-500" />
                Built with love,
                <Coffee className="w-4 h-4 text-yellow-600" />
                fueled by coffee,
                <Film className="w-4 h-4 text-filmsouk-gold" />
                powered by TMDB
                </p>
      </div>
    </footer>
  );
}



