-- Settings (configuración global)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- House models
CREATE TABLE IF NOT EXISTS models (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_from INTEGER DEFAULT 1,
  bedrooms INTEGER NOT NULL,
  bathrooms REAL NOT NULL,
  sqm INTEGER NOT NULL,
  parking INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  images_json TEXT NOT NULL DEFAULT '[]',
  thumbnail TEXT NOT NULL,
  location TEXT NOT NULL,
  development TEXT NOT NULL,
  features_json TEXT NOT NULL DEFAULT '[]',
  plan_url TEXT,
  video_url TEXT,
  virtual_tour TEXT,
  similar_models_json TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Developments
CREATE TABLE IF NOT EXISTS developments (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  images_json TEXT NOT NULL DEFAULT '[]',
  amenities_json TEXT NOT NULL DEFAULT '[]',
  progress INTEGER DEFAULT 0,
  available_models_json TEXT DEFAULT '[]',
  lat REAL,
  lng REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  photo TEXT NOT NULL,
  model TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- FAQ
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo TEXT NOT NULL,
  phone TEXT NOT NULL,
  zone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('whatsapp_phone', '5214421234567'),
  ('company_name', 'Terra Construction'),
  ('company_address', 'Av. Constituyentes 123, Centro, Querétaro, Qro. 76000'),
  ('company_phone', '442 123 4567'),
  ('company_email', 'contacto@terraconstruction.com'),
  ('company_hours', 'Lun - Vie: 9:00 - 18:00'),
  ('meta_title', 'Terra Construction | Casas en Querétaro y San Juan del Río'),
  ('meta_description', 'Encuentra tu casa ideal en Querétaro. Modelos desde $1,190,000 MXN. Créditos INFONAVIT, FOVISSSTE y bancarios.');
