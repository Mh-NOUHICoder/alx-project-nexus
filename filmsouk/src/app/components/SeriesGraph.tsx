"use client";

import React, { useEffect, useState } from "react";
import { fetchFromTMDB } from "@/app/lib/tmdb";

interface Episode {
  episode_number: number;
  vote_average: number;
}

interface Season {
  season_number: number;
  episodes: Episode[];
}

interface SeriesGraphProps {
  seriesId: string;
  totalSeasons: number;
  language?: string;
}

const getRatingColor = (rating: number) => {
  if (rating === 0) return "bg-gray-800 text-gray-500"; // No rating
  if (rating >= 8.5) return "bg-green-600 text-white font-bold";
  if (rating >= 8.0) return "bg-green-500 text-white font-bold";
  if (rating >= 7.5) return "bg-yellow-500 text-black font-bold";
  if (rating >= 7.0) return "bg-yellow-600 text-black font-bold";
  if (rating >= 6.0) return "bg-orange-500 text-white font-bold";
  return "bg-red-600 text-white font-bold";
};

const SeriesGraph: React.FC<SeriesGraphProps> = ({ seriesId, totalSeasons, language = "en" }) => {
  const [seasonsData, setSeasonsData] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxEpisodes, setMaxEpisodes] = useState(0);

  useEffect(() => {
    async function fetchAllSeasons() {
      setLoading(true);
      const allSeasons: Season[] = [];
      let maxEps = 0;

      // Fetch each season's episode ratings
      // Note: Season 0 is usually specials, we skip it unless it's the only one
      const startSeason = totalSeasons > 0 ? 1 : 0;
      
      const promises = [];
      for (let i = startSeason; i <= totalSeasons; i++) {
        promises.push(fetchFromTMDB(`/tv/${seriesId}/season/${i}`, language === "ar" ? "ar-SA" : "en-US"));
      }

      const results = await Promise.all(promises);

      results.forEach((data, index) => {
        if (data && data.episodes) {
          const seasonNum = startSeason + index;
          allSeasons.push({
            season_number: seasonNum,
            episodes: data.episodes.map((ep: any) => ({
              episode_number: ep.episode_number,
              vote_average: ep.vote_average || 0,
            })),
          });
          if (data.episodes.length > maxEps) {
            maxEps = data.episodes.length;
          }
        }
      });

      setSeasonsData(allSeasons);
      setMaxEpisodes(maxEps);
      setLoading(false);
    }

    if (seriesId) fetchAllSeasons();
  }, [seriesId, totalSeasons, language]);

  if (loading) return (
    <div className="flex justify-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-filmsouk-gold"></div>
    </div>
  );

  if (seasonsData.length === 0) return null;

  // Calculate Season Averages
  const seasonAverages = seasonsData.map(s => {
    const ratedEpisodes = s.episodes.filter(e => e.vote_average > 0);
    if (ratedEpisodes.length === 0) return 0;
    return ratedEpisodes.reduce((acc, curr) => acc + curr.vote_average, 0) / ratedEpisodes.length;
  });

  return (
    <div className="mt-12 overflow-x-auto bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Series <span className="text-filmsouk-gold">Graph</span>
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded"></div> Great</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Good</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-500 rounded"></div> Regular</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-600 rounded"></div> Bad</div>
        </div>
      </div>

      <div className="min-w-max">
        <table className="w-full border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th className="w-12"></th>
              {seasonsData.map((s) => (
                <th key={s.season_number} className="text-gray-400 text-sm font-semibold pb-2">
                  S{s.season_number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxEpisodes }).map((_, epIndex) => (
              <tr key={epIndex}>
                <td className="text-gray-500 text-[10px] font-bold pr-2 text-right align-middle uppercase">
                  E{epIndex + 1}
                </td>
                {seasonsData.map((s) => {
                  const episode = s.episodes.find((e) => e.episode_number === epIndex + 1);
                  return (
                    <td key={s.season_number} className="p-0">
                      {episode ? (
                        <div 
                          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg text-sm transition-transform hover:scale-110 cursor-default shadow-lg ${getRatingColor(episode.vote_average)}`}
                          title={`Season ${s.season_number} Episode ${episode.episode_number}: ${episode.vote_average}`}
                        >
                          {episode.vote_average > 0 ? episode.vote_average.toFixed(1) : "-"}
                        </div>
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Average Row */}
            <tr>
              <td className="text-filmsouk-gold text-[10px] font-black pr-2 text-right align-middle uppercase pt-4">
                AVG
              </td>
              {seasonAverages.map((avg, i) => (
                <td key={i} className="pt-4 text-center">
                  <div className="text-white font-bold border-t-2 border-filmsouk-gold/30 pt-2 text-base">
                    {avg > 0 ? avg.toFixed(1) : "-"}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeriesGraph;
