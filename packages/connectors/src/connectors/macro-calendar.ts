import { eventSchema, type Event } from "@chrona/core-schema";
import records from "../fixtures/macro-calendar.json";

import type { Connector } from "./interface";

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
    return (records as MacroFixtureRecord[]).map((record) =>
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
