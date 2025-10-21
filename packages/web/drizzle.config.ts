import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Vercel + Supabase 연동에 최적화된
    // "커넥션 풀러" URL을 직접 사용합니다.
    url: process.env.POSTGRES_PRISMA_URL!,

    // "셀프 서명 인증서" 오류를 방지하기 위해
    // 이 SSL 설정은 반드시 필요합니다.
    ssl: {
      rejectUnauthorized: false
    }
  },
});
