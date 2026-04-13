import { nanoid } from "nanoid";
import type { ProviderResultItem, QueryResult } from "@query402/shared";
import { getProviderById } from "../lib/pricing.js";
import { fetchGroqItems } from "../lib/groq.js";

function buildNewsItems(query: string): ProviderResultItem[] {
  return [
    {
      title: `Breaking: ${query} market impact analysis`,
      url: "https://news.example.com/stellar-market",
      snippet: "Market reaction and protocol activity from the last 24h.",
      score: 0.9
    },
    {
      title: "Stellar ecosystem funding and builder updates",
      url: "https://news.example.com/stellar-ecosystem",
      snippet: "New integrations, tooling releases, and community milestones.",
      score: 0.86
    },
    {
      title: "Micropayment APIs for AI agents",
      url: "https://news.example.com/agent-payments",
      snippet: "How pay-per-query infra changes agent product economics.",
      score: 0.82
    }
  ];
}

export async function runNewsProvider(query: string, providerId: string): Promise<QueryResult> {
  const provider = getProviderById(providerId);
  if (!provider || provider.category !== "news") {
    throw new Error(`Unknown news provider: ${providerId}`);
  }

  const latencyMs = Math.max(180, provider.latencyEstimateMs - 90 + Math.floor(Math.random() * 350));
  await new Promise((resolve) => setTimeout(resolve, Math.min(2000, latencyMs)));

  let items = buildNewsItems(query);
  let source = provider.sourceType;
  try {
    const groqItems = await fetchGroqItems("news", query);
    if (groqItems && groqItems.length > 0) {
      items = groqItems;
      source = "real";
    }
  } catch {
    source = provider.sourceType;
  }

  return {
    mode: "news",
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
      freshnessWindow: provider.id.includes("deep") ? "72h contextual" : "12h fast"
    }
  };
}
