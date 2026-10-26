import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático para servir desde el VPS (Dokploy).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
