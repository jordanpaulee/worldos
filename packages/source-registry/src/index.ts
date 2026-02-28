import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

import { sourceSchema, type Source } from "@worldos/core-schema";

const registryPath = fileURLToPath(new URL("../registry.yaml", import.meta.url));

const registrySchema = sourceSchema.array();

export const loadSourceRegistry = (): Source[] => {
  const raw = readFileSync(registryPath, "utf8");
  const parsed = YAML.parse(raw) as { sources: unknown[] };

  return registrySchema.parse(parsed.sources);
};

export const getSourceById = (sourceId: string): Source | undefined =>
  loadSourceRegistry().find((source) => source.id === sourceId);
