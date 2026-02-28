import type { FastifyInstance } from "fastify";
import { instrumentSchema } from "@worldos/core-schema";
import { z } from "zod";

const instrumentsResponseSchema = z.array(instrumentSchema);

type InstrumentsResponse = z.infer<typeof instrumentsResponseSchema>;

export const registerInstrumentRoutes = (server: FastifyInstance) => {
  server.get<{ Reply: InstrumentsResponse }>("/instruments", async () => {
    const instruments = await server.worldos.pricesConnector.fetch();

    return instrumentsResponseSchema.parse(instruments);
  });
};
