import type { QueryMode } from "@query402/shared";

export interface QueryExecutionInput {
  mode: QueryMode;
  providerId: string;
  queryOrUrl: string;
}

export interface TraceContext {
  traceId: string;
  startedAt: number;
}
