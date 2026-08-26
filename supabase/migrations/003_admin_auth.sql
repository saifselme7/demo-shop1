-- SAIF STORE — Admin Auth & Authorization
-- Create admin_users table
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

create index if not exists idx_admin_users_user_id on admin_users(user_id);

alter table admin_users enable row level security;

-- Admin users can read their own admin status
drop policy if exists "Admin users can read admin_users" on admin_users;
create policy "Admin users can read admin_users" on admin_users
  for select
  using (auth.uid() = user_id or exists (select 1 from admin_users where user_id = auth.uid()));

-- Only existing admins can insert new admins (bootstrap: first admin must be inserted manually via service_role or dashboard)
drop policy if exists "Admins can insert admin_users" on admin_users;
create policy "Admins can insert admin_users" on admin_users
  for insert
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete admin_users" on admin_users;
create policy "Admins can delete admin_users" on admin_users
  for delete
  using (exists (select 1 from admin_users where user_id = auth.uid()));

-- Helper function to check if current user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (select 1 from admin_users where user_id = auth.uid());
end;
$$ language plpgsql security definer;

-- Admin write policies for categories
drop policy if exists "Admins can insert categories" on categories;
create policy "Admins can insert categories" on categories
  for insert with check (is_admin());

drop policy if exists "Admins can update categories" on categories;
create policy "Admins can update categories" on categories
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete categories" on categories;
create policy "Admins can delete categories" on categories
  for delete using (is_admin());

-- Admin write policies for collections
drop policy if exists "Admins can insert collections" on collections;
create policy "Admins can insert collections" on collections
  for insert with check (is_admin());

drop policy if exists "Admins can update collections" on collections;
create policy "Admins can update collections" on collections
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete collections" on collections;
create policy "Admins can delete collections" on collections
  for delete using (is_admin());

-- Admin write policies for products
drop policy if exists "Admins can insert products" on products;
create policy "Admins can insert products" on products
  for insert with check (is_admin());

drop policy if exists "Admins can update products" on products;
create policy "Admins can update products" on products
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete products" on products;
create policy "Admins can delete products" on products
  for delete using (is_admin());

-- Admin write policies for product_images
drop policy if exists "Admins can insert product_images" on product_images;
create policy "Admins can insert product_images" on product_images
  for insert with check (is_admin());

drop policy if exists "Admins can update product_images" on product_images;
create policy "Admins can update product_images" on product_images
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete product_images" on product_images;
create policy "Admins can delete product_images" on product_images
  for delete using (is_admin());

-- Admin write policies for product_variants
drop policy if exists "Admins can insert product_variants" on product_variants;
create policy "Admins can insert product_variants" on product_variants
  for insert with check (is_admin());

drop policy if exists "Admins can update product_variants" on product_variants;
create policy "Admins can update product_variants" on product_variants
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete product_variants" on product_variants;
create policy "Admins can delete product_variants" on product_variants
  for delete using (is_admin());
