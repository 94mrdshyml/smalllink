import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // generate runs at install time, before env vars always exist
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/smalllink" },
});
