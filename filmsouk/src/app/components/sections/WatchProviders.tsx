"use client";

import Image from "next/image";

interface Provider {
  provider_name: string;
  logo_path: string;
}

export default function WatchProviders({
  providers,
  link,
}: {
  providers: Provider[];
  link?: string;
}) {
  if (!providers || providers.length === 0) {
    return (
      <p className="text-gray-400 italic mt-4">
        Not available for streaming yet.
      </p>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-filmsouk-gold mb-4 flex items-center gap-2">
        🎬 Where to Watch
      </h2>

      <div className="flex gap-4 flex-wrap justify-center hover:cursor-pointer">
        {providers.map((p) => (
          <a
            key={p.provider_name}
            href={link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg shadow-md hover:scale-105 transition"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
              alt={p.provider_name}
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-white text-sm">{p.provider_name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
