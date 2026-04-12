import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Activity, CircleDollarSign, Gauge, Home, Radar, ReceiptText, Sparkles, TerminalSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { requestAccess } from "@stellar/freighter-api";
import { API_BASE_URL, fetchJson, money } from "../lib/api.js";
import { runWalletPaidQuery } from "../lib/x402.js";
const modeLabels = {
    search: "Search",
    news: "News",
    scrape: "Scrape"
};
const modeDefaultProvider = {
    search: "search.basic",
    news: "news.fast",
    scrape: "scrape.page"
};
const TOKEN_SYMBOL = "USDC";
const TOKEN_DECIMALS = 7;
function toTokenBaseUnits(amountUsd) {
    const normalizedAmount = amountUsd.toFixed(TOKEN_DECIMALS);
    return normalizedAmount.replace(".", "").replace(/^0+/, "") || "0";
}
export default function ControlDeckPage() {
    const [mode, setMode] = useState("search");
    const [paymentMode, setPaymentMode] = useState("wallet");
    const [connectedWalletAddress, setConnectedWalletAddress] = useState("");
    const [queryInput, setQueryInput] = useState("latest stellar x402 updates");
    const [urlInput, setUrlInput] = useState("https://developers.stellar.org");
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(modeDefaultProvider.search);
    const [result, setResult] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const modeProviders = useMemo(() => providers.filter((provider) => provider.category === mode && provider.enabled), [providers, mode]);
    const selectedProviderDetails = useMemo(() => modeProviders.find((provider) => provider.id === selectedProvider), [modeProviders, selectedProvider]);
    const activeInput = mode === "scrape" ? urlInput : queryInput;
    const walletConnected = connectedWalletAddress.length > 0;
    const estimatedTokenAmount = selectedProviderDetails?.priceUsd.toFixed(TOKEN_DECIMALS) ?? "0.0000000";
    const estimatedTokenBaseUnits = selectedProviderDetails ? toTokenBaseUnits(selectedProviderDetails.priceUsd) : "0";
    function shortAddress(address) {
        if (address.length < 12) {
            return address;
        }
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    async function connectWallet() {
        const result = await requestAccess();
        if (result.error || !result.address) {
            throw new Error(result.error ? JSON.stringify(result.error) : "Freighter wallet connection failed");
        }
        setConnectedWalletAddress(result.address);
        setError(null);
    }
    function disconnectWallet() {
        setConnectedWalletAddress("");
        setError(null);
    }
    async function refreshMetrics() {
        const data = await fetchJson(`${API_BASE_URL}/api/analytics`);
        setAnalytics(data);
    }
    useEffect(() => {
        async function bootstrap() {
            const providersResponse = await fetchJson(`${API_BASE_URL}/api/providers`);
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
    useEffect(() => {
        if (!walletConnected && paymentMode === "sponsored") {
            setPaymentMode("wallet");
        }
    }, [walletConnected, paymentMode]);
    async function runPaidQuery() {
        setIsLoading(true);
        setError(null);
        try {
            const data = paymentMode === "wallet"
                ? await runWalletPaidQuery({
                    apiBaseUrl: API_BASE_URL,
                    mode,
                    provider: selectedProvider,
                    query: mode === "scrape" ? undefined : queryInput,
                    url: mode === "scrape" ? urlInput : undefined,
                    walletAddress: connectedWalletAddress
                })
                : await fetchJson(`${API_BASE_URL}/api/paid/run`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mode,
                        provider: selectedProvider,
                        query: mode === "scrape" ? undefined : queryInput,
                        url: mode === "scrape" ? urlInput : undefined
                    })
                });
            setResult(data);
            await refreshMetrics();
        }
        catch (runError) {
            if (runError instanceof Error) {
                setError(runError.message);
            }
            else {
                setError("Query failed");
            }
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsxs("div", { className: "q402-shell", children: [_jsx("div", { className: "q402-gridline" }), _jsx("div", { className: "q402-noise" }), _jsxs("header", { className: "bridge control-topbar", id: "control-deck", children: [_jsxs("div", { className: "bridge-left lift-in", children: [_jsxs("p", { className: "stamp", children: [_jsx(Sparkles, { size: 13 }), " Query402 Control Deck"] }), _jsx("h1", { children: "Agentic internet access, paid per request." }), _jsx("p", { className: "subtitle", children: "On Stellar testnet, pick a provider through the x402 flow, pay per query, and audit the trace instantly." }), _jsxs(Link, { className: "ghost-btn topbar-link", to: "/", children: [_jsx(Home, { size: 14 }), " Back to landing"] })] }), _jsxs("div", { className: "bridge-right lift-in delay-1", children: [_jsx("div", { className: "control-wallet-bar", children: _jsxs("div", { className: "wallet-row", children: [_jsx("button", { type: "button", className: "wallet-btn", onClick: () => {
                                                connectWallet().catch((walletError) => {
                                                    setError(walletError instanceof Error ? walletError.message : "Wallet connection failed");
                                                });
                                            }, disabled: walletConnected, children: "Connect Wallet" }), _jsx("button", { type: "button", className: "wallet-btn ghost", onClick: disconnectWallet, disabled: !walletConnected, children: "Disconnect" }), _jsx("span", { className: walletConnected ? "wallet-status connected" : "wallet-status", children: walletConnected ? `Connected: ${shortAddress(connectedWalletAddress)}` : "Not connected" })] }) }), _jsx(StatTile, { label: "Queries", value: String(analytics?.totalQueries ?? 0), icon: _jsx(Activity, { size: 16 }) }), _jsx(StatTile, { label: "Spend", value: money(analytics?.totalSpendUsd ?? 0), icon: _jsx(CircleDollarSign, { size: 16 }) }), _jsx(StatTile, { label: "Search", value: money(analytics?.spendByCategory.search ?? 0), icon: _jsx(Radar, { size: 16 }) }), _jsx(StatTile, { label: "News", value: money(analytics?.spendByCategory.news ?? 0), icon: _jsx(ReceiptText, { size: 16 }) })] })] }), _jsxs("main", { className: "dock", children: [_jsxs("section", { className: "bay bay--left lift-in delay-2", children: [_jsxs("div", { className: "bay-head", children: [_jsx("h2", { children: "Query Bay" }), _jsxs("span", { children: [modeLabels[mode], " mode"] })] }), _jsx("div", { className: "mode-switch", children: Object.keys(modeLabels).map((item) => (_jsx("button", { className: mode === item ? "mode-btn active" : "mode-btn", onClick: () => setMode(item), type: "button", children: modeLabels[item] }, item))) }), _jsxs("div", { className: "input-shell", children: [_jsx("label", { children: mode === "scrape" ? "TARGET URL" : "RESEARCH QUERY" }), mode === "scrape" ? (_jsx("input", { value: urlInput, onChange: (event) => setUrlInput(event.target.value), placeholder: "https://example.com" })) : (_jsx("input", { value: queryInput, onChange: (event) => setQueryInput(event.target.value), placeholder: "latest stellar x402 updates" })), _jsx("label", { children: "PAYMENT MODE (Hackathon)" }), _jsxs("div", { className: "payment-mode-switch", children: [_jsx("button", { type: "button", className: paymentMode === "sponsored" ? "payment-mode-btn active" : "payment-mode-btn", onClick: () => setPaymentMode("sponsored"), disabled: !walletConnected, children: "Sponsored tx" }), _jsx("button", { type: "button", className: paymentMode === "wallet" ? "payment-mode-btn active" : "payment-mode-btn", onClick: () => setPaymentMode("wallet"), disabled: !walletConnected, children: "Wallet tx" })] }), _jsx("p", { className: "wallet-hint", children: "Sponsored mode is available only after wallet connection. If you do not click Sponsored tx, payment continues with wallet tx." })] }), _jsx("div", { className: "provider-strip", children: modeProviders.map((provider, index) => (_jsxs("button", { onClick: () => setSelectedProvider(provider.id), className: provider.id === selectedProvider ? "provider-card selected" : "provider-card", style: { animationDelay: `${index * 70}ms` }, type: "button", children: [_jsx("p", { className: "provider-name", children: provider.name }), _jsx("p", { className: "provider-desc", children: provider.description }), _jsxs("div", { className: "provider-metrics", children: [_jsx("span", { children: money(provider.priceUsd) }), _jsxs("span", { children: [provider.latencyEstimateMs, "ms"] }), _jsxs("span", { children: ["Q", provider.qualityScore] })] })] }, provider.id))) }), _jsxs("div", { className: "action-row", children: [_jsxs("div", { children: [_jsx("p", { className: "action-label", children: "Provider lock" }), _jsx("p", { className: "action-value", children: selectedProviderDetails?.name ?? "Choose provider" }), _jsxs("p", { className: "action-label", children: ["Mode: ", paymentMode === "sponsored" ? "Sponsored" : "Wallet"] }), _jsxs("p", { className: "action-label", children: ["Estimated on-chain: ", estimatedTokenAmount, " ", TOKEN_SYMBOL, " (", estimatedTokenBaseUnits, " base units)"] })] }), _jsxs("button", { className: "run-btn", onClick: runPaidQuery, disabled: isLoading || !selectedProvider || !walletConnected, type: "button", children: [isLoading ? "Executing..." : "Run paid query", _jsx(TerminalSquare, { size: 16 })] })] }), error ? _jsx("p", { className: "error-box", children: error }) : null, _jsxs("div", { className: "result-zone sweep", children: [_jsxs("div", { className: "bay-head bay-head--compact", children: [_jsx("h2", { children: "Signal Output" }), _jsx("span", { children: result ? new Date(result.result.timestamp).toLocaleTimeString() : "waiting" })] }), !result ? (_jsx("p", { className: "empty-note", children: "Waiting for results. Start a query from the left panel." })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "result-meta", children: [_jsx("span", { children: result.result.providerName }), _jsx("span", { children: money(result.result.priceUsd) }), _jsxs("span", { children: [result.result.latencyMs, "ms"] }), _jsx("span", { children: result.result.traceId.slice(0, 12) })] }), _jsxs("div", { className: "trace-box", children: [_jsxs("p", { children: ["payment-response: ", result.payment.paymentResponseHeader ?? "<none>"] }), _jsxs("p", { children: ["network: ", result.payment.network] })] }), _jsx("div", { className: "item-stack", children: result.result.items.map((item) => (_jsxs("article", { children: [_jsx("h3", { children: item.title }), _jsx("a", { href: item.url, target: "_blank", rel: "noreferrer", children: item.url }), _jsx("p", { children: item.snippet })] }, `${item.url}-${item.title}`))) })] }))] })] }), _jsxs("aside", { className: "bay bay--right lift-in delay-3", children: [_jsx("div", { className: "orbital", children: _jsxs("div", { className: "orbital-center", children: [_jsx(Gauge, { size: 20 }), _jsx("p", { children: money(analytics?.totalSpendUsd ?? 0) }), _jsx("span", { children: "Total spend" })] }) }), _jsxs("div", { className: "analytics-panel", children: [_jsx("h3", { children: "Spend by category" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("span", { children: "Search" }), _jsx("strong", { children: money(analytics?.spendByCategory.search ?? 0) })] }), _jsxs("li", { children: [_jsx("span", { children: "News" }), _jsx("strong", { children: money(analytics?.spendByCategory.news ?? 0) })] }), _jsxs("li", { children: [_jsx("span", { children: "Scrape" }), _jsx("strong", { children: money(analytics?.spendByCategory.scrape ?? 0) })] })] })] }), _jsxs("div", { className: "feed-panel", children: [_jsx("h3", { children: "Recent transactions" }), (analytics?.recentTransactions ?? []).slice(0, 5).map((tx) => (_jsxs("div", { className: "feed-row", children: [_jsxs("p", { children: [_jsx("span", { children: tx.providerId }), _jsx("strong", { children: money(tx.amountUsd) })] }), _jsx("small", { children: new Date(tx.createdAt).toLocaleString() })] }, tx.id)))] }), _jsxs("div", { className: "feed-panel", children: [_jsx("h3", { children: "Execution feed" }), (analytics?.recentUsage ?? []).slice(0, 5).map((usage) => (_jsxs("div", { className: "feed-row", children: [_jsxs("p", { children: [_jsxs("span", { children: [usage.mode.toUpperCase(), " \u00B7 ", usage.providerId] }), _jsxs("strong", { children: [usage.latencyMs, "ms"] })] }), _jsxs("small", { children: [money(usage.priceUsd), " \u00B7 ", new Date(usage.createdAt).toLocaleString()] })] }, usage.id)))] }), _jsxs("div", { className: "script-panel", children: [_jsx("h3", { children: "Live payload preview" }), _jsx("pre", { children: JSON.stringify({ mode, route: walletConnected ? "wallet" : "sponsored", provider: selectedProvider, input: activeInput }, null, 2) })] })] })] })] }));
}
function StatTile(props) {
    return (_jsxs("div", { className: "stat-tile", children: [_jsxs("p", { children: [props.icon, props.label] }), _jsx("strong", { children: props.value })] }));
}
//# sourceMappingURL=ControlDeckPage.js.map