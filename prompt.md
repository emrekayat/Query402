Query402 — VS Code Chat Full Prompt
Copy the prompt below and paste it directly into VS Code Chat / Cursor Chat.


"You are a senior full-stack engineer, Stellar/x402 integration engineer, and hackathon MVP architect.
 
I want you to build a complete hackathon-ready project called **Query402**.
 
Do not ask me clarifying questions.
Make sensible defaults.
Prioritize a working, demoable MVP over perfection.
Write production-style but practical code.
If a package API has changed, adapt to the latest installed version while preserving the intended architecture.
 
==================================================
PROJECT GOAL
==================================================
 
Build **Query402**:
An agentic pay-per-query search / news / scrape hub on **Stellar testnet** using **x402**.
 
Core idea:
- Agents should not need monthly subscriptions.
- They should be able to buy search, news, and scraping results **per request**.
- The app should compare providers, show prices, trigger x402 payment, and return results.
- The project must clearly demonstrate:
  1. real x402 payment flow,
  2. real Stellar testnet interaction,
  3. useful agent/product UX,
  4. hackathon-friendly demo clarity.
 
This is for a hackathon, so the app must be:
- clear,
- impressive,
- easy to run,
- easy to demo in 2–3 minutes,
- open-source friendly,
- well documented.
 
==================================================
PRODUCT VISION
==================================================
 
Query402 is a marketplace-style paid-query router for agents.
 
A user or agent can:
- search the web,
- fetch recent news,
- run a structured scrape,
- compare providers by price / latency / quality score,
- pay only for the chosen request,
- get the result,
- see an audit trail of what was bought and how much it cost.
 
The app should feel like:
“Agentic internet access with usage-based payments on Stellar.”
 
==================================================
NON-NEGOTIABLE MVP REQUIREMENTS
==================================================
 
Build a full working monorepo with:
 
1) **Backend API**
   - TypeScript
   - Node.js
   - Express
   - x402 payment middleware for protected routes
   - Stellar testnet support
   - provider abstraction layer
   - request logging
   - payment/usage history
 
2) **Frontend Web App**
   - React + TypeScript
   - clean hackathon UI
   - dashboard for:
     - query input
     - provider cards
     - pricing display
     - result display
     - usage history
     - total spend metrics
   - should look polished enough for demo recording
 
3) **Agent / Demo Client**
   - A Node.js TypeScript client that performs paid requests end-to-end using x402
   - This must be reliable for demo day
   - Should support:
     - search request
     - news request
     - scrape request
   - Must print payment + result output clearly
 
4) **README**
   - full setup
   - architecture
   - env vars
   - demo flow
   - what is mocked vs real
   - how Stellar/x402 is used
   - hackathon submission notes
 
5) **Environment setup**
   - `.env.example`
   - clear config for:
     - Stellar testnet network
     - RPC URL
     - facilitator URL
     - seller wallet
     - demo client secret
     - optional real provider API keys
 
==================================================
TECHNICAL DIRECTION
==================================================
 
Use a monorepo with npm workspaces.
 
Suggested structure:
 
/
  package.json
  README.md
  .gitignore
  .env.example
  /apps
    /api
    /web
    /agent-client
  /packages
    /shared
 
Use TypeScript everywhere.
 
==================================================
STACK CHOICES
==================================================
 
Backend:
- Node.js
- Express
- TypeScript
- zod for validation
- pino or another clean logger
- simple JSON or file-based persistence for MVP, OR lightweight SQLite if that is faster and cleaner
- x402 server-side integration
 
Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- simple, elegant UI
- no overengineering
 
Agent client:
- Node.js
- TypeScript
- x402 fetch client flow
- clear CLI commands
 
==================================================
x402 / STELLAR IMPLEMENTATION REQUIREMENTS
==================================================
 
Follow the current Stellar x402 quickstart patterns conceptually.
 
Use the current Stellar x402 packages / equivalent current package names if APIs changed.
 
Build the protected paid API routes using the x402 middleware approach.
 
Must support:
- `stellar:testnet`
- USDC-denominated pricing
- facilitator-based verification/settlement
- protected paid endpoints
 
Facilitator URL should be configurable through env.
Support these patterns cleanly:
- default facilitator URL from env
- easy switch between facilitator providers
- no hardcoded secrets
 
Implement real x402-protected routes like:
 
- GET /x402/search?q=...&provider=...
- GET /x402/news?q=...&provider=...
- GET /x402/scrape?url=...&provider=...
 
