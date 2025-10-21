import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";
import { URL } from "url"; // URL을 분해하기 위해 import 합니다.

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Vercel이 제공하는 커넥션 풀러 URL을 가져옵니다.
const poolerUrl = process.env.POSTGRES_PRISMA_URL;

if (!poolerUrl) {
  throw new Error("POSTGRES_PRISMA_URL environment variable is not set.");
}

// URL을 각 구성요소(host, user, password 등)로 분해합니다.
const parsedUrl = new URL(poolerUrl);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port || "6543"),
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.split("/")[1] || "postgres",

    // SSL 오류를 해결하기 위한 핵심 설정
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
