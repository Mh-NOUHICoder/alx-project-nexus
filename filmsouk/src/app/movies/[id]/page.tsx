"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchFromTMDB, getWatchProviders } from "@/app/lib/tmdb";
import { getGenreName } from "@/app/utils/genreMap";
import { Clapperboard, X } from "lucide-react";
import MovieCard from "@/app/components/MovieCard";
import WatchProviders from "@/app/components/sections/WatchProviders";
import { useLanguage } from "@/app/context/LanguageContext";

export default function MovieDetails() {
  const { language, t } = useLanguage();
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [providerLink, setProviderLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadProviders() {
      const providersData = await getWatchProviders(id as string);
      setProviders(providersData.results?.US?.flatrate || []);
      setProviderLink(providersData.results?.US?.link || undefined);
    }
    if (id) loadProviders();
  }, [id]);

  useEffect(() => {
    async function loadMovie() {
      const langCode = language === "ar" ? "ar-SA" : "en-US";
      let data = await fetchFromTMDB(
        `/movie/${id}?append_to_response=credits,videos`,
        langCode
      );
      if (data) {
        // Fallback for main movie videos if empty in localized language
        if (language === "ar" && (!data.videos?.results || data.videos.results.length === 0)) {
          const enData = await fetchFromTMDB(`/movie/${id}/videos`, "en-US");
          if (enData?.results) {
            data.videos = { results: enData.results };
          }
        }
        setMovie(data);

        // Check favorites
        const stored = localStorage.getItem("favorites");
        if (stored) {
          const favorites = JSON.parse(stored);
          setIsFavorite(favorites.some((f: any) => f.id === data.id));
        }
      }

      // Fetch recommendations
      let recData = await fetchFromTMDB(`/movie/${id}/recommendations`, langCode);
      if (!recData?.results?.length) {
        recData = await fetchFromTMDB(`/movie/${id}/similar`, langCode);
      }
      setRecommendations(recData.results || []);

      // Fetch watch providers
      const providersData = await getWatchProviders(id as string);
      setProviders(providersData.results?.US?.flatrate || []);
    }

    if (id) loadMovie();
  }, [id, language]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    if (!isFavorite) {
      favorites.push({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        genres: movie.genres.map((g: any) => getGenreName(g.id, language === "ar" ? "ar" : "en")),
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      const updated = favorites.filter((f: any) => f.id !== movie.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  if (!movie) return (
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
          );

  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  ) || movie.videos?.results?.find(
    (v: any) => (v.type === "Teaser" || v.type === "Clip") && v.site === "YouTube"
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover object-top object-center opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>

        <div className="absolute bottom-10 left-10 z-10">
          <h1 className="text-xl md:text-3xl font-bold text-filmsouk-gold">
            {movie.title}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleFavoriteClick}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-filmsouk-gold transition flex items-center justify-center"
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? (
                <FaHeart size={24} className="text-filmsouk-gold" />
              ) : (
                <FaRegHeart size={24} className="text-white" />
              )}
            </button>
            <span className="text-gray-200">
              {movie.release_date?.slice(0, 4)}
            </span>
            <span className="text-filmsouk-gold font-bold">
              {movie.vote_average.toFixed(1)} ⭐
            </span>
            <span>{movie.runtime} min</span>
          </div>

          {trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 mt-4 px-6 py-3 bg-filmsouk-gold text-black font-semibold rounded-lg shadow-md hover:scale-105 cursor-pointer transition"
            >
              <Clapperboard size={24} className="" /> {t("watchTrailer")}
            </button>
          )}
        </div>
      </section>

      {/* Details Section */}
      <section className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{t("overview")}</h2>
        <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("genres")}</h2>
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((g: any) => (
            <span
              key={g.id}
              className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
            >
              {getGenreName(g.id, language === "ar" ? "ar" : "en")}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("cast")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movie.credits.cast.slice(0, 8).map((actor: any) => (
            <div key={actor.id} className="text-center">
              <Image
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                width={120}
                height={180}
                className="rounded-lg mx-auto"
              />
              <p className="mt-2 text-sm">{actor.name}</p>
              <p className="text-xs text-gray-400">as {actor.character}</p>
            </div>
          ))}
        </div>
      </section>

      <WatchProviders providers={providers} link={providerLink} />

      {/* Recommendations Section */}
      <section className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {t("recommendations")}
        </h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <MovieCard
                key={rec.id}
                id={rec.id}
                title={rec.title}
                arabicTitle={
                  rec.original_title !== rec.title
                    ? rec.original_title
                    : undefined
                }
                posterPath={rec.poster_path}
                rating={rec.vote_average}
                releaseDate={rec.release_date}
                genres={rec.genre_ids?.map((id: number) => getGenreName(id, language === "ar" ? "ar" : "en"))}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">{t("noResults")}</p>
        )}
      </section>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setShowTrailer(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Movie Trailer"
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
    </main>
  );
}