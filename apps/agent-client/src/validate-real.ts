import { config } from "./config.js";
import { runPaidQuery } from "./client.js";

function hasPlaceholder(value?: string) {
  if (!value) {
    return true;
  }
  return value.includes("XXXXXXXX") || value.includes("GXXXX") || value.includes("SXXXX");
}

async function checkFacilitator(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const facilitatorHeaders =
      config.X402_FACILITATOR_API_KEY && config.X402_FACILITATOR_API_KEY.length > 0
        ? { Authorization: `Bearer ${config.X402_FACILITATOR_API_KEY}` }
        : undefined;

    const response = await fetch(`${url.replace(/\/$/, "")}/supported`, {
      signal: controller.signal,
      headers: facilitatorHeaders
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { ok: false, status: response.status, body: await response.text() };
    }

    const json = await response.json();
    return { ok: true, status: response.status, body: json };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: error instanceof Error ? `${error.message}. Check DNS/network or URL.` : String(error)
    };
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkApiHealth() {
  try {
    const response = await fetchWithTimeout(`${config.API_BASE_URL}/health`, {}, 20000);
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`API is not reachable at ${config.API_BASE_URL}. Details: ${message}`);
  }
}

async function main() {
  console.log("\n=== Query402 Real Payment Validation ===");
  console.log(`API: ${config.API_BASE_URL}`);
  console.log(`Network: ${config.STELLAR_NETWORK}`);
  console.log(`Facilitator: ${config.X402_FACILITATOR_URL}`);

  if (config.DEMO_MODE === "true") {
    throw new Error("DEMO_MODE=true. Real payment validation requires DEMO_MODE=false.");
  }

  if (hasPlaceholder(config.DEMO_CLIENT_SECRET_KEY)) {
    throw new Error("DEMO_CLIENT_SECRET_KEY is missing or placeholder. Use a funded real secret key.");
  }

  if (hasPlaceholder(config.DEMO_CLIENT_PUBLIC_KEY)) {
    console.warn("[warn] DEMO_CLIENT_PUBLIC_KEY seems placeholder; continuing (optional for client flow).\n");
  }

  if (hasPlaceholder(config.X402_PAY_TO_ADDRESS)) {
    throw new Error("X402_PAY_TO_ADDRESS is missing or placeholder. Set a funded seller/public receiving address.");
  }

  if (config.X402_FACILITATOR_URL.includes("channels.openzeppelin.com") && !config.X402_FACILITATOR_API_KEY) {
    throw new Error(
      "X402_FACILITATOR_API_KEY is required for OpenZeppelin facilitator. Generate one from https://channels.openzeppelin.com/testnet/gen"
    );
  }

  console.log("[step] Checking API health...");
  await checkApiHealth();
  console.log("[ok] API health check passed.");

  console.log("[step] Checking facilitator /supported...");
  const facilitator = await checkFacilitator(config.X402_FACILITATOR_URL);
  if (!facilitator.ok) {
    throw new Error(`Facilitator check failed (${facilitator.status}): ${String(facilitator.body)}`);
  }

  console.log("[ok] Facilitator reachable and returned /supported response.");

  console.log("[step] Executing real paid request...");
  const result = await runPaidQuery({
    mode: "search",
    provider: "search.basic",
    query: "latest stellar x402 updates"
  });

  if (!result.ok) {
    throw new Error(
      `Paid request failed with status ${result.status}. Response: ${JSON.stringify(result.body)}`
    );
  }

  const paymentHeader = result.paymentResponse ?? (result.body as any)?.payment?.paymentResponseHeader ?? null;

  console.log("\n--- Real payment proof ---");
  console.log(`Status: ${result.status}`);
  console.log(`Endpoint: ${result.endpoint}`);
  console.log(`Payment header: ${paymentHeader ?? "<none>"}`);
  console.log(`Trace ID: ${(result.body as any)?.result?.traceId ?? "n/a"}`);
  console.log(`Provider: ${(result.body as any)?.result?.providerId ?? "n/a"}`);
  console.log(`Price: ${(result.body as any)?.result?.priceUsd ?? "n/a"}`);

  if (!paymentHeader) {
    throw new Error("No payment proof header found. Check facilitator/wallet settlement path.");
  }

  console.log("\n✅ Real payment validation completed.");
}

main().catch((error) => {
  console.error("\n❌ Validation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
