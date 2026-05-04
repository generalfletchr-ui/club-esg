ALTER TABLE events
  ADD COLUMN intervenants JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN adresse      TEXT;
