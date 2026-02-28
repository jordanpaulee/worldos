CREATE TABLE IF NOT EXISTS event_entities (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  PRIMARY KEY (event_id, entity_id, role)
);
