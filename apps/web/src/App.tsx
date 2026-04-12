import { useEffect, useMemo, useState } from "react";
import type { ProviderDefinition, QueryMode } from "@query402/shared";
import { Activity, CircleDollarSign, FlaskConical, Gauge, Radar, ReceiptText, Sparkles, TerminalSquare } from "lucide-react";
import type { AnalyticsResponse, PaidQueryResponse } from "./types.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const modeLabels: Record<QueryMode, string> = {
  search: "Search",
  news: "News",
  scrape: "Scrape"
};

const modeDefaultProvider: Record<QueryMode, string> = {
  search: "search.basic",
  news: "news.fast",
  scrape: "scrape.page"
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

function money(value: number) {
  return `$${value.toFixed(3)}`;
}

export default function App() {
  const [mode, setMode] = useState<QueryMode>("search");
  const [demoMode, setDemoMode] = useState(true);
  const [queryInput, setQueryInput] = useState("latest stellar x402 updates");
  const [urlInput, setUrlInput] = useState("https://developers.stellar.org");
  const [providers, setProviders] = useState<ProviderDefinition[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>(modeDefaultProvider.search);
  const [result, setResult] = useState<PaidQueryResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modeProviders = useMemo(
    () => providers.filter((provider) => provider.category === mode && provider.enabled),
    [providers, mode]
  );

  const selectedProviderDetails = useMemo(
    () => modeProviders.find((provider) => provider.id === selectedProvider),
    [modeProviders, selectedProvider]
  );

  const activeInput = mode === "scrape" ? urlInput : queryInput;

  async function refreshMetrics() {
    const data = await fetchJson<AnalyticsResponse>(`${API_BASE_URL}/api/analytics`);
    setAnalytics(data);
  }

  useEffect(() => {
    async function bootstrap() {
      const providersResponse = await fetchJson<{ providers: ProviderDefinition[] }>(`${API_BASE_URL}/api/providers`);
      setProviders(providersResponse.providers);
      setSelectedProvider(modeDefaultProvider.search);
      await refreshMetrics();
    }

    bootstrap().catch((bootstrapError) => {
      setError(bootstrapError instanceof Error ? bootstrapError.message : "Failed to load API data");
    });
  }, []);

  useEffect(() => {
    const first = modeProviders[0];
    if (first && !modeProviders.some((provider) => provider.id === selectedProvider)) {
      setSelectedProvider(first.id);
    }
  }, [modeProviders, selectedProvider]);

  async function runPaidQuery() {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        mode,
        provider: selectedProvider,
        query: mode === "scrape" ? undefined : queryInput,
        url: mode === "scrape" ? urlInput : undefined
      };

      let data: PaidQueryResponse;

      if (demoMode) {
        data = await fetchJson<PaidQueryResponse>(`${API_BASE_URL}/api/demo/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        const params = new URLSearchParams({ provider: selectedProvider });
        if (mode === "scrape") {
          params.set("url", urlInput);
        } else {
          params.set("q", queryInput);
        }

        data = await fetchJson<PaidQueryResponse>(`${API_BASE_URL}/x402/${mode}?${params.toString()}`);
      }

      setResult(data);
      await refreshMetrics();
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Query failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="q402-shell">
      <div className="q402-gridline" />
      <div className="q402-noise" />

      <header className="bridge">
        <div className="bridge-left lift-in">
          <p className="stamp">
            <Sparkles size={13} /> Query402 Control Deck
          </p>
          <h1>Agentic internet access, paid per request.</h1>
          <p className="subtitle">Stellar testnet üzerinde x402 akışıyla provider seç, query başına öde, izi anında denetle.</p>
        </div>

        <div className="bridge-right lift-in delay-1">
          <StatTile label="Queries" value={String(analytics?.totalQueries ?? 0)} icon={<Activity size={16} />} />
          <StatTile label="Spend" value={money(analytics?.totalSpendUsd ?? 0)} icon={<CircleDollarSign size={16} />} />
          <StatTile label="Search" value={money(analytics?.spendByCategory.search ?? 0)} icon={<Radar size={16} />} />
          <StatTile label="News" value={money(analytics?.spendByCategory.news ?? 0)} icon={<ReceiptText size={16} />} />
        </div>
      </header>

      <main className="dock">
        <section className="bay bay--left lift-in delay-2">
          <div className="bay-head">
            <h2>Query Bay</h2>
            <span>{modeLabels[mode]} mode</span>
          </div>

          <div className="mode-switch">
            {(Object.keys(modeLabels) as QueryMode[]).map((item) => (
              <button
                key={item}
                className={mode === item ? "mode-btn active" : "mode-btn"}
                onClick={() => setMode(item)}
                type="button"
              >
                {modeLabels[item]}
              </button>
            ))}
          </div>

          <div className="input-shell">
            <label>{mode === "scrape" ? "TARGET URL" : "RESEARCH QUERY"}</label>
            {mode === "scrape" ? (
              <input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="https://example.com" />
            ) : (
              <input value={queryInput} onChange={(event) => setQueryInput(event.target.value)} placeholder="latest stellar x402 updates" />
            )}

            <label className="demo-toggle">
              <span>
                <FlaskConical size={14} /> Demo mode
              </span>
              <input checked={demoMode} onChange={() => setDemoMode((prev) => !prev)} type="checkbox" />
            </label>
          </div>

          <div className="provider-strip">
            {modeProviders.map((provider, index) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={provider.id === selectedProvider ? "provider-card selected" : "provider-card"}
                style={{ animationDelay: `${index * 70}ms` }}
                type="button"
              >
                <p className="provider-name">{provider.name}</p>
                <p className="provider-desc">{provider.description}</p>
                <div className="provider-metrics">
                  <span>{money(provider.priceUsd)}</span>
                  <span>{provider.latencyEstimateMs}ms</span>
                  <span>Q{provider.qualityScore}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="action-row">
            <div>
              <p className="action-label">Provider lock</p>
              <p className="action-value">{selectedProviderDetails?.name ?? "Choose provider"}</p>
            </div>
            <button className="run-btn" onClick={runPaidQuery} disabled={isLoading || !selectedProvider} type="button">
              {isLoading ? "Executing..." : "Run paid query"}
              <TerminalSquare size={16} />
            </button>
          </div>

          {error ? <p className="error-box">{error}</p> : null}

          <div className="result-zone sweep">
            <div className="bay-head bay-head--compact">
              <h2>Signal Output</h2>
              <span>{result ? new Date(result.result.timestamp).toLocaleTimeString() : "waiting"}</span>
            </div>

            {!result ? (
              <p className="empty-note">Sonuç bekleniyor. Sol panelden query başlat.</p>
            ) : (
              <>
                <div className="result-meta">
                  <span>{result.result.providerName}</span>
                  <span>{money(result.result.priceUsd)}</span>
                  <span>{result.result.latencyMs}ms</span>
                  <span>{result.result.traceId.slice(0, 12)}</span>
                </div>

                <div className="trace-box">
                  <p>payment-response: {result.payment.paymentResponseHeader ?? "<none>"}</p>
                  <p>network: {result.payment.network}</p>
                </div>

                <div className="item-stack">
                  {result.result.items.map((item) => (
                    <article key={`${item.url}-${item.title}`}>
                      <h3>{item.title}</h3>
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.url}
                      </a>
                      <p>{item.snippet}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="bay bay--right lift-in delay-3">
          <div className="orbital">
            <div className="orbital-center">
              <Gauge size={20} />
              <p>{money(analytics?.totalSpendUsd ?? 0)}</p>
              <span>Total spend</span>
            </div>
          </div>

          <div className="analytics-panel">
            <h3>Spend by category</h3>
            <ul>
              <li>
                <span>Search</span>
                <strong>{money(analytics?.spendByCategory.search ?? 0)}</strong>
              </li>
              <li>
                <span>News</span>
                <strong>{money(analytics?.spendByCategory.news ?? 0)}</strong>
              </li>
              <li>
                <span>Scrape</span>
                <strong>{money(analytics?.spendByCategory.scrape ?? 0)}</strong>
              </li>
            </ul>
          </div>

          <div className="feed-panel">
            <h3>Recent transactions</h3>
            {(analytics?.recentTransactions ?? []).slice(0, 5).map((tx) => (
              <div key={tx.id} className="feed-row">
                <p>
                  <span>{tx.providerId}</span>
                  <strong>{money(tx.amountUsd)}</strong>
                </p>
                <small>{new Date(tx.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>

          <div className="feed-panel">
            <h3>Execution feed</h3>
            {(analytics?.recentUsage ?? []).slice(0, 5).map((usage) => (
              <div key={usage.id} className="feed-row">
                <p>
                  <span>
                    {usage.mode.toUpperCase()} · {usage.providerId}
                  </span>
                  <strong>{usage.latencyMs}ms</strong>
                </p>
                <small>
                  {money(usage.priceUsd)} · {new Date(usage.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>

          <div className="script-panel">
            <h3>Live payload preview</h3>
            <pre>{JSON.stringify({ mode, provider: selectedProvider, input: activeInput, demoMode }, null, 2)}</pre>
          </div>
        </aside>
      </main>
    </div>
  );
}

function StatTile(props: { label: string; value: string; icon: JSX.Element }) {
  return (
    <div className="stat-tile">
      <p>
        {props.icon}
        {props.label}
      </p>
      <strong>{props.value}</strong>
    </div>
  );
}
