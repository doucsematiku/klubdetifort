-- Víkendové přespávačky — registrace z marketing webu (klubdetifort.cz/prespavky).
-- Aplikováno na Supabase fort-klub (azzjtgwlqthimtkolfgt) přes Management API 20. 8. 2026.
-- Web k tabulce přistupuje výhradně service_role klíčem (žádné RLS policies = veřejný
-- přístup nula). Sloupec acks loguje odsouhlasené podmínky účasti (klíče z
-- src/lib/prespavky.ts), acks_at čas souhlasu — na přání vedení se archivuje v DB.
create table if not exists public.prespavky_registrace (
  id uuid primary key default gen_random_uuid(),
  termin_id text not null,
  blok text not null check (blok in ('vikend','noc','dvadny','sobota','nedele')),
  rodic_jmeno text not null,
  email text not null,
  telefon text not null,
  dite_jmeno text not null,
  dite_vek smallint,
  poznamka text,
  cena_kc integer not null,
  acks jsonb not null,
  acks_at timestamptz not null default now(),
  gdpr boolean not null default true,
  ip text,
  user_agent text,
  fakturoid_custom_id text unique,
  fakturoid_invoice_number text,
  fakturoid_invoice_url text,
  status text not null default 'nova'
    check (status in ('nova','zaplaceno','zruseno')),
  paid_on date,
  created_at timestamptz not null default now()
);

create index if not exists prespavky_registrace_termin_idx
  on public.prespavky_registrace (termin_id) where status <> 'zruseno';

alter table public.prespavky_registrace enable row level security;
-- Žádné policies: číst a zapisovat smí jen service_role (API marketing webu).
