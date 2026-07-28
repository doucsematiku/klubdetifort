/**
 * Vytvoří tabulky pro rezervace prohlídek v Supabase projektu fort-klub.
 * Spuštění:  node scripts/setup-supabase-schema.mjs
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_REF = "azzjtgwlqthimtkolfgt";

const pat = readFileSync(
  join(process.env.HOME || process.env.USERPROFILE, "AppData/Roaming/supabase/access-token"),
  "utf-8"
).trim();

const SQL = `
-- ===== Rezervace prohlídek =====
create table if not exists public.prohlidky_rezervace (
  id              bigserial primary key,
  slot_id         text not null unique,           -- "2026-06-09T14:00"
  slot_date       date not null,
  slot_start      time not null,
  slot_end        time not null,
  parent_name     text not null,
  email           text not null,
  phone           text not null,
  children_info   text not null,
  children_count  smallint not null check (children_count between 1 and 20),
  calendar_event_id text,
  created_at      timestamptz not null default now(),
  user_agent      text,
  ip              text
);

comment on table public.prohlidky_rezervace is 'Hlavní rezervace prohlídek areálu Klub Fořt — pouze server-side insert přes service role';
create index if not exists prohlidky_rezervace_created_at_idx on public.prohlidky_rezervace (created_at desc);
create index if not exists prohlidky_rezervace_slot_date_idx on public.prohlidky_rezervace (slot_date);

alter table public.prohlidky_rezervace enable row level security;
-- žádné RLS policies → klient (anon role) NEMÁ žádný přístup. Zapisuje jen server přes service_role.

-- ===== Alternativní termíny =====
create table if not exists public.prohlidky_alternativy (
  id              bigserial primary key,
  parent_name     text not null,
  email           text not null,
  phone           text not null,
  children_info   text not null,
  children_count  smallint not null check (children_count between 1 and 20),
  navrhy          jsonb not null,                 -- [{datum, cas_od, cas_do}, …]
  poznamka        text default '',
  created_at      timestamptz not null default now(),
  user_agent      text,
  ip              text
);

comment on table public.prohlidky_alternativy is 'Alternativní návrhy termínů prohlídek — pouze server-side insert přes service role';
create index if not exists prohlidky_alternativy_created_at_idx on public.prohlidky_alternativy (created_at desc);

alter table public.prohlidky_alternativy enable row level security;
`.trim();

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: SQL }),
  }
);
const body = await res.text();
console.log("HTTP", res.status);
console.log(body || "(empty)");

if (!res.ok) process.exit(1);

console.log("\n=== Ověření ===");
const verifyRes = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query:
        "select table_name from information_schema.tables where table_schema='public' and table_name like 'prohlidky_%' order by table_name;",
    }),
  }
);
console.log(await verifyRes.text());
