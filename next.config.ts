import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dockerfile の standalone モードに必要
  output: "standalone",
};

export default nextConfig;
