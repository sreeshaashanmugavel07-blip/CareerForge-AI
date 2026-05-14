/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@clerk/nextjs"],
  experimental: {
    // Keep pdf-parse out of the server components bundle graph for Route Handlers.
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
      { protocol: "https", hostname: "images.clerk.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
