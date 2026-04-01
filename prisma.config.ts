// Prisma CLI configuration file (required by Prisma 7+)
// This file is used by all Prisma CLI commands (generate, db push, migrate, studio, etc.)
// It tells the CLI where to find the schema files, where to store migrations,
// and how to connect to the database.
// Note: This file does NOT affect the runtime PrismaClient — runtime connection
// is configured separately in src/models/prisma.ts via the pg driver adapter.

import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Path to the schema directory (multi-file schema setup)
  // Prisma will load all .prisma files from this folder (base.prisma, user.prisma, article.prisma)
  schema: path.join(__dirname, "prisma", "schema"),

  // Directory where migration files will be stored when using `prisma migrate dev`
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },

  // Database connection URL used by the CLI (read from .env)
  // env() is Prisma's helper that reads environment variables loaded by dotenv
  datasource: {
    url: env("DATABASE_URL"),
  },
});
