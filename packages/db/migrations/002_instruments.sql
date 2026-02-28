CREATE TABLE IF NOT EXISTS instruments (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  asset_class TEXT NOT NULL,
  currency TEXT NOT NULL,
  latest_price NUMERIC(18, 6),
  change_pct NUMERIC(10, 4),
  as_of TIMESTAMPTZ,
  source_id TEXT NOT NULL REFERENCES sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