Each protected route should:
- have a price,
- require x402 payment,
- return useful JSON data,
- log usage,
- store metadata for demo analytics.
 
==================================================
BUSINESS / PRODUCT LOGIC
==================================================
 
The app must support at least 3 provider categories:
 
1) Search providers
2) News providers
3) Scrape providers
 
Create a provider abstraction system.
 
Each provider should have:
- id
- name
- category
- price
- description
- latency estimate
- quality score
- source type (`mock` or `real`)
- enabled flag
 
For the MVP:
- implement robust mock providers so the app always works without external API keys
- optionally support real providers if env keys exist
 
Suggested provider examples:
- search.basic
- search.pro
- news.fast
- news.deep
- scrape.page
- scrape.extract
 
Each provider should return structured results.
 
==================================================
PAYMENT MODEL
==================================================
 
Use simple per-request pricing.
 
Example pricing:
- search.basic = $0.01
- search.pro = $0.02
- news.fast = $0.015
- news.deep = $0.03
- scrape.page = $0.02
- scrape.extract = $0.04
 
Prices should be configurable in one place.
 
Frontend should show:
- selected provider price
- estimated total
- historical spend
- category spend breakdown
 
==================================================
FRONTEND UX REQUIREMENTS
==================================================
 
The web UI should include:
 
1) **Landing / header**
   - What Query402 is
   - “Pay-per-query internet access for agents on Stellar”
 
2) **Query workspace**
   - mode switch:
     - search
     - news
     - scrape
   - query input or URL input
   - provider list/cards
   - price badges
   - quality / latency badges
   - “Run paid query” button
 
3) **Results panel**
   - structured results
   - provider used
   - price paid
   - timestamp
   - latency
   - trace info
 
4) **Usage / analytics panel**
   - total queries
   - total spend
   - spend by category
   - recent transactions
   - recent paid requests
 
5) **Demo mode**
   - a simple toggle or clearly labeled mode that uses the backend demo agent wallet
   - this is important so the web UI can run a deterministic demo even without a browser wallet flow
 
Important:
- Do NOT block the MVP on browser wallet UX.
- The most important thing is a working end-to-end paid flow.
- Make the UI polished enough for a hackathon demo video.
 
==================================================
DEMO STRATEGY REQUIREMENTS
==================================================
 
Design the project so the demo can be shown in 2–3 minutes.
 
The intended demo flow should be:
 
1) Open Query402 dashboard
2) Type a research query like:
   “latest stellar x402 updates”
3) Compare providers and prices
4) Click run
5) App triggers a real paid request using demo agent mode
6) Response comes back with search/news/scrape results
7) Show that payment happened
8) Show usage analytics and spend history
9) Show a CLI agent example making another paid request
10) Show README and architecture briefly
 
Build the project around this exact demoability.
 
==================================================
BACKEND DETAILED REQUIREMENTS
==================================================
 
In `/apps/api` build:
 
- Express app
- health route
- provider catalog route
- unprotected metadata routes
- x402 protected routes
- usage history route
- analytics route
 
Suggested routes:
 
Public:
- GET /health
- GET /api/providers
- GET /api/catalog
- GET /api/usage
- GET /api/analytics
 
Protected:
- GET /x402/search
- GET /x402/news
- GET /x402/scrape
 
Optional convenience demo route:
- POST /api/demo/run
  - accepts payload
  - uses a configured demo client wallet on the server side
  - performs an x402-paid request internally
  - returns result + payment metadata
This is allowed for demo convenience and should be clearly documented as demo mode.
 
Create a clean provider service layer:
- `providers/search.ts`
- `providers/news.ts`
- `providers/scrape.ts`
 
Create a clean x402 integration layer:
- `lib/x402.ts`
- `lib/stellar.ts`
- `lib/pricing.ts`
 
Create a persistence layer:
- save usage events
- save payment attempts
- save result metadata
- simple and hackathon-friendly
 
==================================================
AGENT CLIENT REQUIREMENTS
==================================================
 
In `/apps/agent-client` build a CLI app with commands like:
 
- npm run cli -- search "latest soroban updates"
- npm run cli -- news "stablecoin micropayments"
- npm run cli -- scrape "https://example.com"
 
The CLI should:
- call the protected API
- execute the x402 payment flow
- print:
  - endpoint
  - provider
  - price
  - payment status
  - response data summary
 
