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

## Features (Phase 1–3)

- TypeScript monorepo with npm workspaces.
- Express API with provider catalog and protected paid routes.
- Provider abstraction for `search`, `news`, `scrape`.
- Configurable per-request pricing.
- Usage + payment persistence in JSON (`apps/api/data/db.json`).
- Analytics endpoint for total spend and category breakdown.
- Agent CLI with commands for search/news/scrape.
- Deterministic `DEMO_MODE` fallback for hackathon reliability.

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
- `packages/shared`
  - Shared Zod schemas and types used by API + client

## Monorepo structure

```text
.
├─ apps/
│  ├─ api/
│  └─ agent-client/
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

## Demo flow (2–3 minutes)

1. Start API.
2. Show provider catalog at `/api/providers`.
3. Trigger one paid CLI search request.
4. Show response payload with provider, price, trace.
5. Open `/api/analytics` and show spend totals + breakdown.
6. Run CLI demo script for search/news/scrape sequence.

## What is mocked vs real

- Mocked provider content: yes (deterministic structured data).
- Real x402 middleware integration: yes (`@x402/express`, `@x402/core`, `@x402/stellar`).
- Real Stellar payment execution: supported when `DEMO_MODE=false` and facilitator + funded wallets are reachable.
- Hackathon reliability fallback: `DEMO_MODE=true` returns proper 402 semantics and deterministic paid retry behavior.

## Real Stellar interaction

- Network config uses `stellar:testnet` + Soroban RPC URL.
- Client and server include Stellar x402 scheme integration (`@x402/stellar`).
- Facilitator URL is fully environment-driven.

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
- [ ] Frontend dashboard (next phase)
