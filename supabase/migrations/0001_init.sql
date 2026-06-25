-- ============================================================
-- Ospitalitta — schema 0001 (admin-MVP: venue · category · item)
-- Seed target: Saly. BB + Côte stay on static data (dual-mode read).
--
-- Pre-production: this file is destructive (drop + recreate) so it can be re-applied
-- cleanly while the model settles. Saly is reseeded after via `npm run seed`.
-- Once real data exists, switch to additive numbered migrations (0002, 0003, …).
--
-- Model notes:
--  - category is a 2-level tree (parent_id): top-level (parent null) = Drinks/Food, where
--    key = the section type ('cocktail'|'food'); children = bitter/sour/cold/pizza/…
--  - price is integer MINOR UNITS of venue.currency (Lek: 600; EUR 6.50 = 650). No 'L', no float.
--  - per-unit ('kg'/'100g') is its own column; badge is a flat label (→ markers taxonomy later).
-- ============================================================

drop table if exists menu_item cascade;
drop table if exists menu_category cascade;
drop table if exists menu_section cascade;   -- legacy name from the first 0001
drop table if exists venue cascade;

-- venues
create table venue (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  locales        text[] not null default '{en}',
  default_locale text not null default 'en',
  currency       text not null default 'ALL',   -- ISO 4217; venue-level (knows its decimals)
  brand          jsonb,          -- { themeAttr, stylesheet, fonts }
  onboarding     jsonb,          -- { pricesNote, welcome }
  config         jsonb,          -- { defaultCategory, drinksCategoryLabel, houseIndicator,
                                  --   showCocktailGuide, backgroundTheme, headerDecor, logoSrc, logoText }
  created_at     timestamptz default now()
);

-- categories (2-level tree via parent_id)
create table menu_category (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references venue(id) on delete cascade,
  parent_id   uuid references menu_category(id) on delete cascade,  -- null = top level (Drinks/Food)
  key         text not null,            -- top: 'cocktail'|'food'; child: 'bitter'|'cold'|'pizza'|...
  sort_order  int not null default 0,
  i18n        jsonb not null default '{}'::jsonb,  -- { en:{label,sub?,note?,badge?}, ... }
  created_at  timestamptz default now()
);
create index on menu_category(venue_id);
create index on menu_category(parent_id);

-- items
create table menu_item (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references venue(id) on delete cascade,           -- denormalized (C1): query + RLS
  category_id uuid not null references menu_category(id) on delete cascade,
  slug        text not null,
  price_minor integer,                  -- minor units of venue.currency (no currency, no float)
  price_unit  text,                     -- 'kg' | '100g' | null
  glass       text,
  lvl         int,
  flavor      text,
  loved       boolean default false,
  house       boolean default false,
  badge       text,                     -- flat label ('For 2'); → markers taxonomy later
  available   boolean not null default true,    -- 86 toggle
  image_url   text,                     -- still / video poster
  video_url   text,                     -- optional; plays over image_url poster
  portion     text,
  sort_order  int not null default 0,
  i18n        jsonb not null default '{}'::jsonb,  -- { en:{name,desc}, ... }
  created_at  timestamptz default now()
);
create index on menu_item(venue_id);
create index on menu_item(category_id);

-- RLS: public read (DEC-004); writes only via service_role (bypasses RLS)
alter table venue         enable row level security;
alter table menu_category enable row level security;
alter table menu_item     enable row level security;

create policy "public read venue"    on venue         for select using (true);
create policy "public read category" on menu_category for select using (true);
create policy "public read item"     on menu_item     for select using (true);
