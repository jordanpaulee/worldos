import type { FastifyInstance } from "fastify";
import { z } from "zod";

const dailyBriefingResponseSchema = z.object({
  generatedAt: z.string(),
  lead: z.string(),
  marketSnapshot: z.array(
    z.object({
      symbol: z.string(),
      latestPrice: z.number(),
      changePct: z.number(),
    }),
  ),
  eventHighlights: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      occurredAt: z.string(),
      importance: z.enum(["low", "medium", "high"]),
    }),
  ),
});

type DailyBriefingResponse = z.infer<typeof dailyBriefingResponseSchema>;

export const registerBriefingRoutes = (server: FastifyInstance) => {
  server.get<{ Reply: DailyBriefingResponse }>("/briefing/daily", async () => {
    const instruments = await server.chrona.pricesConnector.fetch();
    const events = await server.chrona.macroConnector.fetch();

    return dailyBriefingResponseSchema.parse({
      generatedAt: new Date().toISOString(),
      lead: "Fixture-backed summary for the v0.1-alpha validation path.",
      marketSnapshot: instruments.slice(0, 5).map((instrument) => ({
        symbol: instrument.symbol,
        latestPrice: instrument.latestPrice,
        changePct: instrument.changePct,
      })),
      eventHighlights: events.slice(0, 3).map((event) => ({
        id: event.id,
        title: event.title,
        occurredAt: event.occurredAt,
        importance: event.importance,
      })),
    });
  });
};
