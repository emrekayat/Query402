import { z } from "zod";
import type { ProviderResultItem, QueryMode } from "@query402/shared";
import { config } from "./config.js";

const groqItemsSchema = z.array(
  z.object({
    title: z.string().min(1),
    url: z.string().url(),
    snippet: z.string().min(1),
    score: z.number().min(0).max(1)
  })
);

function parseItemsFromContent(content: string) {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new Error("Groq response was not valid JSON");
  }

  const direct = groqItemsSchema.safeParse(parsedJson);
  if (direct.success) {
    return direct.data;
  }

  const wrapped = z.object({ items: groqItemsSchema }).safeParse(parsedJson);
  if (wrapped.success) {
    return wrapped.data.items;
  }

  throw new Error("Groq response JSON shape is invalid");
}

function buildPrompt(mode: QueryMode, query: string): string {
  if (mode === "scrape") {
    return [
      `Target URL: ${query}`,
      "Extract key information from this page and return 3 JSON items only.",
      "Use this shape for each item: title, url, snippet, score.",
      "Prefer: page summary, key entities/topics, practical insights.",
      "URLs should be the target URL or same-site anchors when relevant.",
      "No markdown, no explanations, JSON only."
    ].join("\n");
  }

  const modeLabel = mode === "news" ? "news" : "search";
  return [
    `User query: ${query}`,
    `Return 3 high quality ${modeLabel} results as JSON only.`,
    "Each item must include: title, url, snippet, score.",
    "Use valid https URLs and concise snippets.",
    "No markdown, no explanations, JSON only."
  ].join("\n");
}

export async function fetchGroqItems(mode: QueryMode, query: string): Promise<ProviderResultItem[] | null> {
  if (!config.GROQ_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: config.groqModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a retrieval assistant. Always return strict JSON only. Keep claims cautious and avoid fabricated certainty."
        },
        {
          role: "user",
          content: buildPrompt(mode, query)
        }
      ]
    })
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${payload}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.length === 0) {
    throw new Error("Groq response did not include text content");
  }

  return parseItemsFromContent(content).slice(0, 3);
}
