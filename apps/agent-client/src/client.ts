import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { nanoid } from "nanoid";
import { config } from "./config.js";

export async function runPaidQuery(input: {
  mode: "search" | "news" | "scrape";
  provider: string;
  query?: string;
  url?: string;
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
  const isDemoMode = config.DEMO_MODE === "true";

  const response = isDemoMode
    ? await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-query402-demo-paid": "true",
          "payment-response": `demo_tx_${nanoid(10)}`
        }
      })
    : await (async () => {
        if (!config.DEMO_CLIENT_SECRET_KEY) {
          throw new Error("DEMO_CLIENT_SECRET_KEY is required when DEMO_MODE is false");
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
        return fetchWithPayment(endpoint, { method: "GET" });
      })();

  const json = await response.json();

  return {
    endpoint,
    status: response.status,
    ok: response.ok,
    paymentResponse: response.headers.get("payment-response"),
    body: json
  };
}
