import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Нужен для production Docker-контейнера (multi-stage build)
  output: "standalone",

  // Логирование запросов к серверным экшенам / API
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
