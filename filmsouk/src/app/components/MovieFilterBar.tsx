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

  // Outer layout: centered, no horizontal scroll
  const outerContainer = "w-full px-2 mt-2 mb-8 flex justify-center";
  // Row: single line visually, children share available space and shrink when needed
  const rowContainer =
    "flex flex-row items-center gap-3 w-full max-w-3xl mx-auto py-3 min-w-0";

  // Trigger base: allow shrinking (min-w-0), reserve space for chevron (pr-8),
  // smaller text on very small screens, larger on sm+
  const triggerBase =
    "flex items-center justify-between rounded-lg border bg-[rgba(20,20,22,0.6)] text-gray-100 font-medium " +
    "backdrop-blur-sm border-gray-700 shadow-sm transition-transform transform hover:-translate-y-0.5 focus:outline-none " +
    "min-w-0 overflow-hidden";

  // Use flex-1 so controls share available width and never force horizontal scroll.
  // On very small screens we reduce padding and font-size to fit.
  const genreTriggerClass =
    `flex-1 min-w-0 text-left pr-8 truncate ${triggerBase} ` +
    "px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm";
  const languageTriggerClass =
    `flex-[0.7] min-w-0 text-left pr-8 truncate ${triggerBase} ` +
    "px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm";

  const contentClasses =
    "bg-[#0f0f10] text-gray-200 border border-gray-700 rounded-lg shadow-lg p-2 max-h-[60vh] overflow-y-auto";

  // Clear button stays compact and won't grow
  const clearButtonClass =
    "flex-none px-3 py-2 rounded-full border border-filmsouk-gold text-filmsouk-gold bg-transparent cursor-pointer " +
    "hover:bg-filmsouk-gold hover:text-black transition-shadow transition-colors text-xs sm:text-sm";

  return (
    <div className={outerContainer}>
      <div className={rowContainer}>
        {/* Genre dropdown */}
        <Select value={genre} onValueChange={(val) => update({ genre: val })}>
          <SelectTrigger className={genreTriggerClass}>
            <span className="truncate block w-full">
              <SelectValue placeholder="Genre" />
            </span>
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
          <SelectTrigger className={languageTriggerClass}>
            <span className="truncate block w-full">
              <SelectValue placeholder="Language" />
            </span>
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
          className={clearButtonClass}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
