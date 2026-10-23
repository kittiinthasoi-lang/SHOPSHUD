-- SHOPSHUD single-owner product catalog.
-- Apply this migration to the configured PostgreSQL database before starting catalog routes.
CREATE TABLE IF NOT EXISTS shopshud_products (
  id uuid PRIMARY KEY,
  title varchar(180) NOT NULL,
  description text NOT NULL,
  category varchar(80) NOT NULL,
  price_minor integer NOT NULL CHECK (price_minor >= 0),
  currency varchar(3) NOT NULL DEFAULT 'THB',
  rights_model varchar(32) NOT NULL CHECK (rights_model IN ('file_sale','usage_license','copyright_transfer')),
  rights_terms text NOT NULL,
  preview_url text,
  asset_object_key text,
  asset_verified boolean NOT NULL DEFAULT false,
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','paused')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'published' OR (asset_object_key IS NOT NULL AND asset_verified = true))
);
CREATE INDEX IF NOT EXISTS shopshud_products_public_idx
  ON shopshud_products (published_at DESC, created_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS shopshud_products_status_idx ON shopshud_products (status, updated_at DESC);
