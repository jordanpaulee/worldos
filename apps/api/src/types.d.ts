import type { Event, Instrument } from "@worldos/core-schema";
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    worldos: {
      pricesConnector: {
        fetch: () => Promise<Instrument[]>;
      };
      macroConnector: {
        fetch: () => Promise<Event[]>;
      };
    };
  }
}
