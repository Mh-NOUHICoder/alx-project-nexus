"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations = {
  en: {
    home: "Home",
    favorites: "Favorites",
    newMovies: "New Movies",
    tvShows: "TV Shows",
    searchPlaceholder: "Search movies & series...",
    welcomeTitle: "Welcome to Golden Screen",
    welcomeSubtitle: "Discover trending films, timeless classics, and hidden gems.",
    search: "Search",
    trendingMovies: "Trending Movies",
    trendingSeries: "Trending Series",
    searchResults: "Search Results",
    noResults: "No results to show.",
    overview: "Overview",
    genres: "Genres",
    cast: "Cast",
    recommendations: "Recommendations",
    youMightLike: "You Might Also Like",
    seasons: "Seasons",
    seasonTrailer: "Season Trailer",
    watchTrailer: "Watch Trailer",
    status: "Status",
    episodes: "Episodes",
    noDescription: "No description available.",
    myFavorites: "My Favorites",
    noFavorites: "You haven’t added any favorites yet.",
    movie: "Movie",
    tv: "TV",
    sortBy: "Sort By",
    popularity: "Popularity",
    bestRating: "Best Rating",
    newest: "Newest",
    genre: "Genre",
    languageLabel: "Language",
    clear: "Clear",
    popular: "Popular",
    more: "More",
    action: "Action",
    comedy: "Comedy",
    drama: "Drama",
    horror: "Horror",
    romance: "Romance",
    thriller: "Thriller",
    animation: "Animation",
    adventure: "Adventure",
    fantasy: "Fantasy",
    scifi: "Sci-Fi",
    mystery: "Mystery",
    crime: "Crime",
    family: "Family",
    music: "Music",
    history: "History",
    war: "War",
    western: "Western",
    documentary: "Documentary",
    kids: "Kids",
    news: "News",
    reality: "Reality",
    soap: "Soap",
    talk: "Talk",
  },
  ar: {
    home: "الرئيسية",
    favorites: "المفضلة",
    newMovies: "أفلام جديدة",
    tvShows: "مسلسلات",
    searchPlaceholder: "ابحث عن أفلام ومسلسلات...",
    welcomeTitle: "مرحباً بكم في جولدن سكرين",
    welcomeSubtitle: "اكتشف الأفلام الرائجة، الكلاسيكيات الخالدة، والجواهر المخفية.",
    search: "بحث",
    trendingMovies: "أفلام رائجة",
    trendingSeries: "مسلسلات رائجة",
    searchResults: "نتائج البحث",
    noResults: "لا توجد نتائج للعرض.",
    overview: "نبذة عن العمل",
    genres: "التصنيف",
    cast: "طاقم العمل",
    recommendations: "توصيات",
    youMightLike: "قد يعجبك أيضاً",
    seasons: "المواسم",
    seasonTrailer: "إعلان الموسم",
    watchTrailer: "مشاهدة الإعلان",
    status: "الحالة",
    episodes: "حلقات",
    noDescription: "لا يوجد وصف متاح.",
    myFavorites: "مفضلتي",
    noFavorites: "لم تقم بإضافة أي مفضلات بعد.",
    movie: "فيلم",
    tv: "مسلسل",
    sortBy: "ترتيب حسب",
    popularity: "الأكثر شعبية",
    bestRating: "الأفضل تقييماً",
    newest: "الأحدث",
    genre: "التصنيف",
    languageLabel: "اللغة",
    clear: "مسح",
    popular: "شائع",
    more: "المزيد",
    action: "أكشن",
    comedy: "كوميديا",
    drama: "دراما",
    horror: "رعب",
    romance: "رومانسي",
    thriller: "إثارة",
    animation: "رسوم متحركة",
    adventure: "مغامرة",
    fantasy: "فانتازيا",
    scifi: "خيال علمي",
    mystery: "غموض",
    crime: "جريمة",
    family: "عائلي",
    music: "موسيقى",
    history: "تاريخ",
    war: "حرب",
    western: "غربي",
    documentary: "وثائقي",
    kids: "أطفال",
    news: "أخبار",
    reality: "واقع",
    soap: "أوبرا صابونية",
    talk: "حوار",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      <div dir={mounted ? dir : "ltr"} className={mounted && language === "ar" ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
