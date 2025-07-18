import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: true, // This will remove all console logs in production builds
  },
};

export default nextConfig;
