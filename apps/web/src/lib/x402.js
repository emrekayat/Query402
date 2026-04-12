import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { signAuthEntry, signTransaction } from "@stellar/freighter-api";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
const stellarRpcUrl = import.meta.env.VITE_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
function extractFreighterErrorMessage(error) {
    if (!error) {
        return "Freighter wallet error";
    }
    if (typeof error === "string") {
        return error;
    }
    if (typeof error === "object" && "message" in error && typeof error.message === "string") {
        return error.message;
    }
    return JSON.stringify(error);
}
function createFreighterSigner(address) {
    return {
        address,
        signAuthEntry: async (authEntryXdr, opts) => {
            const result = await signAuthEntry(authEntryXdr, {
                networkPassphrase: opts?.networkPassphrase,
                address
            });
            if (result.error || !result.signedAuthEntry) {
                throw new Error(extractFreighterErrorMessage(result.error));
            }
            return {
                signedAuthEntry: result.signedAuthEntry,
                signerAddress: result.signerAddress
            };
        },
        signTransaction: async (transactionXdr, opts) => {
            const result = await signTransaction(transactionXdr, {
                networkPassphrase: opts?.networkPassphrase,
                address
            });
            if (result.error || !result.signedTxXdr) {
                throw new Error(extractFreighterErrorMessage(result.error));
            }
            return {
                signedTxXdr: result.signedTxXdr,
                signerAddress: result.signerAddress
            };
        }
    };
}
export async function runWalletPaidQuery(input) {
    const params = new URLSearchParams({ provider: input.provider });
    if (input.mode === "scrape") {
        if (!input.url) {
            throw new Error("url is required for scrape mode");
        }
        params.set("url", input.url);
    }
    else {
        if (!input.query) {
            throw new Error("query is required for search/news mode");
        }
        params.set("q", input.query);
    }
    const endpoint = `${input.apiBaseUrl}/x402/${input.mode}?${params.toString()}`;
    const signer = createFreighterSigner(input.walletAddress);
    const client = new x402Client().register("stellar:*", new ExactStellarScheme(signer, { url: stellarRpcUrl }));
    const fetchWithPayment = wrapFetchWithPayment(fetch, client);
    const response = await fetchWithPayment(endpoint, { method: "GET" });
    const payload = await response.json();
    if (!response.ok) {
        if (typeof payload?.error === "string" && payload.error.length > 0) {
            throw new Error(payload.error);
        }
        throw new Error(JSON.stringify(payload));
    }
    return payload;
}
//# sourceMappingURL=x402.js.map