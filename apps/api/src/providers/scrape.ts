import { nanoid } from "nanoid";
import type { ProviderResultItem, QueryResult } from "@query402/shared";
import { getProviderById } from "../lib/pricing.js";
import { fetchGroqItems } from "../lib/groq.js";

function buildScrapeItems(targetUrl: string): ProviderResultItem[] {
  const hostname = (() => {
    try {
      return new URL(targetUrl).hostname.replace(/^www\./, "");
    } catch {
      return "target site";
    }
  })();

  return [
    {
      title: "Page title",
      url: targetUrl,
      snippet: `Structured summary extracted from ${hostname}.`,
      score: 0.88
    },
    {
      title: "Key entities",
      url: `${targetUrl}#entities`,
      snippet: `Main entities and concepts identified on ${hostname}.`,
      score: 0.84
    },
    {
      title: "Actionable insights",
      url: `${targetUrl}#insights`,
      snippet: `Actionable takeaways and implementation notes from ${hostname}.`,
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

  let items = buildScrapeItems(targetUrl);
  let source = provider.sourceType;
  try {
    const groqItems = await fetchGroqItems("scrape", targetUrl);
    if (groqItems && groqItems.length > 0) {
      items = groqItems;
      source = "real";
    }
  } catch {
    source = provider.sourceType;
  }

  return {
    mode: "scrape",
    providerId: provider.id,
    providerName: provider.name,
    priceUsd: provider.priceUsd,
    latencyMs,
    timestamp: new Date().toISOString(),
    traceId: `trace_${nanoid(12)}`,
    items,
    raw: {
      source,
      url: targetUrl,
      extractionDepth: provider.id.includes("extract") ? "structured" : "surface"
    }
  };
}
