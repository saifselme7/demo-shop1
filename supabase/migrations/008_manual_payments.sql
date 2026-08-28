-- SAIF STORE — Manual Payments (Cash on Delivery, InstaPay, Vodafone Cash)
-- Idempotent. Safe to re-run. Does not modify existing migrations destructively.

-- ============================================================
-- 1) Extend orders with manual-payment fields
-- ============================================================
alter table orders add column if not exists payment_proof_url      text;
alter table orders add column if not exists payment_proof_path     text;
alter table orders add column if not exists payment_reference      text;
alter table orders add column if not exists payment_reviewed_at    timestamptz;
alter table orders add column if not exists payment_reviewed_by    uuid;
alter table orders add column if not exists payment_rejection_reason text;

-- payment_status allowed values: pending | proof_submitted | approved | rejected | confirmed | failed
-- order_status remains separate: pending | confirmed | processing | shipped | delivered | rejected | cancelled
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'orders_payment_status_check') then
    alter table orders
      add constraint orders_payment_status_check
      check (payment_status in ('pending', 'proof_submitted', 'approved', 'rejected', 'confirmed', 'failed'));
  end if;
end $$;

create index if not exists idx_orders_payment_status on orders(payment_status);

-- ============================================================
-- 2) Payment settings (admin-managed configuration, public read)
-- ============================================================
create table if not exists payment_settings (
  id text primary key default 'default',
  cod_enabled            boolean not null default true,
  cod_label              text    not null default 'Cash on Delivery',
  cod_instructions       text    not null default 'Pay in cash when your order arrives. No payment proof is required.',

  instapay_enabled       boolean not null default true,
  instapay_label         text    not null default 'InstaPay',
  instapay_account       text    not null default 'saifstore@instapay',
  instapay_account_name  text    not null default 'SAIF STORE',
  instapay_instructions  text    not null default 'This is a manual InstaPay transfer. Send the exact order amount to the InstaPay address above, take a screenshot of the completed transfer, then upload it as payment proof.',

  vodafone_enabled       boolean not null default true,
  vodafone_label         text    not null default 'Vodafone Cash',
  vodafone_number        text    not null default '01040324811',
  vodafone_account_name  text    not null default 'SAIF STORE',
  vodafone_instructions  text    not null default 'This is a manual Vodafone Cash transfer. Transfer the exact order amount to the Vodafone Cash number above from your Vodafone Cash wallet, take a screenshot of the confirmation screen, then upload it as payment proof.',

  updated_at             timestamptz default now()
);

-- Seed a single default row (Vodafone Cash number is the business number;
-- InstaPay address is a placeholder admins can update in the payment settings.)
insert into payment_settings (id) values ('default') on conflict (id) do nothing;

drop trigger if exists set_updated_at_payment_settings on payment_settings;
create trigger set_updated_at_payment_settings
  before update on payment_settings
  for each row execute function handle_updated_at();

alter table payment_settings enable row level security;

-- Public may READ the payment configuration
drop policy if exists "Public can read payment_settings" on payment_settings;
create policy "Public can read payment_settings" on payment_settings
  for select
  using (true);

-- Admins may manage payment settings
drop policy if exists "Admins can read payment_settings" on payment_settings;
create policy "Admins can read payment_settings" on payment_settings
  for select
  using (is_admin());

drop policy if exists "Admins can insert payment_settings" on payment_settings;
create policy "Admins can insert payment_settings" on payment_settings
  for insert
  with check (is_admin());

drop policy if exists "Admins can update payment_settings" on payment_settings;
create policy "Admins can update payment_settings" on payment_settings
  for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "Admins can delete payment_settings" on payment_settings;
create policy "Admins can delete payment_settings" on payment_settings
  for delete
  using (is_admin());

-- ============================================================
-- 3) Payment proofs storage bucket (PRIVATE — not publicly browsable)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false;

-- Upload policies: anyone placing an order may upload their proof into
-- the "proofs/" folder. Files are keyed by customer-supplied unique path.
drop policy if exists "Public can upload payment proofs" on storage.objects;
create policy "Public can upload payment proofs" on storage.objects
  for insert
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = 'proofs'
  );

-- Read policies: only admins can view/download proofs (uses a signed URL
-- generated through the admin app). Anonymous users cannot list or fetch.
drop policy if exists "Admins can read payment proofs" on storage.objects;
create policy "Admins can read payment proofs" on storage.objects
  for select
  using (
    bucket_id = 'payment-proofs'
    and is_admin()
  );

-- Admins may delete proofs
drop policy if exists "Admins can delete payment proofs" on storage.objects;
create policy "Admins can delete payment proofs" on storage.objects
  for delete
  using (
    bucket_id = 'payment-proofs'
    and is_admin()
  );

-- ============================================================
-- 4) Harden orders INSERT policy
--    Customers may create orders, but must not set reviewed/admin-only
--    fields or tamper with order_status / payment_status beyond the
--    values the checkout flow legitimately sets.
-- ============================================================
drop policy if exists "Public can insert orders" on orders;
create policy "Public can insert orders" on orders
  for insert
  with check (
    order_status = 'pending'
    and payment_status in ('pending', 'proof_submitted')
    and payment_reviewed_at is null
    and payment_reviewed_by is null
    and payment_rejection_reason is null
  );

-- All payment review / order confirmation mutations go through the
-- existing admin-only update policy ("Admins can update orders"),
-- so anonymous users can never approve/reject payments or confirm orders.

-- Helper to record a payment review (admin-only). Keeps reviewed_by /
-- reviewed_at consistent. Definer is safe because is_admin() is enforced
-- inside the function.
create or replace function review_order_payment(
  p_order_id uuid,
  p_approved boolean,
  p_rejection_reason text default null
)
returns orders as $$
declare
  result orders;
begin
  if not is_admin() then
    raise exception 'Not authorized';
  end if;

  update orders
     set payment_status = case when p_approved then 'approved' else 'rejected' end,
         payment_rejection_reason = case when p_approved then null else coalesce(p_rejection_reason, 'Payment proof could not be verified.') end,
         payment_reviewed_at = now(),
         payment_reviewed_by = auth.uid(),
         updated_at = now()
   where id = p_order_id
  returning * into result;

  return result;
end;
$$ language plpgsql security definer;
