import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { nanoid } from "nanoid";
import { config } from "./config.js";

export async function runDemoPaidRequest(input: {
  mode: "search" | "news" | "scrape";
  query?: string;
  url?: string;
  provider: string;
}) {
  const params = new URLSearchParams({ provider: input.provider });

  if (input.mode === "scrape") {
    if (!input.url) {
      throw new Error("url is required for scrape mode");
    }
    params.set("url", input.url);
  } else {
    if (!input.query) {
      throw new Error("query is required for search/news mode");
    }
    params.set("q", input.query);
  }

  const endpoint = `${config.API_BASE_URL}/x402/${input.mode}?${params.toString()}`;
  const response = config.demoMode
    ? await fetch(endpoint, {
        headers: {
          "x-query402-demo-paid": "true",
          "payment-response": `demo_tx_${nanoid(10)}`,
          "x-demo-payer": config.DEMO_CLIENT_PUBLIC_KEY ?? "demo-agent"
        }
      })
    : await (async () => {
        if (!config.DEMO_CLIENT_SECRET_KEY) {
          throw new Error("DEMO_CLIENT_SECRET_KEY is not configured");
        }

        const signer = createEd25519Signer(
          config.DEMO_CLIENT_SECRET_KEY,
          config.STELLAR_NETWORK as `${string}:${string}`
        );

        const client = new x402Client().register(
          "stellar:*",
          new ExactStellarScheme(signer, { url: config.STELLAR_RPC_URL })
        );

        const fetchWithPayment = wrapFetchWithPayment(fetch, client);
        return fetchWithPayment(endpoint);
      })();

  const payload = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    endpoint,
    paymentResponseHeader: response.headers.get("payment-response") ?? null,
    payload
  };
}
