/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  // Keep dev and production artifacts isolated to avoid stale chunk collisions.
  distDir: isDev ? ".next-dev" : ".next",
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
