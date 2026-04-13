import { nanoid } from "nanoid";
import type { ProviderResultItem, QueryResult } from "@query402/shared";
import { getProviderById } from "../lib/pricing.js";
import { fetchGroqItems } from "../lib/groq.js";

function buildSearchItems(query: string): ProviderResultItem[] {
  const now = new Date().toISOString().slice(0, 10);
  return [
    {
      title: `Stellar x402 update digest (${now})`,
      url: "https://developers.stellar.org",
      snippet: `Top ecosystem updates for: ${query}`,
      score: 0.92
    },
    {
      title: "x402 protocol foundation docs",
      url: "https://github.com/x402-foundation/x402",
      snippet: "Core protocol references, client/server patterns, and examples.",
      score: 0.89
    },
    {
      title: "Agent payments and usage-based API access",
      url: "https://stellar.org/blog",
      snippet: "How micropayments unlock per-request access for AI agents.",
      score: 0.83
    }
  ];
}

export async function runSearchProvider(query: string, providerId: string): Promise<QueryResult> {
  const provider = getProviderById(providerId);
  if (!provider || provider.category !== "search") {
    throw new Error(`Unknown search provider: ${providerId}`);
  }

  const latencyMs = Math.max(120, provider.latencyEstimateMs - 120 + Math.floor(Math.random() * 250));
  await new Promise((resolve) => setTimeout(resolve, Math.min(1700, latencyMs)));

  let items = buildSearchItems(query);
  let source = provider.sourceType;
  try {
    const groqItems = await fetchGroqItems("search", query);
    if (groqItems && groqItems.length > 0) {
      items = groqItems;
      source = "real";
    }
  } catch {
    source = provider.sourceType;
  }

  return {
    mode: "search",
    providerId: provider.id,
    providerName: provider.name,
    priceUsd: provider.priceUsd,
    latencyMs,
    timestamp: new Date().toISOString(),
    traceId: `trace_${nanoid(12)}`,
    items,
    raw: {
      source,
      query,
      rankingProfile: provider.id.includes("pro") ? "semantic_pro" : "fast_basic"
    }
  };
}
