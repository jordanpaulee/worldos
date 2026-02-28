import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

import { processMacroIngest } from "./processors/macro.js";
import { processPricesIngest } from "./processors/prices.js";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const pricesIngestQueue = new Queue("prices_ingest", { connection });
export const macroIngestQueue = new Queue("macro_ingest", { connection });

export const startWorkers = () => {
  const pricesWorker = new Worker("prices_ingest", processPricesIngest, { connection });
  const macroWorker = new Worker("macro_ingest", processMacroIngest, { connection });

  pricesWorker.on("completed", (job, result) => {
    console.log("prices_ingest completed", job.id, result);
  });

  macroWorker.on("completed", (job, result) => {
    console.log("macro_ingest completed", job.id, result);
  });
};
