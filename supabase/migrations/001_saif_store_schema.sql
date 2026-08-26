-- SAIF STORE — Supabase Schema
-- Enable extensions
create extension if not exists "pgcrypto";

-- Categories
create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Collections
create table if not exists collections (
  id text primary key,
  name text not null,
  slug text not null unique,
  subtitle text,
  description text,
  image_url text,
  pieces int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products
create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  subtitle text,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  currency text default '€',
  category_id text references categories(id) on delete set null,
  collection_id text references collections(id) on delete set null,
  featured boolean default false,
  is_new boolean default false,
  details jsonb default '[]'::jsonb,
  sizes jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product Images
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Product Variants
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  color_name text not null,
  color_hex text not null,
  size text not null,
  sku text not null,
  stock int not null default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(product_id, color_name, size)
);

-- Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_collection on products(collection_id);
create index if not exists idx_products_featured on products(featured) where featured = true;
create index if not exists idx_products_is_new on products(is_new) where is_new = true;
create index if not exists idx_product_images_product on product_images(product_id);
create index if not exists idx_product_images_sort on product_images(product_id, sort_order);
create index if not exists idx_product_variants_product on product_variants(product_id);
create index if not exists idx_product_variants_sku on product_variants(sku);
create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_collections_slug on collections(slug);

-- Updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_categories on categories;
create trigger set_updated_at_categories before update on categories for each row execute function handle_updated_at();

drop trigger if exists set_updated_at_collections on collections;
create trigger set_updated_at_collections before update on collections for each row execute function handle_updated_at();

drop trigger if exists set_updated_at_products on products;
create trigger set_updated_at_products before update on products for each row execute function handle_updated_at();

drop trigger if exists set_updated_at_variants on product_variants;
create trigger set_updated_at_variants before update on product_variants for each row execute function handle_updated_at();

-- Enable RLS
alter table categories enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;

-- Policies — public read-only
drop policy if exists "Allow public read categories" on categories;
create policy "Allow public read categories" on categories for select using (true);

drop policy if exists "Allow public read collections" on collections;
create policy "Allow public read collections" on collections for select using (true);

drop policy if exists "Allow public read products" on products;
create policy "Allow public read products" on products for select using (true);

drop policy if exists "Allow public read product_images" on product_images;
create policy "Allow public read product_images" on product_images for select using (true);

drop policy if exists "Allow public read product_variants" on product_variants;
create policy "Allow public read product_variants" on product_variants for select using (true);

-- No write policies for anon — admin will be added later with auth
