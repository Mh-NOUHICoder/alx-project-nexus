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

  // Containers
  const outerContainer = "w-full px-2 mt-2 mb-8 flex justify-center";
  // Keep everything on a single row on all sizes. Allow horizontal scroll on very small screens.
  // min-w-0 on the row lets children shrink and truncate correctly.
  const rowContainer =
    "flex flex-row items-center gap-3 whitespace-nowrap overflow-x-auto no-scrollbar max-w-full mx-auto py-3 min-w-0";

  // Trigger base (glassy, compact, interactive)
  // Ensure min-w-0 + overflow-hidden so truncate works; pr-8 reserves space for the chevron/indicator
  const triggerBase =
    "flex items-center justify-between px-4 py-2 rounded-lg border bg-[rgba(20,20,22,0.6)] text-gray-100 text-sm font-medium cursor-pointer " +
    "backdrop-blur-sm border-gray-700 shadow-sm transition-transform transform hover:-translate-y-0.5 focus:outline-none min-w-0 overflow-hidden";

  // Use flex-none so items stay on one line and don't wrap; use valid Tailwind widths
  const genreTriggerClass = `flex-none w-36 sm:w-44 md:w-48 lg:w-56 text-left pr-8 truncate ${triggerBase}`;
  const languageTriggerClass = `flex-none w-24 sm:w-28 md:w-32 lg:w-36 text-left pr-8 truncate ${triggerBase}`;

  const contentClasses =
    "bg-[#0f0f10] text-gray-200 border border-gray-700 rounded-lg shadow-lg p-2 max-h-[60vh] overflow-y-auto";

  const clearButtonClass =
    "flex-none px-4 py-2 rounded-full border border-filmsouk-gold text-filmsouk-gold bg-transparent cursor-pointer hover:bg-filmsouk-gold hover:text-black transition-shadow transition-colors shadow-sm";

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
