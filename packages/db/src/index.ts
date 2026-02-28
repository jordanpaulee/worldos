export const migrationFiles = [
  "001_sources.sql",
  "002_instruments.sql",
  "003_entities.sql",
  "004_events.sql",
  "005_ingest_runs.sql",
  "006_event_entities.sql",
] as const;

export const getDatabaseUrl = () =>
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/worldos";
