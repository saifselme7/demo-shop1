-- Fix admin_users RLS recursion
-- The previous policies used EXISTS (select from admin_users) inside admin_users policies, causing recursion
-- Use simple self-check for select, and is_admin() for writes (security definer bypasses RLS)

-- Recreate admin_users policies without self-reference recursion
drop policy if exists "Admin users can read admin_users" on admin_users;
-- Allow users to read their own admin row, and allow is_admin() to read all (via security definer)
create policy "Admin users can read own admin row" on admin_users
  for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can read all admin_users" on admin_users;
create policy "Admins can read all admin_users" on admin_users
  for select
  using (is_admin());

drop policy if exists "Admins can insert admin_users" on admin_users;
create policy "Admins can insert admin_users" on admin_users
  for insert
  with check (is_admin());

drop policy if exists "Admins can delete admin_users" on admin_users;
create policy "Admins can delete admin_users" on admin_users
  for delete
  using (is_admin());

-- Ensure is_admin function is stable and handles no auth
create or replace function is_admin()
returns boolean as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    return false;
  end if;
  return exists (select 1 from admin_users where user_id = uid);
end;
$$ language plpgsql security definer stable;

-- Re-apply admin write policies using is_admin() to ensure they work
-- Categories
drop policy if exists "Admins can insert categories" on categories;
create policy "Admins can insert categories" on categories for insert with check (is_admin());
drop policy if exists "Admins can update categories" on categories;
create policy "Admins can update categories" on categories for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete categories" on categories;
create policy "Admins can delete categories" on categories for delete using (is_admin());

-- Collections
drop policy if exists "Admins can insert collections" on collections;
create policy "Admins can insert collections" on collections for insert with check (is_admin());
drop policy if exists "Admins can update collections" on collections;
create policy "Admins can update collections" on collections for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete collections" on collections;
create policy "Admins can delete collections" on collections for delete using (is_admin());

-- Products
drop policy if exists "Admins can insert products" on products;
create policy "Admins can insert products" on products for insert with check (is_admin());
drop policy if exists "Admins can update products" on products;
create policy "Admins can update products" on products for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete products" on products;
create policy "Admins can delete products" on products for delete using (is_admin());

-- Product Images
drop policy if exists "Admins can insert product_images" on product_images;
create policy "Admins can insert product_images" on product_images for insert with check (is_admin());
drop policy if exists "Admins can update product_images" on product_images;
create policy "Admins can update product_images" on product_images for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete product_images" on product_images;
create policy "Admins can delete product_images" on product_images for delete using (is_admin());

-- Product Variants
drop policy if exists "Admins can insert product_variants" on product_variants;
create policy "Admins can insert product_variants" on product_variants for insert with check (is_admin());
drop policy if exists "Admins can update product_variants" on product_variants;
create policy "Admins can update product_variants" on product_variants for update using (is_admin()) with check (is_admin());
drop policy if exists "Admins can delete product_variants" on product_variants;
create policy "Admins can delete product_variants" on product_variants for delete using (is_admin());
