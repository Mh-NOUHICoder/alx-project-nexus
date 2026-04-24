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
import { useLanguage } from "@/app/context/LanguageContext";

type Filters = { genre: string; language: string; sortBy: string };

export default function MovieFilterBar({
  onFilterChange,
}: {
  onFilterChange: (filters: Filters) => void;
}) {
  const { t } = useLanguage();
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  function update(filters: Partial<Filters>) {
    const next = { genre, language, sortBy, ...filters };
    setGenre(next.genre);
    setLanguage(next.language);
    setSortBy(next.sortBy);
    onFilterChange(next);
  }

  // Outer layout: centered, no horizontal scroll
  const outerContainer = "w-full px-2 mt-2 mb-8 flex justify-center";
  // Row: single line visually, children share available space and shrink when needed
  const rowContainer =
    "flex flex-row flex-wrap items-center justify-center gap-3 w-full max-w-4xl mx-auto py-3 min-w-0";

  // Trigger base: allow shrinking (min-w-0), reserve space for chevron (pr-8),
  // smaller text on very small screens, larger on sm+
  const triggerBase =
    "flex items-center justify-between rounded-lg border bg-[rgba(20,20,22,0.6)] text-gray-100 font-medium " +
    "backdrop-blur-sm border-gray-700 shadow-sm transition-transform transform hover:-translate-y-0.5 focus:outline-none " +
    "min-w-[120px] overflow-hidden px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm";

  const contentClasses =
    "bg-[#0f0f10] text-gray-200 border border-gray-700 rounded-lg shadow-lg p-2 max-h-[60vh] overflow-y-auto";

  // Clear button stays compact and won't grow
  const clearButtonClass =
    "flex-none px-3 py-2 rounded-full border border-filmsouk-gold text-filmsouk-gold bg-transparent cursor-pointer " +
    "hover:bg-filmsouk-gold hover:text-black transition-shadow transition-colors text-xs sm:text-sm";

  return (
    <div className={outerContainer}>
      <div className={rowContainer}>
        {/* Sort By dropdown */}
        <Select value={sortBy} onValueChange={(val) => update({ sortBy: val })}>
          <SelectTrigger className={triggerBase}>
            <span className="truncate block w-full">
              <SelectValue placeholder={t("sortBy")} />
            </span>
          </SelectTrigger>
          <SelectContent className={contentClasses}>
             <SelectItem value="popularity.desc">{t("popularity")}</SelectItem>
             <SelectItem value="vote_average.desc">{t("bestRating")}</SelectItem>
             <SelectItem value="first_air_date.desc">{t("newest")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Genre dropdown */}
        <Select value={genre} onValueChange={(val) => update({ genre: val })}>
          <SelectTrigger className={triggerBase}>
            <span className="truncate block w-full">
              <SelectValue placeholder={t("genre")} />
            </span>
          </SelectTrigger>
          <SelectContent className={contentClasses}>
            <SelectGroup>
              <SelectLabel className="text-gray-400">{t("popular")}</SelectLabel>
              <SelectItem value="action">{t("action")}</SelectItem>
              <SelectItem value="comedy">{t("comedy")}</SelectItem>
              <SelectItem value="drama">{t("drama")}</SelectItem>
              <SelectItem value="horror">{t("horror")}</SelectItem>
              <SelectItem value="romance">{t("romance")}</SelectItem>
              <SelectItem value="thriller">{t("thriller")}</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="text-gray-400">{t("more")}</SelectLabel>
              <SelectItem value="animation">{t("animation")}</SelectItem>
              <SelectItem value="adventure">{t("adventure")}</SelectItem>
              <SelectItem value="fantasy">{t("fantasy")}</SelectItem>
              <SelectItem value="scifi">{t("scifi")}</SelectItem>
              <SelectItem value="mystery">{t("mystery")}</SelectItem>
              <SelectItem value="crime">{t("crime")}</SelectItem>
              <SelectItem value="family">{t("family")}</SelectItem>
              <SelectItem value="music">{t("music")}</SelectItem>
              <SelectItem value="history">{t("history")}</SelectItem>
              <SelectItem value="war">{t("war")}</SelectItem>
              <SelectItem value="western">{t("western")}</SelectItem>
              <SelectItem value="documentary">{t("documentary")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Language dropdown */}
        <Select
          value={language}
          onValueChange={(val) => update({ language: val })}
        >
          <SelectTrigger className={triggerBase}>
            <span className="truncate block w-full">
              <SelectValue placeholder={t("languageLabel")} />
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
              <SelectLabel className="text-gray-400">{t("more")}</SelectLabel>
              <SelectItem value="tr">Turkish</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
              <SelectItem value="fa">Persian</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Clear button */}
        <button
          type="button"
          onClick={() => update({ genre: "", language: "", sortBy: "popularity.desc" })}
          className={clearButtonClass}
        >
          {t("clear")}
        </button>
      </div>
    </div>
  );
}
