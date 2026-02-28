import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { instrumentSchema, type Instrument } from "@worldos/core-schema";

import type { Connector } from "./interface.js";

const fixturePath = fileURLToPath(new URL("../fixtures/prices.json", import.meta.url));

type PricesFixtureRecord = {
  symbol: string;
  name: string;
  latestPrice: number;
  changePct: number;
  asOf: string;
};

export const getPricesConnector = (): Connector<Instrument> => ({
  id: "market-prices-fixture",
  description: "ETF price connector for alpha validation backed by local JSON fixtures.",
  async fetch() {
    const raw = await readFile(fixturePath, "utf8");
    const records = JSON.parse(raw) as PricesFixtureRecord[];

    return records.map((record) =>
      instrumentSchema.parse({
        id: `instrument-${record.symbol.toLowerCase()}`,
        symbol: record.symbol,
        name: record.name,
        assetClass: "etf",
        currency: "USD",
        latestPrice: record.latestPrice,
        changePct: record.changePct,
        asOf: record.asOf,
        sourceId: "market-prices",
      }),
    );
  },
});
