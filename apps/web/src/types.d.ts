import type { ProviderDefinition, QueryMode } from "@query402/shared";
export interface PaidQueryResponse {
    payment: {
        network: string;
        facilitatorUrl: string;
        paymentResponseHeader: string | null;
    };
    result: {
        mode: QueryMode;
        providerId: string;
        providerName: string;
        priceUsd: number;
        latencyMs: number;
        timestamp: string;
        traceId: string;
        items: Array<{
            title: string;
            url: string;
            snippet: string;
            score: number;
        }>;
        raw?: Record<string, unknown>;
    };
}
export interface AnalyticsResponse {
    totalQueries: number;
    totalSpendUsd: number;
    spendByCategory: Record<QueryMode, number>;
    recentTransactions: Array<{
        id: string;
        amountUsd: number;
        endpoint: string;
        providerId: string;
        status: string;
        createdAt: string;
    }>;
    recentUsage: Array<{
        id: string;
        mode: QueryMode;
        providerId: string;
        priceUsd: number;
        createdAt: string;
        latencyMs: number;
        paymentStatus: string;
        traceId: string;
    }>;
}
export type ProviderMap = Record<QueryMode, ProviderDefinition[]>;
//# sourceMappingURL=types.d.ts.map