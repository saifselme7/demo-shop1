-- SAIF STORE — Storage bucket for product images
-- Create bucket product-images public
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects (already enabled by Supabase, but ensure)
-- Policies for public read
drop policy if exists "Public read product-images" on storage.objects;
create policy "Public read product-images" on storage.objects
  for select
  using (bucket_id = 'product-images');

-- Admin write policies
drop policy if exists "Admins can insert product-images storage" on storage.objects;
create policy "Admins can insert product-images storage" on storage.objects
  for insert
  with check (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins can update product-images storage" on storage.objects;
create policy "Admins can update product-images storage" on storage.objects
  for update
  using (bucket_id = 'product-images' and is_admin())
  with check (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins can delete product-images storage" on storage.objects;
create policy "Admins can delete product-images storage" on storage.objects
  for delete
  using (bucket_id = 'product-images' and is_admin());
