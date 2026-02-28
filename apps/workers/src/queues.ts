import { Queue, Worker } from "bullmq";

import { processMacroIngest } from "./processors/macro.js";
import { processPricesIngest } from "./processors/prices.js";

const redisUrl = new URL(process.env.REDIS_URL ?? "redis://localhost:6379");
const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null,
};

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
