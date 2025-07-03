import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Optional: Change the output directory `out` -> `dist`
  distDir: 'dist',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
