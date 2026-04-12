import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../.env"),
    path.resolve(process.cwd(), "../../.env")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
      return;
    }
  }

  dotenv.config();
}

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT_API: z.coerce.number().default(3001),
  STELLAR_NETWORK: z.string().default("stellar:testnet"),
  STELLAR_RPC_URL: z.string().url().default("https://soroban-testnet.stellar.org"),
  X402_FACILITATOR_URL: z.string().url().default("https://facilitator.x402.org"),
  X402_PAY_TO_ADDRESS: z.string().min(10, "X402_PAY_TO_ADDRESS is required"),
  API_BASE_URL: z.string().url().default("http://localhost:3001"),
  DEMO_CLIENT_SECRET_KEY: z.string().optional(),
  DEMO_CLIENT_PUBLIC_KEY: z.string().optional(),
  BRAVE_API_KEY: z.string().optional(),
  SERPAPI_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
  DEMO_MODE: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

export const config = {
  ...parsed.data,
  demoMode: parsed.data.DEMO_MODE === "true"
};
