-- Referrer KYC, bank reference and commission payment profile
-- Applied to Supabase project zeiesuikwjbxzcvehbkj.

create table if not exists public.referrer_documents (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referrers(id) on delete cascade,
  document_type text not null check (document_type in ('identity_document','bank_reference','proof_of_address','tax_document','corporate_document','other')),
  file_name text not null,
  storage_path text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  review_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.referrer_payment_accounts (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referrers(id) on delete cascade,
  account_holder_name text not null,
  bank_name text not null,
  bank_country text not null,
  account_number_last4 text,
  iban text,
  swift_bic text,
  routing_number text,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  verified_by uuid,
  verified_at timestamptz,
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The live project also has RLS policies, private storage bucket referrer-kyc,
-- and the approval/review RPCs documented by this migration.
