import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Prevents `npm run build` from failing on ESLint errors in CI/Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

