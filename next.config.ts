import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone: needed by Prisma Compute, harmless on Vercel
  output: "standalone",
  serverExternalPackages: ["pg"],
};

export default nextConfig;
