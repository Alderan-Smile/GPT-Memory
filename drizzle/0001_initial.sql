-- Migration: 0001_initial
-- Created: 2026-07-18

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);

-- ============================================================
-- SPECIES
-- ============================================================
CREATE TABLE IF NOT EXISTS species (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  description TEXT,
  homeworld TEXT,
  traits TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS species_campaign_idx ON species(campaign_id);
CREATE INDEX IF NOT EXISTS species_name_idx ON species(name);

-- ============================================================
-- CHARACTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  aliases TEXT,
  species TEXT,
  gender TEXT,
  birth TEXT,
  death TEXT,
  status TEXT NOT NULL DEFAULT 'alive' CHECK(status IN ('alive','dead','unknown','missing')),
  organization TEXT,
  rank TEXT,
  current_planet TEXT,
  current_location TEXT,
  description TEXT,
  emotional_state TEXT,
  trust REAL DEFAULT 50,
  respect REAL DEFAULT 50,
  friendship REAL DEFAULT 50,
  fear REAL DEFAULT 0,
  curiosity REAL DEFAULT 50,
  anger REAL DEFAULT 0,
  love REAL DEFAULT 0,
  hate REAL DEFAULT 0,
  debt REAL DEFAULT 0,
  last_interaction TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS characters_campaign_idx ON characters(campaign_id);
CREATE INDEX IF NOT EXISTS characters_name_idx ON characters(name);
CREATE INDEX IF NOT EXISTS characters_status_idx ON characters(status);
CREATE INDEX IF NOT EXISTS characters_planet_idx ON characters(current_planet);
CREATE INDEX IF NOT EXISTS characters_location_idx ON characters(current_location);

-- ============================================================
-- STAR SYSTEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS star_systems (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  sector TEXT,
  region TEXT,
  coordinates TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS star_systems_campaign_idx ON star_systems(campaign_id);
CREATE INDEX IF NOT EXISTS star_systems_name_idx ON star_systems(name);

-- ============================================================
-- PLANETS
-- ============================================================
CREATE TABLE IF NOT EXISTS planets (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  sector TEXT,
  region TEXT,
  system TEXT REFERENCES star_systems(id),
  description TEXT,
  climate TEXT,
  terrain TEXT,
  population TEXT,
  government TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS planets_campaign_idx ON planets(campaign_id);
CREATE INDEX IF NOT EXISTS planets_name_idx ON planets(name);
CREATE INDEX IF NOT EXISTS planets_system_idx ON planets(system);

-- ============================================================
-- LOCATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  planet TEXT REFERENCES planets(id),
  sector TEXT,
  region TEXT,
  coordinates TEXT,
  description TEXT,
  type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS locations_campaign_idx ON locations(campaign_id);
CREATE INDEX IF NOT EXISTS locations_name_idx ON locations(name);
CREATE INDEX IF NOT EXISTS locations_planet_idx ON locations(planet);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  description TEXT,
  leader TEXT,
  type TEXT,
  alignment TEXT,
  headquarters TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS organizations_campaign_idx ON organizations(campaign_id);
CREATE INDEX IF NOT EXISTS organizations_name_idx ON organizations(name);

-- ============================================================
-- SHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS ships (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  class TEXT,
  captain TEXT,
  crew TEXT,
  current_location TEXT,
  state TEXT DEFAULT 'operational' CHECK(state IN ('operational','damaged','destroyed','docked','in_transit')),
  description TEXT,
  manufacturer TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS ships_campaign_idx ON ships(campaign_id);
CREATE INDEX IF NOT EXISTS ships_name_idx ON ships(name);
CREATE INDEX IF NOT EXISTS ships_captain_idx ON ships(captain);

-- ============================================================
-- VEHICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  type TEXT,
  owner TEXT,
  current_location TEXT,
  state TEXT DEFAULT 'operational' CHECK(state IN ('operational','damaged','destroyed','stored')),
  description TEXT,
  manufacturer TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS vehicles_campaign_idx ON vehicles(campaign_id);
CREATE INDEX IF NOT EXISTS vehicles_owner_idx ON vehicles(owner);

-- ============================================================
-- OBJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS objects (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  type TEXT,
  owner TEXT,
  current_location TEXT,
  state TEXT DEFAULT 'intact' CHECK(state IN ('intact','damaged','destroyed','lost','unknown')),
  description TEXT,
  rarity TEXT DEFAULT 'common' CHECK(rarity IN ('common','uncommon','rare','unique','legendary')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS objects_campaign_idx ON objects(campaign_id);
CREATE INDEX IF NOT EXISTS objects_name_idx ON objects(name);
CREATE INDEX IF NOT EXISTS objects_owner_idx ON objects(owner);
CREATE INDEX IF NOT EXISTS objects_type_idx ON objects(type);

-- ============================================================
-- INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  owner_id TEXT NOT NULL,
  owner_type TEXT NOT NULL CHECK(owner_type IN ('character','ship','vehicle','location')),
  object_id TEXT NOT NULL REFERENCES objects(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS inventory_campaign_idx ON inventory(campaign_id);
CREATE INDEX IF NOT EXISTS inventory_owner_idx ON inventory(owner_id, owner_type);
CREATE INDEX IF NOT EXISTS inventory_object_idx ON inventory(object_id);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  date TEXT,
  era TEXT,
  planet TEXT,
  location TEXT,
  summary TEXT NOT NULL,
  importance INTEGER NOT NULL DEFAULT 5,
  canon INTEGER NOT NULL DEFAULT 1,
  alternate_canon INTEGER NOT NULL DEFAULT 0,
  participants TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS events_campaign_idx ON events(campaign_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_importance_idx ON events(importance);
CREATE INDEX IF NOT EXISTS events_planet_idx ON events(planet);

-- ============================================================
-- TIMELINE
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  date TEXT,
  event_id TEXT REFERENCES events(id),
  "order" INTEGER NOT NULL DEFAULT 0,
  label TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS timeline_campaign_idx ON timeline(campaign_id);
CREATE INDEX IF NOT EXISTS timeline_order_idx ON timeline("order");
CREATE INDEX IF NOT EXISTS timeline_event_idx ON timeline(event_id);

-- ============================================================
-- RELATIONSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS relationships (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  character_a TEXT NOT NULL,
  character_b TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  strength REAL NOT NULL DEFAULT 0,
  history TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS relationships_campaign_idx ON relationships(campaign_id);
CREATE INDEX IF NOT EXISTS relationships_char_a_idx ON relationships(character_a);
CREATE INDEX IF NOT EXISTS relationships_char_b_idx ON relationships(character_b);
CREATE INDEX IF NOT EXISTS relationships_type_idx ON relationships(relationship_type);

-- ============================================================
-- SECRETS
-- ============================================================
CREATE TABLE IF NOT EXISTS secrets (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  revealed INTEGER NOT NULL DEFAULT 0,
  visible_to_player INTEGER NOT NULL DEFAULT 0,
  conditions TEXT,
  importance INTEGER NOT NULL DEFAULT 5,
  related_entities TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS secrets_campaign_idx ON secrets(campaign_id);
CREATE INDEX IF NOT EXISTS secrets_revealed_idx ON secrets(revealed);
CREATE INDEX IF NOT EXISTS secrets_importance_idx ON secrets(importance);

-- ============================================================
-- PLAYER KNOWLEDGE
-- ============================================================
CREATE TABLE IF NOT EXISTS player_knowledge (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  character_id TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  certainty REAL NOT NULL DEFAULT 100,
  category TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS player_knowledge_campaign_idx ON player_knowledge(campaign_id);
CREATE INDEX IF NOT EXISTS player_knowledge_character_idx ON player_knowledge(character_id);
CREATE INDEX IF NOT EXISTS player_knowledge_subject_idx ON player_knowledge(subject);

-- ============================================================
-- WORLD KNOWLEDGE
-- ============================================================
CREATE TABLE IF NOT EXISTS world_knowledge (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  canon INTEGER NOT NULL DEFAULT 1,
  sources TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS world_knowledge_campaign_idx ON world_knowledge(campaign_id);
CREATE INDEX IF NOT EXISTS world_knowledge_subject_idx ON world_knowledge(subject);
CREATE INDEX IF NOT EXISTS world_knowledge_category_idx ON world_knowledge(category);

-- ============================================================
-- QUOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  author TEXT,
  target TEXT,
  location TEXT,
  date TEXT,
  text TEXT NOT NULL,
  importance INTEGER NOT NULL DEFAULT 5,
  context TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS quotes_campaign_idx ON quotes(campaign_id);
CREATE INDEX IF NOT EXISTS quotes_author_idx ON quotes(author);
CREATE INDEX IF NOT EXISTS quotes_importance_idx ON quotes(importance);

-- ============================================================
-- NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  title TEXT,
  content TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  pinned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS notes_campaign_idx ON notes(campaign_id);
CREATE INDEX IF NOT EXISTS notes_entity_idx ON notes(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS notes_pinned_idx ON notes(pinned);

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS tags_campaign_idx ON tags(campaign_id);
CREATE INDEX IF NOT EXISTS tags_name_idx ON tags(name);

-- ============================================================
-- ENTITY TAGS (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS entity_tags (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  tag_id TEXT NOT NULL REFERENCES tags(id),
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS entity_tags_campaign_idx ON entity_tags(campaign_id);
CREATE INDEX IF NOT EXISTS entity_tags_tag_idx ON entity_tags(tag_id);
CREATE INDEX IF NOT EXISTS entity_tags_entity_idx ON entity_tags(entity_id, entity_type);

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  session_number INTEGER NOT NULL,
  title TEXT,
  date TEXT,
  in_game_date TEXT,
  summary TEXT,
  players TEXT,
  highlights TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS sessions_campaign_idx ON sessions(campaign_id);
CREATE INDEX IF NOT EXISTS sessions_number_idx ON sessions(session_number);
CREATE INDEX IF NOT EXISTS sessions_date_idx ON sessions(date);

-- ============================================================
-- FTS5 FULL TEXT SEARCH
-- ============================================================
CREATE VIRTUAL TABLE IF NOT EXISTS fts_index USING fts5(
  entity_id UNINDEXED,
  entity_type UNINDEXED,
  campaign_id UNINDEXED,
  content,
  tokenize='porter ascii'
);
