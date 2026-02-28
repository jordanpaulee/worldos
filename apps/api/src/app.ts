import Fastify from "fastify";
import { getMacroCalendarConnector, getPricesConnector } from "@worldos/connectors";

import { registerBriefingRoutes } from "./routes/briefing.js";
import { registerEventRoutes } from "./routes/events.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerInstrumentRoutes } from "./routes/instruments.js";

export const buildApi = () => {
  const server = Fastify({
    logger: true,
  });

  server.decorate("worldos", {
    pricesConnector: getPricesConnector(),
    macroConnector: getMacroCalendarConnector(),
  });

  registerHealthRoutes(server);
  registerEventRoutes(server);
  registerInstrumentRoutes(server);
  registerBriefingRoutes(server);

  return server;
};
