import { createHash } from "node:crypto";
import type { Job } from "bullmq";
import { getMacroCalendarConnector } from "@chrona/connectors";

export const processMacroIngest = async (job: Job<{ cycleKey: string }>) => {
  const connector = getMacroCalendarConnector();
  const events = await connector.fetch();
  const digest = createHash("sha256").update(JSON.stringify(events)).digest("hex");

  return {
    queue: "macro_ingest",
    cycleKey: job.data.cycleKey,
    dedupeKey: `macro:${digest}`,
    processedCount: events.length,
  };
};
