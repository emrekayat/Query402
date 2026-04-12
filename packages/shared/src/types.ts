export type QueryMode = "search" | "news" | "scrape";
export type ProviderCategory = QueryMode;
export type SourceType = "mock" | "real";

export interface ProviderDefinition {
  id: string;
  name: string;
  category: ProviderCategory;
  priceUsd: number;
  description: string;
  latencyEstimateMs: number;
  qualityScore: number;
  sourceType: SourceType;
  enabled: boolean;
}

export interface ProviderResultItem {
  title: string;
  url: string;
  snippet: string;
  score: number;
}

export interface QueryResult {
  mode: QueryMode;
  providerId: string;
  providerName: string;
  priceUsd: number;
  latencyMs: number;
  timestamp: string;
  traceId: string;
  items: ProviderResultItem[];
  raw?: Record<string, unknown>;
}

export interface UsageEvent {
  id: string;
  mode: QueryMode;
  endpoint: string;
  providerId: string;
  queryOrUrl: string;
  priceUsd: number;
  network: string;
  paymentStatus: "paid" | "failed" | "demo-paid";
  paymentTxHash?: string;
  facilitatorUrl?: string;
  payerPublicKey?: string;
  traceId: string;
  createdAt: string;
  latencyMs: number;
}

export interface PaymentAttempt {
  id: string;
  endpoint: string;
  providerId: string;
  amountUsd: number;
  network: string;
  payerPublicKey?: string;
  payToAddress: string;
  facilitatorUrl: string;
  status: "verified" | "settled" | "failed";
  transactionHash?: string;
  error?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalQueries: number;
  totalSpendUsd: number;
  spendByCategory: Record<QueryMode, number>;
  recentTransactions: PaymentAttempt[];
  recentUsage: UsageEvent[];
}
