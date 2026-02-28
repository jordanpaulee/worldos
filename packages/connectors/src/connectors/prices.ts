import { instrumentSchema, type Instrument } from "@worldos/core-schema";
import records from "../fixtures/prices.json";

import type { Connector } from "./interface";

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
    return (records as PricesFixtureRecord[]).map((record) =>
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
