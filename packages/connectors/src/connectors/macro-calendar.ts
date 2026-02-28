import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { eventSchema, type Event } from "@worldos/core-schema";

import type { Connector } from "./interface.js";

const fixturePath = fileURLToPath(new URL("../fixtures/macro-calendar.json", import.meta.url));

type MacroFixtureRecord = {
  id: string;
  title: string;
  summary: string;
  occurredAt: string;
  importance: "low" | "medium" | "high";
  country: string;
};

export const getMacroCalendarConnector = (): Connector<Event> => ({
  id: "macro-calendar-fixture",
  description: "Minimal pluggable macro calendar connector backed by a JSON fixture.",
  async fetch() {
    const raw = await readFile(fixturePath, "utf8");
    const records = JSON.parse(raw) as MacroFixtureRecord[];

    return records.map((record) =>
      eventSchema.parse({
        id: record.id,
        type: "macro_event",
        title: record.title,
        summary: record.summary,
        occurredAt: record.occurredAt,
        importance: record.importance,
        sourceId: "macro-calendar",
        tags: [record.country, "macro-calendar"],
        metadata: {
          country: record.country,
          provider: "placeholder-provider",
        },
      }),
    );
  },
});