Add at least one scripted command:
- `npm run demo`
that runs a full end-to-end showcase automatically.
 
==================================================
MOCK VS REAL PROVIDERS
==================================================
 
Important:
The project must work even if no third-party API keys are provided.
 
Therefore:
- implement realistic mock providers first
- add optional real adapters only if fast and clean
 
If API keys are present, support optional integrations such as:
- Brave Search
- SerpAPI
- NewsAPI
- a simple scraping provider using fetch + HTML parsing
 
But the MVP must remain fully functional without any external API.
 
==================================================
ARCHITECTURE QUALITY
==================================================
 
I want clean code.
 
Please implement:
- proper folder structure
- shared types
- input validation
- error handling
- loading states
- reusable utilities
- comments where helpful
- no giant files if possible
 
Do not overbuild:
- no auth system
- no database migrations if unnecessary
- no Kubernetes or Docker unless extremely lightweight and helpful
- no blockchain smart contract unless absolutely necessary
- focus on x402 integration and product polish
 
==================================================
DESIGN LANGUAGE
==================================================
 
Use a clean modern dark UI.
It should feel:
- technical
- premium
- agent-native
- fintech / infra style
 
Suggested feel:
- dark panels
- subtle gradients
- small metric cards
- compact provider cards
- clear money labels
- clean monospace details for payment traces
 
==================================================
README REQUIREMENTS
==================================================
 
Write a very good README with:
 
1) Project summary
2) Why this matters
3) Why Stellar + x402
4) Features
5) Architecture overview
6) Monorepo structure
7) Setup instructions
8) Environment variables
9) How to fund wallets on testnet
10) How to run backend
11) How to run frontend
12) How to run agent client
13) Demo flow
14) What is mocked
15) Future improvements
16) Hackathon submission checklist
 
Also include:
- a short “What judges should notice” section
- a short “Real Stellar interaction” section
- a short “Open-source disclosure” section
 
==================================================
ENVIRONMENT VARIABLES
==================================================
 
Create `.env.example` with something like:
 
STELLAR_NETWORK=stellar:testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
X402_FACILITATOR_URL=
X402_PAY_TO_ADDRESS=
DEMO_CLIENT_SECRET_KEY=
DEMO_CLIENT_PUBLIC_KEY=
PORT_API=3001
PORT_WEB=5173
 
# optional provider keys
BRAVE_API_KEY=
SERPAPI_API_KEY=
NEWS_API_KEY=
 
If current x402 package setup needs additional env vars, include them too.
 
==================================================
DELIVERABLES I EXPECT FROM YOU
==================================================
 
I want you to generate the actual project code, not just a plan.
 
Please do the following in order:
 
STEP 1:
Create the monorepo structure and base package files.
 
STEP 2:
Build the backend API with provider catalog, x402 integration, and usage logging.
 
STEP 3:
Build the agent client CLI and make sure it can run end-to-end.
 
STEP 4:
Build the frontend UI and connect it to the backend.
 
STEP 5:
Write the README and `.env.example`.
 
STEP 6:
Give me exact terminal commands to install and run everything.
 
==================================================
IMPORTANT IMPLEMENTATION RULES
==================================================
 
- Do not leave placeholders unless unavoidable.
- If something must be mocked, mock it properly and document it clearly.
- Do not say “you can implement later” unless absolutely necessary.
- Prefer working code over theoretical architecture.
- Keep the MVP strong, focused, and shippable.
- Make the code understandable for a hackathon team.
- Make sure the project tells a compelling story:
  “Agents can buy internet access per request on Stellar.”
 
==================================================
SUCCESS CRITERIA
==================================================
 
The project is successful if, after setup, I can:
 
1) start the API
2) start the frontend
3) run the agent client
4) trigger a paid query
5) receive structured results
6) see usage/spend analytics
7) explain the product to judges in under 30 seconds
 
==================================================
AT THE END OF YOUR WORK
==================================================
 
When you finish generating the code, also give me:
 
1) a short architecture summary
2) a file tree
3) exact run commands
4) a short demo script for a 2-minute video
5) the top 5 judge-facing selling points
 
Now start implementing the project."



----




Important execution rule:
Do not try to perfect everything in one pass.
First, build only:
1) monorepo structure
2) backend API
3) agent client

Do not build the frontend until backend and CLI run successfully.
Output full files, not outlines.
After generating code, give exact install and run commands.
