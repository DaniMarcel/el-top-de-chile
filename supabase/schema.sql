-- ============================================================
-- EL TRONO — schema para Supabase (Postgres)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create table if not exists categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  description text default '',
  active integer default 1
);

create table if not exists stores (
  id serial primary key,
  slug text unique not null,
  name text not null,
  url text not null,
  logo_url text default '',
  pitch text default '',
  category_id integer not null references categories(id),
  position integer,
  current_price integer,
  verified integer default 0,
  is_demo integer default 0,
  times_claimed integer default 0,
  created_at timestamptz default now(),
  claimed_at timestamptz
);

create table if not exists transactions (
  id serial primary key,
  store_id integer not null references stores(id),
  category_id integer not null references categories(id),
  amount_clp integer not null,
  status text default 'pending',
  flow_order text unique,
  prev_king_id integer references stores(id),
  payer_email text default '',
  created_at timestamptz default now(),
  paid_at timestamptz
);

create table if not exists visits (
  id bigserial primary key,
  ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_stores_cat_pos on stores(category_id, position);
create index if not exists idx_tx_status on transactions(status);
create index if not exists idx_visits_created on visits(created_at);

-- ============================================================
-- Seed: categorías (las tiendas demo se siembran con `npm run seed`
-- apuntando DATABASE_URL a esta base)
-- ============================================================
insert into categories (slug, name, description) values
  ('suplementos', 'Suplementos y Nutrición', 'Proteínas, creatina y todo para el gym.'),
  ('ropa', 'Ropa y Moda', 'Marca chilena, moda local.'),
  ('sneakers', 'Sneakers', 'Zapatillas: las que se pelean en cada drop.'),
  ('tecnologia', 'Tecnología', 'Computación, consolas y gadgets.'),
  ('cafe', 'Café y Tostadores', 'Café de especialidad, tostado en Chile.'),
  ('belleza', 'Belleza', 'Cosmética, skincare y cuidado personal.'),
  ('mascotas', 'Mascotas', 'Todo para tus hijos de cuatro patas.'),
  ('gaming', 'Gaming', 'Periféricos, consolas y setups.')
on conflict (slug) do nothing;
