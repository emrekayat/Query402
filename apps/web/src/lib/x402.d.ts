import type { PaidQueryResponse } from "../types.js";
export declare function runWalletPaidQuery(input: {
    apiBaseUrl: string;
    mode: "search" | "news" | "scrape";
    provider: string;
    query?: string;
    url?: string;
    walletAddress: string;
}): Promise<PaidQueryResponse>;
//# sourceMappingURL=x402.d.ts.map