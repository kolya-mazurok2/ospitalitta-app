# Schema & data rework — tracker

Living doc: everything we've decided to rework on the data layer, **why**, and **how to migrate**.
Started 2026-06-25 during the Supabase integration. Related memory: `project-supabase-integration`,
`project-taxonomy-badges-units`.

**Context:** schema `0001` is already applied and **Saly is seeded**. The DB is otherwise empty, so
most reworks below are cheapest done **now** (rewrite `0001` + `npm run seed`) rather than as `ALTER`
migrations later. Once real data exists, each becomes a numbered `000N` migration.

Status legend: 🟢 done · 🟡 apply now (decided) · 🔵 deferred (groundwork only) · ⚪ open question

---

## A · Reshape — APPLIED & VERIFIED 2026-06-25  🟢
0001 rewritten, Saly reseeded (2 top · 9 sub · 57 items), read round-trip confirmed live
(`bitter/cocktail`, `ostrike → L3000/kg`, badge column, foodFeaturedPick static merge). Items below
are now live.

### A1 · Price → minor units + currency on venue  🟡
**Why:** `price text = 'L600'` bakes presentation into the DB and blocks clean multi-currency. EUR has
cents → storing/▶converting as float corrupts money. Integer minor units are exact and EUR-ready.

**Current:** `menu_item.price text` (`'L600'`, `'L3000/kg'`). Guest parses the string.
**Target:**
- `menu_item.price_minor integer` — smallest unit of the venue currency (Lek `decimals=0` → `600`;
  EUR `decimals=2` → `6.50` = `650`).
- `venue.currency text` (ISO 4217, e.g. `ALL`). Currency knows its `decimals`; display divides by
  `10^decimals`.

**Migration:** seed writes `price_minor` (strip `L`, drop unit → A3). Read composes the legacy display
string (`L` + amount, + unit) so guest code is unchanged **for now**.
**Code impact (guest):** eventually refactor to numeric — `lib/locale.ts` `money()` /
`parsePriceDisplay()`, `lib/cart.ts` `parsePrice()`, `CartBar` "Lekë". Deferred (see B5).

### A2 · `menu_section` → `menu_category` + `parent_id`  🟡
**Why:** "section" is legacy naming from the BB prototype. Domain term is *category*. The 2-level tree
(Drinks/Food → bitter/sour…) should be one self-referencing table, not a `type` column.

**Current:** `menu_section(type 'cocktail'|'food', taste_key, …)` — flat; top-level lives in `type`.
**Target:** `menu_category(parent_id, key, sort_order, i18n, …)`:
- top-level rows (`parent_id null`) = Drinks/Food;
- children = bitter/sour / cold/warm / pizza…;
- `type` **dropped** — derived from the top-level ancestor at read time.
- `taste_key` → renamed `key` (it was always the section key, not only taste).

**Migration:** seed inserts 2 top-level categories per venue + children; `menu_item.category_id` →
child. Read assembles two levels, derives `MenuSection.type` from the top ancestor, splits into
`sections` (under Drinks) / `foodSections` (under Food).
**Code impact (guest):** `lib/menu-data.ts` `MenuSection`/`VenueMenuData`, `components/Menu.client.tsx`
(`sections`/`foodSections`, `section.key`, `type` checks), `lib/menu-repo.ts` reshape. Biggest refactor
of this batch.

### A3 · Drop `tags text[]` → explicit `price_unit`; keep `badge` column  🟡
**Why:** `tags text[]` is a junk-drawer; badge and per-unit are different concepts crammed together.
**Current:** `tags text[]` carries `'badge:For 2'`, `'unit:/kg'`; read parses them back.
**Target:** `menu_item.price_unit text` (`null | 'kg' | '100g'`) + `menu_item.badge text` (flat label).
**Migration:** seed writes the two columns directly; read drops `parseTags`, reads columns.
**Code impact:** `lib/menu-repo.ts` `parseTags`/`mapItem` only (internal).

### A4 · Keep `loved` / `house` as boolean columns (for now)  🟡
**Why deferred to columns:** owner chose simple columns for MVP; generalize to markers later (B1).
**Current/Target:** unchanged — `loved boolean`, `house boolean`. No work now.

---

## B · Deferred — groundwork laid, build later (non-structural / additive)

