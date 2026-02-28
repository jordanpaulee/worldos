import { createHash } from "node:crypto";
import type { Job } from "bullmq";
import { getPricesConnector } from "@chrona/connectors";

export const processPricesIngest = async (job: Job<{ cycleKey: string }>) => {
  const connector = getPricesConnector();
  const instruments = await connector.fetch();
  const digest = createHash("sha256").update(JSON.stringify(instruments)).digest("hex");

  return {
    queue: "prices_ingest",
    cycleKey: job.data.cycleKey,
    dedupeKey: `prices:${digest}`,
    processedCount: instruments.length,
  };
};
