import { z } from "zod";

export const sourceComplianceSchema = z.object({
  access: z.enum(["public", "licensed", "internal"]),
  license: z.string(),
  pii: z.boolean(),
  retention: z.string(),
  termsUrl: z.string().url(),
});

export const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["market-data", "macro-calendar"]),
  provider: z.string(),
  compliance: sourceComplianceSchema,
});

export const instrumentSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  assetClass: z.enum(["etf", "index", "fx", "commodity"]),
  currency: z.string(),
  latestPrice: z.number(),
  changePct: z.number(),
  asOf: z.string(),
  sourceId: z.string(),
});

export const entitySchema = z.object({
  id: z.string(),
  kind: z.enum(["country", "organization", "instrument", "person"]),
  name: z.string(),
  ticker: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const eventSchema = z.object({
  id: z.string(),
  type: z.enum(["macro_event", "market_event", "policy_event"]),
  title: z.string(),
  summary: z.string(),
  occurredAt: z.string(),
  importance: z.enum(["low", "medium", "high"]),
  sourceId: z.string(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const featureScopeSchema = z.object({
  entityType: z.enum(["instrument", "country", "region", "topic", "market"]),
  entityId: z.string(),
  window: z.enum(["hour", "day", "week"]),
});

export const featureSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "market_move",
    "macro_event_count",
    "policy_intensity",
    "watchlist_relevance",
    "cross_asset_stress",
    "catalyst_concentration",
  ]),
  label: z.string(),
  value: z.number(),
  unit: z.string(),
  observedAt: z.string(),
  scope: featureScopeSchema,
  sourceEventIds: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const signalEvidenceSchema = z.object({
  headline: z.string(),
  detail: z.string(),
});

export const signalSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  targetInstrumentId: z.string(),
  featureId: z.string(),
  direction: z.enum(["upside", "downside", "mixed"]),
  horizon: z.string(),
  stability: z.enum(["emerging", "watch", "established"]),
  confidenceScore: z.number().min(0).max(1),
  evidence: z.array(signalEvidenceSchema).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const watchlistImpactSchema = z.object({
  id: z.string(),
  instrumentId: z.string(),
  instrumentSymbol: z.string(),
  eventId: z.string(),
  eventTitle: z.string(),
  narrative: z.string(),
  possibleDirection: z.enum(["positive", "negative", "mixed"]),
  observedMovePct: z.number(),
  relevanceScore: z.number().min(0).max(1),
  confidenceScore: z.number().min(0).max(1),
  horizon: z.string(),
  status: z.enum(["watching", "active", "cooling"]),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type Source = z.infer<typeof sourceSchema>;
export type Instrument = z.infer<typeof instrumentSchema>;
export type Entity = z.infer<typeof entitySchema>;
export type Event = z.infer<typeof eventSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type Signal = z.infer<typeof signalSchema>;
export type WatchlistImpact = z.infer<typeof watchlistImpactSchema>;
