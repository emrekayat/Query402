import { runPaidQuery } from "./client.js";

async function demo() {
  const steps = [
    {
      mode: "search" as const,
      provider: "search.pro",
      query: "latest stellar x402 updates"
    },
    {
      mode: "news" as const,
      provider: "news.deep",
      query: "stablecoin micropayments"
    },
    {
      mode: "scrape" as const,
      provider: "scrape.extract",
      url: "https://developers.stellar.org"
    }
  ];

  for (const step of steps) {
    console.log(`\n--- Running ${step.mode} with ${step.provider} ---`);
    const response = await runPaidQuery(step);
    console.log(`Status: ${response.status}`);
    console.log(`Endpoint: ${response.endpoint}`);
    console.log(`Payment response: ${response.paymentResponse ?? "<none>"}`);
    const payload = response.body as any;
    console.log(`Price: $${payload?.result?.priceUsd ?? "n/a"}`);
    console.log(`Items: ${payload?.result?.items?.length ?? 0}`);
  }

  console.log("\nDemo complete. Inspect /api/analytics in the backend for updated spend history.");
}

demo().catch((error) => {
  console.error("Demo failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
