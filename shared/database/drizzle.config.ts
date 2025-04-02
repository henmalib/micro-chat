import { defineConfig } from "drizzle-kit";

const env = process.env;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgres://${env.PG_USER}:${env.PG_PASSWORD}@${env.PG_HOST}:${env.PG_PORT}/${env.PG_DB}`,
  },
});
