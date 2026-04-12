# Query402

Agentic pay-per-query internet access on Stellar with x402.

Query402 is a hackathon-ready marketplace-style router where agents can buy `search`, `news`, and `scrape` results per request instead of paying monthly subscriptions.

## Why this matters

- Agents should pay for exactly what they use.
- Providers can monetize API access per query.
- x402 + Stellar testnet enables programmable micropayment rails.
- Demo story is clear: **compare providers → pay per request → get results → view spend analytics**.

## Why Stellar + x402

- `x402` provides payment-required API patterns for paid HTTP routes.
- `stellar:testnet` provides low-friction testing with programmable token payments.
- Facilitator-based verification/settlement patterns are represented in the backend integration.

## Features (Phase 1–4)

- TypeScript monorepo with npm workspaces.
- Express API with provider catalog and protected paid routes.
- Provider abstraction for `search`, `news`, `scrape`.
- Configurable per-request pricing.
- Usage + payment persistence in JSON (`apps/api/data/db.json`).
- Analytics endpoint for total spend and category breakdown.
- Agent CLI with commands for search/news/scrape.
- Deterministic `DEMO_MODE` fallback for hackathon reliability.
- Premium dark React dashboard with provider comparison, paid query workspace, results, and spend analytics.

## Architecture overview

- `apps/api`
  - Public routes: `/health`, `/api/providers`, `/api/catalog`, `/api/usage`, `/api/analytics`
  - Protected routes: `/x402/search`, `/x402/news`, `/x402/scrape`
  - Demo convenience route: `POST /api/demo/run`
  - x402 integration in `src/lib/x402.ts`
  - Stellar config in `src/lib/stellar.ts`
  - Pricing in `src/lib/pricing.ts`
  - Persistence in `src/lib/persistence.ts`
- `apps/agent-client`
  - CLI commands for paid requests (`search`, `news`, `scrape`)
  - Demo script (`npm run demo --workspace @query402/agent-client`)
- `apps/web`
  - React + TypeScript + Vite + Tailwind frontend
  - Query workspace, provider cards, demo toggle, result panel
  - Usage and spend analytics dashboard
- `packages/shared`
  - Shared Zod schemas and types used by API + client

## Monorepo structure

```text
.
├─ apps/
│  ├─ api/
│  └─ agent-client/
│  └─ web/
├─ packages/
│  └─ shared/
├─ .env.example
├─ package.json
├─ tsconfig.base.json
└─ README.md
```

## Environment variables

Copy `.env.example` to `.env` and fill values:

- `STELLAR_NETWORK` (default: `stellar:testnet`)
- `STELLAR_RPC_URL`
- `X402_FACILITATOR_URL`
- `X402_PAY_TO_ADDRESS`
- `DEMO_CLIENT_SECRET_KEY`
- `DEMO_CLIENT_PUBLIC_KEY`
- `PORT_API`
- `API_BASE_URL`
- `VITE_API_BASE_URL`
- `DEMO_MODE` (`true` for deterministic demo reliability)
- Optional keys: `BRAVE_API_KEY`, `SERPAPI_API_KEY`, `NEWS_API_KEY`

## How to fund wallets on testnet

1. Generate Stellar keypairs for payer and seller.
2. Fund with Friendbot (testnet XLM).
3. Add USDC testnet trustline for relevant accounts.
4. Fund testnet USDC from Circle faucet.

## Setup

```bash
npm install
npm run typecheck
npm run build
```

## Run backend API

```bash
npm run dev:api
```

## Run frontend dashboard

```bash
npm run dev:web
```

Open: `http://localhost:5173`

Or production build:

```bash
npm run start:api
```

## Run agent client

Search:

```bash
npm run cli -- search "latest soroban updates" --provider search.basic
```

News:

```bash
npm run cli -- news "stablecoin micropayments" --provider news.fast
```

Scrape:

```bash
npm run cli -- scrape "https://developers.stellar.org" --provider scrape.page
```

Full CLI showcase:

```bash
npm run demo:agent
```

Real payment validation (`DEMO_MODE=false`):

```bash
npm run validate:real
```

If this passes, output includes payment proof fields (`payment-response`, trace id, provider, price).

## Real payment validation playbook

1. Set `DEMO_MODE=false` in `.env`.
2. Fill real funded keys (not placeholders):
  - `DEMO_CLIENT_SECRET_KEY`
  - `DEMO_CLIENT_PUBLIC_KEY`
  - `X402_PAY_TO_ADDRESS`
  - `X402_FACILITATOR_API_KEY` (for `channels.openzeppelin.com` facilitator)
3. If needed, create facilitator key: `https://channels.openzeppelin.com/testnet/gen`
4. Ensure API is running (`npm run dev:api`).
5. Run `npm run validate:real`.
6. Keep CLI output as judge proof screenshot/log.

Notes:
- Script checks API health and facilitator `/supported` reachability before payment attempt.
- If facilitator/wallet funding is not ready, the script fails fast with explicit reason.

## Demo flow (2–3 minutes)

1. Start API and Web.
2. Dashboard’da provider kartlarını ve fiyatları göster.
3. Search mode’da “Run paid query” tetikle.
4. Result panelinde payment trace + structured sonuçları göster.
5. Usage panelinde spend breakdown’u anlat.
6. CLI demo ile ikinci kanal doğrulaması yap.

## What is mocked vs real

- Mocked provider content: yes (deterministic structured data).
- Real x402 middleware integration: yes (`@x402/express`, `@x402/core`, `@x402/stellar`).
- Real Stellar payment execution: supported when `DEMO_MODE=false` and facilitator + funded wallets are reachable.
- Hackathon reliability fallback: `DEMO_MODE=true` returns proper 402 semantics and deterministic paid retry behavior.

## Real Stellar interaction

- Network config uses `stellar:testnet` + Soroban RPC URL.
- Client and server include Stellar x402 scheme integration (`@x402/stellar`).
- Facilitator URL is fully environment-driven.
- `npm run validate:real` provides a reproducible real-payment validation path for demo day.

## What judges should notice

- Clear pay-per-request UX for agent internet access.
- End-to-end paid route flow with auditable usage and spend.
- Provider comparison model with price/latency/quality metadata.
- Practical monorepo architecture that can be extended quickly.
- Demo reliability without sacrificing real integration paths.

## Open-source disclosure

- No proprietary provider APIs required for baseline demo.
- Optional provider adapters can be added via env keys.
- Demo mode is explicitly documented for hackathon determinism.

## Future improvements

- Add frontend dashboard (`apps/web`) with polished dark UI.
- Add real provider adapters (Brave, SerpAPI, NewsAPI, HTML extraction).
- Add richer payment metadata parsing from payment headers.
- Add SQLite persistence for more advanced analytics queries.
- Add integration tests with a reachable facilitator in CI.

## Hackathon submission checklist

- [x] Monorepo setup
- [x] Backend API with paid routes
- [x] Agent CLI paid requests
- [x] Usage + spend analytics
- [x] Env + setup docs
- [x] Frontend dashboard
