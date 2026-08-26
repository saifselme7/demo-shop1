-- SAIF STORE — Hero CMS
create extension if not exists "pgcrypto";

create table if not exists hero_content (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'THE ATELIER',
  title text not null default 'Garments for
the considered
life.',
  description text not null default 'A studied wardrobe of essential pieces — patterns refined across seasons, made in numbered editions, intended to endure.',
  primary_button_text text not null default 'BROWSE THE COLLECTION',
  primary_button_link text not null default '/shop',
  secondary_button_text text not null default 'THE ATELIER',
  secondary_button_link text not null default '/about',
  background_image_url text not null default 'https://images.unsplash.com/photo-1637248666370-70a4a603c23e?auto=format&fit=crop&w=2000&q=80',
  background_image_alt text default 'SAIF STORE AW Reserve',
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_hero_content_active on hero_content(is_active) where is_active = true;

drop trigger if exists set_updated_at_hero on hero_content;
create trigger set_updated_at_hero before update on hero_content for each row execute function handle_updated_at();

alter table hero_content enable row level security;

-- Public can SELECT active hero only
drop policy if exists "Public can read active hero" on hero_content;
create policy "Public can read active hero" on hero_content
  for select
  using (is_active = true);

-- Admin can read all
drop policy if exists "Admins can read all hero_content" on hero_content;
create policy "Admins can read all hero_content" on hero_content
  for select
  using (is_admin());

-- Admin write
drop policy if exists "Admins can insert hero_content" on hero_content;
create policy "Admins can insert hero_content" on hero_content
  for insert with check (is_admin());

drop policy if exists "Admins can update hero_content" on hero_content;
create policy "Admins can update hero_content" on hero_content
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete hero_content" on hero_content;
create policy "Admins can delete hero_content" on hero_content
  for delete using (is_admin());

-- Ensure only one active hero at a time via function and trigger
create or replace function ensure_single_active_hero()
returns trigger as $$
begin
  if new.is_active = true then
    update hero_content set is_active = false where id != new.id and is_active = true;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists single_active_hero_trigger on hero_content;
create trigger single_active_hero_trigger
  before insert or update on hero_content
  for each row
  execute function ensure_single_active_hero();

-- Seed initial hero
insert into hero_content (eyebrow, title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image_url, background_image_alt, is_active)
values (
  'THE ATELIER',
  'Garments for
the considered
life.',
  'A studied wardrobe of essential pieces — patterns refined across seasons, made in numbered editions, intended to endure.',
  'BROWSE THE COLLECTION',
  '/shop',
  'THE ATELIER',
  '/about',
  'https://images.unsplash.com/photo-1637248666370-70a4a603c23e?auto=format&fit=crop&w=2000&q=80',
  'SAIF STORE AW Reserve',
  true
) on conflict do nothing;

-- Storage bucket for hero images
insert into storage.buckets (id, name, public)
values ('hero-images', 'hero-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read hero-images" on storage.objects;
create policy "Public read hero-images" on storage.objects
  for select using (bucket_id = 'hero-images');

drop policy if exists "Admins can insert hero-images" on storage.objects;
create policy "Admins can insert hero-images" on storage.objects
  for insert with check (bucket_id = 'hero-images' and is_admin());

drop policy if exists "Admins can update hero-images" on storage.objects;
create policy "Admins can update hero-images" on storage.objects
  for update using (bucket_id = 'hero-images' and is_admin()) with check (bucket_id = 'hero-images' and is_admin());

drop policy if exists "Admins can delete hero-images" on storage.objects;
create policy "Admins can delete hero-images" on storage.objects
  for delete using (bucket_id = 'hero-images' and is_admin());
