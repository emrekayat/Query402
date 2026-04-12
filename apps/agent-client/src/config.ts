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
  API_BASE_URL: z.string().url().default("http://localhost:3001"),
  STELLAR_NETWORK: z.string().default("stellar:testnet"),
  STELLAR_RPC_URL: z.string().url().default("https://soroban-testnet.stellar.org"),
  DEMO_CLIENT_SECRET_KEY: z.string().optional(),
  DEMO_MODE: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

export const config = parsed.data;
