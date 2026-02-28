import type { FastifyInstance } from "fastify";
import { z } from "zod";

const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("chrona-api"),
  version: z.string(),
});

type HealthResponse = z.infer<typeof healthResponseSchema>;

export const registerHealthRoutes = (server: FastifyInstance) => {
  server.get<{ Reply: HealthResponse }>("/health", async () =>
    healthResponseSchema.parse({
      status: "ok",
      service: "chrona-api",
      version: "0.1-alpha",
    }),
  );
};
