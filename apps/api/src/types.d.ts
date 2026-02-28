import type { Event, Instrument } from "@chrona/core-schema";
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    chrona: {
      pricesConnector: {
        fetch: () => Promise<Instrument[]>;
      };
      macroConnector: {
        fetch: () => Promise<Event[]>;
      };
    };
  }
}
