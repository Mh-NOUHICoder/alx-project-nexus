import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["image.tmdb.org"], // ✅ allow TMDb posters
  },
};

export default nextConfig;