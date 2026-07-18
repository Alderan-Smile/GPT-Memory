-- Seeds for development/testing
-- Run with: wrangler d1 execute gpt-memory-db --local --file=src/database/seeds/seed.sql

INSERT INTO campaigns (id, name, description, metadata) VALUES
  ('campaign-001', 'Star Wars: Edge of Empire', 'A campaign set in the Outer Rim during the reign of the Empire.', '{"era":"Imperial","setting":"Star Wars"}'),
  ('campaign-002', 'The Lost Expedition', 'Explorers searching for a lost civilization in uncharted space.', '{"era":"Unknown","setting":"Sci-Fi"}');

INSERT INTO characters (id, campaign_id, name, species, gender, status, description, trust, friendship) VALUES
  ('char-001', 'campaign-001', 'Kira Voss', 'Human', 'Female', 'alive', 'A skilled pilot and smuggler with a troubled past.', 75, 60),
  ('char-002', 'campaign-001', 'Zaren Thul', 'Twi''lek', 'Male', 'alive', 'Former Imperial officer turned rebel sympathizer.', 40, 30),
  ('char-003', 'campaign-001', 'Mira Odan', 'Mirialan', 'Female', 'alive', 'Force-sensitive healer seeking purpose.', 80, 70);

INSERT INTO planets (id, campaign_id, name, sector, region, description) VALUES
  ('planet-001', 'campaign-001', 'Tatooine', 'Arkanis', 'Outer Rim', 'A harsh desert world with twin suns, home to moisture farmers and criminal elements.'),
  ('planet-002', 'campaign-001', 'Nar Shaddaa', 'Hutt Space', 'Mid Rim', 'The Smuggler''s Moon, a city-covered satellite of Nal Hutta.'),
  ('planet-003', 'campaign-001', 'Coruscant', 'Corusca', 'Core Worlds', 'The galactic capital, a planet-wide city.');

INSERT INTO locations (id, campaign_id, name, planet, description) VALUES
  ('loc-001', 'campaign-001', 'Mos Eisley Cantina', 'planet-001', 'A wretched hive of scum and villainy. A popular meeting spot for smugglers.'),
  ('loc-002', 'campaign-001', 'Docking Bay 94', 'planet-001', 'A public docking bay in Mos Eisley.'),
  ('loc-003', 'campaign-001', 'Juma''s Bar', 'planet-002', 'A popular bar on the lower levels of Nar Shaddaa.');

INSERT INTO sessions (id, campaign_id, session_number, title, date, summary) VALUES
  ('session-001', 'campaign-001', 1, 'A New Beginning', '2026-01-10', 'The crew met at the Mos Eisley Cantina and received their first job from a mysterious contact.'),
  ('session-002', 'campaign-001', 2, 'The Heist', '2026-01-17', 'The crew successfully robbed an Imperial supply depot, but not without complications.');
