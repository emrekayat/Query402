import { nanoid } from "nanoid";
import type { ProviderResultItem, QueryResult } from "@query402/shared";
import { getProviderById } from "../lib/pricing.js";

function buildScrapeItems(targetUrl: string): ProviderResultItem[] {
  return [
    {
      title: "Page title",
      url: targetUrl,
      snippet: "Query402 demo extract: structured summary from target page.",
      score: 0.88
    },
    {
      title: "Key entities",
      url: `${targetUrl}#entities`,
      snippet: "Entities: Stellar, x402, USDC, facilitator, agent payments.",
      score: 0.84
    },
    {
      title: "Actionable insights",
      url: `${targetUrl}#insights`,
      snippet: "Highlights implementation-ready points for agent workflows.",
      score: 0.81
    }
  ];
}

export async function runScrapeProvider(targetUrl: string, providerId: string): Promise<QueryResult> {
  const provider = getProviderById(providerId);
  if (!provider || provider.category !== "scrape") {
    throw new Error(`Unknown scrape provider: ${providerId}`);
  }

  const latencyMs = Math.max(240, provider.latencyEstimateMs - 70 + Math.floor(Math.random() * 420));
  await new Promise((resolve) => setTimeout(resolve, Math.min(2200, latencyMs)));

  return {
    mode: "scrape",
    providerId: provider.id,
    providerName: provider.name,
    priceUsd: provider.priceUsd,
    latencyMs,
    timestamp: new Date().toISOString(),
    traceId: `trace_${nanoid(12)}`,
    items: buildScrapeItems(targetUrl),
    raw: {
      source: provider.sourceType,
      url: targetUrl,
      extractionDepth: provider.id.includes("extract") ? "structured" : "surface"
    }
  };
}
