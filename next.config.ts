import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {    
    ignoreBuildErrors: true,
  },
   eslint: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
