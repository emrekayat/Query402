# Query402 Architecture

## 1) System summary

Query402 is a monorepo MVP that delivers **pay-per-query internet access for agents**.

Core layers:

- `apps/web`: operator dashboard and demo UI
- `apps/api`: catalog + paid endpoints + analytics
- `apps/agent-client`: CLI and real-payment validator
- `packages/shared`: shared schemas and contracts

Network/payment foundation:

- Stellar testnet (`stellar:testnet`)
- x402 middleware/client flow (`@x402/*`)
- facilitator-driven verification/settlement (`X402_FACILITATOR_URL`)

## 2) Monorepo component map

```text
Query402/
├─ apps/
│  ├─ api/
│  │  ├─ src/routes/
│  │  │  ├─ public.ts
│  │  │  ├─ protected.ts
│  │  │  └─ demo.ts
│  │  ├─ src/providers/
│  │  │  ├─ search.ts
│  │  │  ├─ news.ts
│  │  │  └─ scrape.ts
│  │  ├─ src/lib/
│  │  │  ├─ config.ts
│  │  │  ├─ x402.ts
│  │  │  ├─ stellar.ts
│  │  │  ├─ pricing.ts
│  │  │  └─ persistence.ts
│  │  └─ data/db.json
│  ├─ web/
│  │  └─ src/
│  │     ├─ App.tsx
│  │     ├─ styles.css
│  │     └─ types.ts
│  └─ agent-client/
│     └─ src/
│        ├─ cli.ts
│        ├─ client.ts
│        ├─ demo.ts
│        └─ validate-real.ts
└─ packages/shared/
   └─ src/
      ├─ types.ts
      ├─ schemas.ts
      └─ index.ts
```

## 3) Request/data flow

### A. Web-driven query flow

1. User selects mode (`search` / `news` / `scrape`) and provider in `apps/web`.
2. Web calls API catalog + paid route on `apps/api`.
3. Paid route is gated by x402 middleware (`src/lib/x402.ts`).
4. On payment success, provider service executes and returns structured payload.
5. API logs usage/payment metadata in `data/db.json`.
6. Web refreshes `/api/usage` and `/api/analytics` widgets.

### B. CLI-driven query flow

1. Operator runs `npm run cli -- ...` or `npm run validate:real`.
2. `apps/agent-client` requests protected endpoint.
3. x402 client flow signs/pays according to Stellar configuration.
4. API returns paid result + payment headers.
5. CLI prints provider, status, trace, and payment proof.

## 4) x402/Stellar payment sequence

1. Client requests `/x402/*` endpoint.
2. API responds with payment requirements if unpaid.
3. Client generates payment payload via x402 + facilitator.
4. Stellar testnet transfer execution/verification occurs.
5. Client retries request with payment header.
6. API authorizes route and returns paid data.
7. Usage + spend events persist for analytics.

Important runtime env:

- `STELLAR_NETWORK=stellar:testnet`
- `STELLAR_RPC_URL`
- `X402_FACILITATOR_URL`
- `X402_FACILITATOR_API_KEY` (for hosted facilitator setups)
- `X402_PAY_TO_ADDRESS`
- `DEMO_CLIENT_SECRET_KEY`, `DEMO_CLIENT_PUBLIC_KEY`
- `DEMO_MODE` (deterministic fallback toggle)

## 5) Provider and pricing model

Provider groups:

- Search: `search.basic`, `search.pro`
- News: `news.fast`, `news.deep`
- Scrape: `scrape.page`, `scrape.extract`

Provider contract includes:

- id, name, category, price, description
- latency estimate, quality score
- source type (`mock`/`real`) and enabled flag

Pricing is centralized in `apps/api/src/lib/pricing.ts`, and catalog endpoints expose rates to UI/CLI.

## 6) Persistence and analytics

Storage model (hackathon-first):

- JSON persistence in `apps/api/data/db.json`
- tracks usage events, payment attempts, and metadata

Analytics endpoints:

- `GET /api/usage`: latest paid requests/audit trail
- `GET /api/analytics`: totals and category spend breakdown

## 7) Demo reliability strategy

- Real mode: `DEMO_MODE=false` for actual x402/Stellar flow.
- Demo mode: `DEMO_MODE=true` to guarantee deterministic presentation path.
- Validation command: `npm run validate:real --workspace @query402/agent-client`.

This dual-path strategy keeps the demo resilient while preserving real-payment credibility.

## 8) Trade-offs and next improvements

Current MVP trade-offs:

- JSON persistence instead of SQL for speed and clarity.
- Mock-first providers to avoid external API fragility.
- No user auth (out of scope for hackathon focus).

Natural next steps:

- Add SQLite + richer analytics queries
- Expand real provider adapters
- Add integration tests for facilitator/network checks
- Add optional browser wallet UX (while retaining demo mode)