"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

type Filters = { genre: string; language: string };

export default function MovieFilterBar({
  onFilterChange,
}: {
  onFilterChange: (filters: Filters) => void;
}) {
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");

  function update(filters: Partial<Filters>) {
    const next = { genre, language, ...filters };
    setGenre(next.genre);
    setLanguage(next.language);
    onFilterChange(next);
  }

  const triggerClasses =
    "flex items-center justify-between px-4 py-2 w-full rounded-lg border border-gray-700 bg-[#141416] text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-filmsouk-gold focus:border-filmsouk-gold";
  const contentClasses =
  "bg-[#141416] text-gray-200 border border-gray-700 rounded-lg shadow-lg p-2 " +
  "max-h-[60vh] overflow-y-auto"; 

  return (
    <div className="w-1/2  mx-8 flex flex-row justify-center mx-auto align-center px-6 mt-2 mb-8">
      <div className="flex flex-row  items-center gap-x-3 gap-y-4 mt-8 mb-6">
        {/* Genre dropdown */}
        <Select value={genre} onValueChange={(val) => update({ genre: val })}>
          <SelectTrigger className={`w-10 min-w-0 truncate ${triggerClasses}`}>
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectGroup>
              <SelectLabel className="text-gray-400">Popular</SelectLabel>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="horror">Horror</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="thriller">Thriller</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="text-gray-400">More</SelectLabel>
              <SelectItem value="animation">Animation</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="scifi">Sci‑Fi</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="crime">Crime</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="war">War</SelectItem>
              <SelectItem value="western">Western</SelectItem>
              <SelectItem value="documentary">Documentary</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Language dropdown */}
        <Select
          value={language}
          onValueChange={(val) => update({ language: val })}
        >
          <SelectTrigger className={`w-40 min-w-0 truncate ${triggerClasses}`}>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectGroup>
              <SelectLabel className="text-gray-400">Common</SelectLabel>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="it">Italian</SelectItem>
              <SelectItem value="pt">Portuguese</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="text-gray-400">Asian cinema</SelectLabel>
              <SelectItem value="ko">Korean</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="text-gray-400">More</SelectLabel>
              <SelectItem value="tr">Turkish</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
              <SelectItem value="fa">Persian</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Clear button */}
        <button
          type="button"
          onClick={() => update({ genre: "", language: "" })}
          className="px-3 py-2 rounded-full border border-filmsouk-gold text-filmsouk-gold hover:bg-filmsouk-gold hover:text-black transition shadow-sm whitespace-nowrap"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
