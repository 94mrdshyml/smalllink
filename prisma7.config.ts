// Config for the Prisma 7 CLI (`prisma7 generate`, `prisma7 migrate ...`).
// The Prisma 8 CLI reads prisma.config.ts and only does the deploy.
import "dotenv/config";
import { defineConfig } from "@prisma/prisma7/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // generate runs at install time, before env vars always exist
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/smalllink" },
});
