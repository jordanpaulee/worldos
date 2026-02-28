import { macroIngestQueue, pricesIngestQueue, startWorkers } from "./queues.js";

const bootstrap = async () => {
  startWorkers();

  const cycleKey = new Date().toISOString().slice(0, 10);

  await pricesIngestQueue.add(
    "prices-ingest",
    { cycleKey },
    {
      jobId: `prices:${cycleKey}`,
      removeOnComplete: 100,
      removeOnFail: 100,
    },
  );

  await macroIngestQueue.add(
    "macro-ingest",
    { cycleKey },
    {
      jobId: `macro:${cycleKey}`,
      removeOnComplete: 100,
      removeOnFail: 100,
    },
  );
};

void bootstrap();
