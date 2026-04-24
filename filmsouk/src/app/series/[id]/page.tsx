"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchFromTMDB, getWatchProviders } from "@/app/lib/tmdb";
import { getGenreName } from "@/app/utils/genreMap";
import { Clapperboard, X, Tv } from "lucide-react";
import MovieCard from "@/app/components/MovieCard";
import WatchProviders from "@/app/components/sections/WatchProviders";
import { useLanguage } from "@/app/context/LanguageContext";
import SeriesGraph from "@/app/components/SeriesGraph";

export default function SeriesDetails() {
  const { language, t } = useLanguage();
  const { id } = useParams();
  const [series, setSeries] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [seasonTrailer, setSeasonTrailer] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [providerLink, setProviderLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      const langCode = language === "ar" ? "ar-SA" : "en-US";
      let data = await fetchFromTMDB(`/tv/${id}?append_to_response=credits,videos`, langCode);
      if (data) {
        // Fallback for main series videos if empty in localized language
        if (language === "ar" && (!data.videos?.results || data.videos.results.length === 0)) {
          const enData = await fetchFromTMDB(`/tv/${id}/videos`, "en-US");
          if (enData?.results) {
            data.videos = { results: enData.results };
          }
        }
        setSeries(data);
        const stored = localStorage.getItem("favorites");
        if (stored) {
          const favorites = JSON.parse(stored);
          setIsFavorite(favorites.some((f: any) => f.id === data.id));
        }
      }

      // Recommendations
      let recData = await fetchFromTMDB(`/tv/${id}/recommendations`, langCode);
      if (!recData?.results?.length) {
        recData = await fetchFromTMDB(`/tv/${id}/similar`, langCode);
      }
      setRecommendations(recData?.results || []);

      // Providers
      const providersData = await getWatchProviders(id as string, "tv");
      setProviders(providersData?.results?.US?.flatrate || []);
      setProviderLink(providersData?.results?.US?.link || undefined);
    }
    if (id) loadData();
  }, [id, language]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    if (!isFavorite) {
      favorites.push({
        id: series.id,
        title: series.name,
        posterPath: series.poster_path,
        rating: series.vote_average,
        releaseDate: series.first_air_date,
        genres: series.genres.map((g: any) => getGenreName(g.id, language === "ar" ? "ar" : "en")),
        type: "series",
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      const updated = favorites.filter((f: any) => f.id !== series.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  const handleWatchSeasonTrailer = async (seasonNumber: number) => {
    const langCode = language === "ar" ? "ar-SA" : "en-US";
    let data = await fetchFromTMDB(`/tv/${id}/season/${seasonNumber}/videos`, langCode);
    
    // 1. Try to find a Trailer/Teaser in current language
    let video = data?.results?.find((v: any) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube");

    // 2. If missing and language is not English, try English (often has more trailers)
    if (!video && language === "ar") {
      data = await fetchFromTMDB(`/tv/${id}/season/${seasonNumber}/videos`, "en-US");
      video = data?.results?.find((v: any) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube");
    }
    
    // 3. Fallback to Clip if still missing
    if (!video) {
      video = data?.results?.find((v: any) => v.type === "Clip" && v.site === "YouTube");
    }

    // 4. Final fallback: use the main series trailer if available
    if (!video && series.videos?.results) {
      video = series.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
              series.videos.results.find((v: any) => (v.type === "Teaser" || v.type === "Clip") && v.site === "YouTube");
    }

    if (video) {
      setSeasonTrailer(video.key);
    } else {
      alert("No video found for this season or series.");
    }
  };

  if (!series) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
    </div>
  );

  const trailer = series.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  ) || series.videos?.results?.find(
    (v: any) => (v.type === "Teaser" || v.type === "Clip") && v.site === "YouTube"
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
          alt={series.name}
          fill
          className="object-cover object-top opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>

        <div className="absolute bottom-10 left-10 z-10">
          <h1 className="text-xl md:text-3xl font-bold text-filmsouk-gold">
            {series.name}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm md:text-base">
            <span>{series.first_air_date?.slice(0, 4)}</span>
            <span className="text-filmsouk-gold font-bold">{series.vote_average.toFixed(1)} ⭐</span>
            <span>{series.number_of_seasons} {t("seasons")}</span>
            <span className="bg-white/10 px-2 py-1 rounded">{t("tvShows")}</span>
          </div>

          {trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 mt-4 px-6 py-3 bg-filmsouk-gold text-black font-semibold rounded-lg hover:scale-105 transition"
            >
              <Clapperboard size={24} /> {t("watchTrailer")}
            </button>
          )}
        </div>
      </section>

      {/* Ratings Graph Section */}
      <section className="px-6 max-w-7xl mx-auto -mt-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: Poster & Info */}
          <div className="lg:w-1/4">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-filmsouk-gold shadow-2xl">
              <Image
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-filmsouk-gold">{series.vote_average.toFixed(1)} ⭐</span>
                  <span className="text-gray-400 text-sm">{series.vote_count} votes</span>
               </div>
               <button
                  onClick={handleFavoriteClick}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-filmsouk-gold hover:text-black rounded-xl transition font-bold"
               >
                  {isFavorite ? <FaHeart size={20} className="text-red-500" /> : <FaRegHeart size={20} />}
                  {isFavorite ? t("favorites") : t("favorites")}
               </button>
            </div>
          </div>

          {/* Right Main: Graph */}
          <div className="lg:w-3/4">
             <SeriesGraph seriesId={id as string} totalSeasons={series.number_of_seasons} language={language} />
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{t("overview")}</h2>
        <p className="text-gray-300 leading-relaxed">{series.overview}</p>

        <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
                <h3 className="text-xl font-semibold mb-2">{t("genres")}</h3>
                <div className="flex flex-wrap gap-2">
                    {series.genres.map((g: any) => (
                        <span key={g.id} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                            {getGenreName(g.id, language === "ar" ? "ar" : "en")}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">{t("status")}</h3>
                <span className="text-filmsouk-gold font-medium">{series.status}</span>
            </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("cast")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {series.credits.cast.slice(0, 8).map((actor: any) => (
            <div key={actor.id} className="text-center">
              <Image
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/images/placeholder.jpg"}
                alt={actor.name}
                width={120}
                height={180}
                className="rounded-lg mx-auto object-cover h-[180px]"
              />
              <p className="mt-2 text-sm font-medium">{actor.name}</p>
              <p className="text-xs text-gray-400">as {actor.character}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seasons Section */}
      <section className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">{t("seasons")}</h2>
        <div className="flex flex-col gap-6">
          {series.seasons.map((season: any) => (
            <div key={season.id} className="flex flex-col md:flex-row gap-6 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
              <div className="relative w-full md:w-40 h-60 shrink-0">
                <Image
                  src={season.poster_path ? `https://image.tmdb.org/t/p/w300${season.poster_path}` : "/images/placeholder.jpg"}
                  alt={season.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-filmsouk-gold">{season.name}</h3>
                  <button
                    onClick={() => handleWatchSeasonTrailer(season.season_number)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-filmsouk-gold hover:text-black rounded-lg transition text-sm font-semibold"
                  >
                    <Clapperboard size={18} /> {t("seasonTrailer")}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {season.air_date?.slice(0, 4)} • {season.episode_count} {t("episodes")}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
                  {season.overview || t("noDescription")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WatchProviders providers={providers} link={providerLink} />

      {/* Recommendations Section */}
      <section className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{t("youMightLike")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec: any) => (
              <MovieCard
                key={rec.id}
                id={rec.id}
                title={rec.name}
                posterPath={rec.poster_path}
                rating={rec.vote_average}
                releaseDate={rec.first_air_date}
                genres={rec.genre_ids?.map((id: number) => getGenreName(id, language === "ar" ? "ar" : "en"))}
                type="series"
              />
            ))}
        </div>
      </section>

      {/* Main Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setShowTrailer(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Series Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-xl"
            ></iframe>
            <button onClick={() => setShowTrailer(false)} className="absolute top-[-50px] right-2 text-white hover:text-filmsouk-gold transition">
              <X size={32} />
            </button>
          </div>
        </div>
      )}

      {/* Season Trailer Modal */}
      {seasonTrailer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setSeasonTrailer(null)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${seasonTrailer}?autoplay=1`}
              title="Season Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-xl"
            ></iframe>
            <button onClick={() => setSeasonTrailer(null)} className="absolute top-[-50px] right-2 text-white hover:text-filmsouk-gold transition">
              <X size={32} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