### B1 · Markers taxonomy (`loved` / `house` / `badge` → unified)  🔵
**Why:** these are all "markers shown on the card" — there can be more, named differently; what unites
them is the display slot. Hardcoded booleans + a `badge` column don't scale.
**Target:**
```sql
menu_item_marker ( item_id uuid, marker text, value text, primary key (item_id, marker) )
-- marker: 'loved' | 'house' | 'badge' | ...   value: 'For 2' for badge, null for flags
-- later: a `marker` definition table (render type + i18n label), optionally venue-scoped
```
**Migration when done:** backfill from `loved`/`house`/`badge` columns → marker rows; drop the columns;
read assembles markers per item. **Code impact:** `ItemCard`/`FeaturedPick` marker rendering.

### B2 · i18n jsonb → normalized `*_i18n` tables  🔵
**Why:** jsonb i18n is fine for read (cached, tiny, maps 1:1). Trigger to normalize = translation admin
needs completeness reports ("who lacks `it`"), concurrent per-locale edits without blob clobber, or
per-locale RLS.
**Migration when done:**
```sql
create table menu_item_i18n (item_id uuid, locale text, name text, "desc" text,
  primary key (item_id, locale));
insert into menu_item_i18n select id, key, value->>'name', value->>'desc'
  from menu_item, jsonb_each(i18n);
-- read reassembles identical shape via json_object_agg(locale, jsonb_build_object('name',name,'desc',desc))
-- drop column menu_item.i18n   (after dual-write window)
```
**Code impact:** none — `getPublishedMenu` returns the same `Record<locale,{…}>` shape. Same for
`menu_category_i18n`.

### B3 · Exchange rates / multi-currency display  🔵
**Why:** show a venue's prices in another currency. Additive — does **not** touch `price_minor`.
**Target:** `exchange_rate(from text, to text, rate numeric)` — `numeric`, never float. Convert:
`target_minor = round(price_minor × rate)`, rounded to the **target** currency's minor unit, in decimal
math. Build only when multi-currency is real. **Migration:** purely additive; no price migration.

### B4 · Venue extras → DB (`foodFeaturedPick`, `pairings`, `featuredPick`)  🔵
**Why:** currently merged from static `*-data.ts` at read time (one merge point in `getPublishedMenu`).
Saly uses `foodFeaturedPick`. **Migration when done:** model as table(s) or `venue.config` jsonb; swap
the static merge for a DB read. **Code impact:** `lib/menu-repo.ts` merge point only.

### B5 · Guest price code → numeric  🔵
**Why:** once `price_minor` + currency exist, the legacy `'L600'` string is only for the guest. Refactor
guest to consume `{ amount, currency }`. **Code impact:** `lib/locale.ts`, `lib/cart.ts`, `CartBar`,
`ItemCard`/`FoodCard`/`DetailSheet` price rendering. Until then the read composes the legacy string.

### B6 · Venue config read from DB  🔵
**Why:** `venue` table is seeded but `getVenue` still reads the static `venues` map. Move config
(brand/onboarding/config jsonb) read to DB when the admin edits venue settings. **Code impact:**
`lib/menu-repo.ts` `getVenue`.

---

## C · Open questions

### C1 · `menu_item.venue_id` — keep denormalized or drop?  ⚪
Redundant (derivable via `category → venue`). Kept for query convenience + future per-venue RLS (policy
checks `venue_id` without a join). Drop only if we want strict normalization. **Decision pending.**

---

## D · Not rework — forward build (admin-MVP, separate track)
`app/admin/**` (two-pane tree + editors), `lib/admin-repo.ts`, `lib/translate.ts` (claude-haiku),
`@dnd-kit`, Server Actions with `revalidateTag('venue:'+slug)`. Writes go through `supabaseAdmin()`
(service_role). Admin UI stays EN-only. See `project-supabase-integration`.

---

## Done so far  🟢
- `0001` schema (reshaped: `menu_category` tree, `price_minor`+currency, `price_unit`/`badge` columns);
  Saly seeded (2 top · 9 sub · 57 items). A1–A4 live.
- `getPublishedMenu` dual-mode (Saly → Supabase tagged fetch; rest static; static merge of extras);
  read converts DB shape → guest contract (type from top ancestor, price from minor units).
- `lib/supabase.ts` (service-role client), `scripts/seed-saly.ts`, `.env.local` wired.
