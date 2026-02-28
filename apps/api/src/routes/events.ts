import type { FastifyInstance } from "fastify";
import { eventSchema } from "@chrona/core-schema";
import { z } from "zod";

const eventsResponseSchema = z.array(eventSchema);

type EventsResponse = z.infer<typeof eventsResponseSchema>;

export const registerEventRoutes = (server: FastifyInstance) => {
  server.get<{ Reply: EventsResponse }>("/events", async () => {
    const events = await server.chrona.macroConnector.fetch();

    return eventsResponseSchema.parse(events);
  });
};
