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

export type Source = z.infer<typeof sourceSchema>;
export type Instrument = z.infer<typeof instrumentSchema>;
export type Entity = z.infer<typeof entitySchema>;
export type Event = z.infer<typeof eventSchema>;
