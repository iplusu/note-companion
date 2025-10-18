import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // host: process.env.POSTGRES_HOST,
    // user: process.env.POSTGRES_USER,
    // password: process.env.POSTGRES_PASSWORD,
    // database: process.env.POSTGRES_DATABASE,
    host: "db.uityjashzcxhlvitislw.supabase.co",
    port: 6543,
    user: "postgres",
    password: "XmBiPBx3hqIIgCs7",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  },
});
