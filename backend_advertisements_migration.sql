-- Migration: create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL DEFAULT 'Services',
  description TEXT,
  location    VARCHAR(255),
  phone       VARCHAR(50),
  image       TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advertisements_category ON advertisements(category);
CREATE INDEX IF NOT EXISTS idx_advertisements_is_active ON advertisements(is_active);
