# Ospitalitta — Architecture & Decisions

## ⛳ Read first (every session)
Прогнати запит через диспетчер тригерів **[`PLAYBOOK.md`](PLAYBOOK.md)** (патерн у промпті → дія; питає лише якщо неоднозначно/руйнівно; чекліст стану = `STATUS.md`). Архітектурні рішення — нижче.

## What this is
Multi-tenant Digital Waiter platform. Venues (restaurants, bars) get a guest-facing mobile menu
at `/venue/[slug]`. Guest scans QR at the table → browses menu → builds a cart → shows screen
to the waiter. No orders fly to a kitchen. No real-time. No guest login.

Current live client: **Bottle Brothers (BB)** at `/venue/bottle-brothers`.
Design handoff lives in `~/Downloads/design_handoff_bb_menu_mobile/` — README.md is the spec,
`BB Menu Mobile v2.dc.html` is the canonical prototype with all data/logic.

---

## Stack (fixed)
- **Framework**: Next.js 14 App Router, TypeScript strict
- **Styling**: Tailwind v4 CSS-first (`@theme inline`) + CSS custom properties for theming
- **Database**: Supabase (Postgres + Storage + Auth)
- **Hosting**: Vercel Hobby (free) — edge runtime for public read, Node.js for admin/write
- **No PWA** — speed via edge-SSR + fetch cache. PWA goes on the future waiter/owner app only.

---

## Architecture Decisions (DEC)

### DEC-001 · No orders, cart in sessionStorage
Cart is show-to-waiter only. Nothing goes to a kitchen. No statuses, no real-time.
`sessionStorage['osp_cart_${slug}'] = { items, ts }`. TTL = 2 hours: if `Date.now()-ts > 7200000`
on load → clear. No table ID in URL (nothing to attach to). QR leads directly to `/venue/[slug]`.

### DEC-002 · No PWA
No service worker, no install prompt on the guest menu.
PWA enabled later on the waiter/owner app only.

### DEC-003 · `/venue/[slug]` routing
Public URL: `/venue/bottle-brothers` — never the raw `venue_id`.
On slug rename: 301 redirect from old slug. `venue_id` lives in DB only, never in URL.
`venue` namespace prevents collisions with `/`, `/privacy`, etc.

### DEC-004 · Menu = published document, force-dynamic page + cached data
`getPublishedMenu(slug)` is a tagged `fetch` to Supabase PostgREST:
```ts
fetch(`${SUPABASE_URL}/rest/v1/...`, {
  headers: { apikey: SUPABASE_ANON_KEY },
  next: { tags: [`venue:${slug}`] },
})
```
On menu edit (admin server action): `revalidateTag('venue:' + slug)` — invalidates cache.
Menu page itself is `force-dynamic` (headers() call for Accept-Language opts it out automatically).
HTML renders per-request on edge (cheap — data already in fetch cache). Zero live DB on QR scan.
RLS stays for write paths (admin editing menu). Not used for public read.

**Note**: `revalidateTag` is Vercel Data Cache — Vercel-specific. Future migration path when ready:
publish menu as static JSON to Supabase Storage/GCS and fetch from CDN. `getPublishedMenu`
interface stays identical, only the implementation swaps.

**During static-data phase** (before Supabase): `getPublishedMenu` just imports from
`lib/menu-data.ts`. No fetch, no tags, page can be static. Wire Supabase separately.

### DEC-005 · Edge for read, Node for write
- Public venue pages: `export const runtime = 'edge'`
- `getPublishedMenu` uses `fetch()` to PostgREST — works on edge
- Admin / server actions / write: Node.js + Supabase JS client + RLS
- `unstable_cache` is Node-only — never use on the public read path (silent no-op on edge)

### DEC-006 · Dynamic theme + fonts via `<link>` in venue layout
`next/font` bundles all fonts at build time — not used for venue fonts.
Each venue record carries a brand manifest:
```ts
venue.brand = {
  themeAttr: 'bottle-brothers',
  stylesheet: '/themes/bottle-brothers.css',   // scoped to [data-venue="bottle-brothers"]
  fonts: [
    { family: 'Marcellus', href: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap' },
    { family: 'Jost', href: 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap' },
  ],
}
```
Venue layout loads only this venue's stylesheet + fonts via `<link>`.
Guest at BB gets Marcellus+Jost only. Guest at another venue gets their fonts only.
`generateMetadata` in the same layout sets title/og/theme-color per venue.

### DEC-007 · Token system — 3 layers, Tailwind on semantic level only
Three layers (pattern from `tokens/bb-theme.css`):
1. **Primitives** — raw hex values per venue (`--bb-cream`, `--bb-olive-logo`…)
2. **Semantic / alias** — role names, the shared contract (`--surface`, `--ink`, `--brand`…),
   scoped to `[data-venue="…"]` in the venue stylesheet
3. **Component** — local per-component (`--sheet-radius`, `--fab-bg`…)

Global `globals.css` maps semantic roles into Tailwind via `@theme inline` (inline = utilities
compile to `var(--color-surface)`, not a baked hex — so runtime `[data-venue]` overrides work):
```css
@theme inline {
  --color-surface:       var(--surface);
  --color-surface-card:  var(--surface-card);
  --color-surface-frame: var(--surface-frame);
  --color-surface-dark:  var(--surface-dark);
  --color-surface-dark-2: var(--surface-dark-2);
  --color-ink:           var(--ink);
  --color-ink-heading:   var(--ink-heading);
  --color-ink-body:      var(--ink-body);
  --color-on-dark:       var(--on-dark);
  --color-on-dark-2:     var(--on-dark-2);
  --color-brand:         var(--brand);
  --color-brand-on-dark: var(--brand-on-dark);
  --color-brand-bright:  var(--brand-bright);
  --color-hairline:      var(--hairline);
  --color-line:          var(--line);
  --color-ink-faint:     var(--ink-faint);
}
```
`bg-surface`, `text-ink`, `text-brand`, `border-hairline` etc. pick up runtime overrides.

**Mapping stops at semantic level.** Component-level tokens (radii, scrim, one-off values) are
consumed via `style={{ borderRadius: 'var(--sheet-radius)' }}` — not mapped into @theme.
Per-venue `<link>` stylesheets contain ONLY level-1 primitives + level-2 semantic vars under
`[data-venue="…"]`. No `@theme` in venue files.

### DEC-008 · i18n — two separate systems
**A. UI chrome** (tabs, buttons, legend, "Show your waiter", category labels, taste names):
→ `next-intl`. `messages/en.json`, `sq.json`, `it.json`. Keys like `cart.showWaiter`, `legend.title`.
→ Ospitalitta-level, same for all venues.

**B. Menu content** (item names, descriptions, pairing wisdom/why, section sub-headings, notices):
→ Data layer. `item.i18n: { en: { name, desc }, sq: { … } }`.
→ Venue-level. Translations are venue data, not repo catalog.
→ Translatable fields: `name`, `desc`, `wisdom`, `why`, `sub`, notice text.
→ Non-translatable (flat): `price`, `glass`, `lvl`, `loved`, `house`, `flavor`.

**Test**: Would another venue phrase this differently? → data. Same for all venues? → next-intl.

### DEC-009 · Locale resolution — no URL routing
`next-intl` middleware NOT used. No locale in URL.
Locale resolved once in venue layout:
```
cookie (set by language picker server action)
  → Accept-Language header
  → validated against venue.locales
  → fallback to venue.locales[0]
```
Flows as `locale: string` prop to RSC children + `NextIntlClientProvider` for client.
`generateMetadata` and other detached server fns call `getLocale()` independently (two call-sites
is acceptable — `getVenue` is a cached fetch so the second call is free).

Language picker: client component → Server Action sets cookie → `router.refresh()` to re-render
server content in new locale. Optimistic client state for instant visual feedback while refresh runs.

`countryTaste` (tab order) is separate from language:
Region from `Accept-Language` (e.g. `pl-PL` → PL → `sweet` lead) computed server-side, passed
as `leadTaste` prop. PL/GB → sweet · IT/DE → bitter · FR/NO → sour · else → bitter.
This is about tab ORDER only, not about displayed language.

### DEC-010 · Data shape — i18n-first from day one
```ts
interface MenuItem {
  id: string
  slug: string
  price: string          // 'L500' — flat, not translated
  glass: GlassType       // flat
  lvl?: 1 | 2 | 3       // flat (undefined for spicy)
  flavor?: 'sweet'|'sour' // zero items only, flat
  loved?: boolean        // flat
  house?: boolean        // flat
  i18n: Record<string, { name: string; desc: string }>
}

interface PairingEntry {
  cocktailRef: string    // stable item slug
  dishes: Array<{ itemRef: string; price: string }>
  i18n: Record<string, { wisdom: string }>
}

interface FoodPairingEntry {
  dishRef: string
  cocktailRefs: string[]
  i18n: Record<string, { why: string }>
}
```

`pickLocale` — single source of truth for fallback:
```ts
function pickLocale<T>(i18n: Record<string, T>, locale: string, fallback = 'en'): T {
  return i18n[locale] ?? i18n[fallback] ?? i18n[Object.keys(i18n)[0]]
}
```

### DEC-011 · Featured pick (Brothers recommend plaque)
```ts
interface FeaturedPick {
  cocktailRef: string   // slug of promoted cocktail
  i18n?: Record<string, { desc?: string }>  // optional editorial override
}
```
`taste`, `n`, `glass`, `price`, `house` always derived from `cocktailIndex[cocktailRef]` at
render time. No duplication, no divergence.

**Tap behavior**: does NOT open the detail sheet. Scrolls to the cocktail's card in the list.
If the cocktail is in a different taste section than the active tab → switch tab first, then scroll.
Each cocktail card has `id="item-{slug}"` for scroll targeting.
Dismiss (×) hides the plaque until page reload (`pickDismissed` state, not persisted).

### DEC-012 · FramedPlaque — reusable wrapper
Both the Brothers recommend plaque and the Pizza note share the same visual frame:
`background: var(--surface-frame)`, `border: 1px solid var(--hairline)`, sharp corners.

```
FramedPlaque (wrapper — styling only)
  ├── FeaturedPick (glass glyph + desc + TasteMark + name + price + dismiss)
  └── PizzaNote (clock icon + "Made to order…" text)
```

Pattern is reusable for any future operational or promotional notice.

### DEC-013 · Glass coupe fix
Both lines change together — changing only one creates a double-render bug:
```ts
// Glass.tsx
isMartini: type === 'martini',   // was: type === 'martini' || type === 'coupe'
isCoupe:   type === 'coupe',     // was: false
```

### DEC-014 · Dead prototype state — do not port
`scrolled` state and `chipPad` computation exist in the prototype but `chipPad` is never
referenced in the template. Do not port. Drop both.

### DEC-015 · Cart namespace
`sessionStorage` key is venue-scoped: `osp_cart_${slug}`. Prevents cross-venue collision if
a guest visits two venues in the same browser session.

---

## Data Model

### V1 (current)
```
organization                    -- chain / network of venues
  id            uuid PK
  name          text
  slug          text UNIQUE
  brand_attr    text            -- shared [data-venue] value
  stylesheet    text            -- '/themes/xyz.css'
  font_links    jsonb           -- [{ family, href }]
  default_locale text           -- 'en'

venue
  id            uuid PK
  slug          text UNIQUE
  org_id        uuid FK?        -- null = independent venue
  name          text
  locales       text[]          -- ['en','sq','it']
  brand_attr    text            -- overrides org if set
  stylesheet    text
  font_links    jsonb
  default_locale text

menu_section
  id            uuid PK
  venue_id      uuid FK
  type          text            -- 'cocktail' | 'food'
  taste_key     text            -- 'bitter'|'sour'|'sweet'|'spicy'|'zero'|'pizza'|'burgers'|'sharing'
  sort_order    int
  i18n          jsonb           -- { en: { label, sub }, sq: { … } }

menu_item
  id            uuid PK
  venue_id      uuid FK
  section_id    uuid FK
  slug          text
  price         text
  glass         text
  lvl           int
  flavor        text            -- zero items: 'sweet'|'sour'
  loved         boolean
  house         boolean
  sort_order    int
  i18n          jsonb           -- { en: { name, desc }, sq: { … } }

pairing                         -- cocktail → 3 dishes
  id            uuid PK
  venue_id      uuid FK
  cocktail_id   uuid FK
  dish_id       uuid FK
  sort_order    int
  i18n          jsonb           -- { en: { wisdom }, sq: { … } }

food_pairing                    -- dish → 3 cocktails
  id            uuid PK
  venue_id      uuid FK
  dish_id       uuid FK
  cocktail_id   uuid FK
  sort_order    int
  i18n          jsonb           -- { en: { why }, sq: { … } }

featured_pick
  id            uuid PK
  venue_id      uuid FK UNIQUE
  cocktail_id   uuid FK
  i18n          jsonb           -- { en: { desc? } } optional editorial override
```

---

## File Structure
```
app/
  venue/[slug]/
    layout.tsx              server: load venue → brand <link>s → data-venue attr → locale
    menu/
      page.tsx              server: getPublishedMenu → pass to client island
      Menu.client.tsx       "use client" — all interactive state (tabs, sheets, cart)

components/
  FramedPlaque.tsx          cream frame + olive border wrapper
  FeaturedPick.tsx          Brothers recommend plaque (→ scroll, not open)
  PizzaNote.tsx             "Made to order" operational notice
  Glass.tsx                 5 SVG silhouettes (collins/rocks/martini/wine/coupe)
  TasteMark.tsx             bitter/sour/sweet × 1-3 marks + single mode
  ItemCard.tsx              cocktail card (media zone + body)
  FoodCard.tsx              food card (name/price + desc/add)
  DetailSheet.tsx           60% bottom sheet (pairing + item + FAB)
  CartBar.tsx               floating dark bar
  ListSheet.tsx             waiter sheet (stepper + total + "While you wait")
  LegendSheet.tsx           onboarding / "How to read this menu"
  HeaderControls.tsx        Aa dropdown + language dropdown

lib/
  menu-data.ts              static BB data (canonical until Supabase, full i18n shape)
  menu-repo.ts              getPublishedMenu(slug) — tagged fetch abstraction
  locale.ts                 getLocale(), pickLocale(), countryTaste map
  cart.ts                   sessionStorage cart with TTL + venue namespace

styles/
  globals.css               Tailwind base + @theme inline semantic→utility mapping

public/
  themes/
    bottle-brothers.css     [data-venue="bottle-brothers"] token overrides (from handoff)
  venue-assets/
    bottle-brothers/        bb-logo-crop.png, icon-*.svg, bb-cocktail-1.webm, placeholder

messages/
  en.json                   UI chrome strings
  sq.json
  it.json
```

---

## Z-index Map (from design)
| Layer | z |
|---|---|
| Sticky tab rows | 4 |
| Cart bar (normal) | 5 |
| Detail sheet scrim | 5 |
| Header | 6 |
| Detail sheet | 6 |
| Cart bar (with detail open) | 7 |
| List sheet scrim | 7 |
| List sheet | 8 |
| Legend scrim | 9 |
| Legend sheet | 10 |
| Header dropdowns (Aa, lang) | 60 |
| Tip tooltip ("?") | 99999 |

---

## Animation (core principle: soft-up / sharp-press)
Sheets glide up: `translateY(100% → 0)`, 300ms, `cubic-bezier(0.22, 1, 0.36, 1)` (soft).
Scrim fade: opacity 0→1, 220ms.
Press feedback (cards, buttons): instant background swap via `:active` — NO transition. Hard cut.

```css
@keyframes bbUp  { from { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes bbDim { from { opacity: 0 } to { opacity: 1 } }
```

---

## Supabase Free Tier Keep-alive
Free tier pauses after 7 days of inactivity. Cron ping prevents this.

```ts
// app/api/cron/ping/route.ts
export const runtime = 'edge'
export async function GET() {
  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/venue?select=id&limit=1`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! }
  })
  return new Response('ok')
}
```

`vercel.json`:
```json
{ "crons": [{ "path": "/api/cron/ping", "schedule": "0 12 */5 * *" }] }
```

---

## V2: Chains / Networks (spec — not building now)

### What it is
Multiple venues under one brand: e.g. "Stockit Pub Tirana" + "Stockit Pub Shkodër".
Same `data-venue` attribute → shared brand/CSS. Each location is an independent `venue` with
its own slug, menu, and locales. No change to guest URL structure.

### Guest analytics (aggregate, no PII)
On first menu load: generate UUID → `localStorage['osp_guest'] = { token, ts }`.
On each venue visit: fire-and-forget `POST /api/guest-visit { token, venue_slug }`.
Chain owner sees cross-venue overlap as aggregates — how many tokens appeared in 2+ locations.
No personal data. Token is random, never linked to identity.

```
guest_visit
  id            uuid PK
  guest_token   uuid            -- random, anonymous
  venue_id      uuid FK
  org_id        uuid FK?
  visited_at    timestamptz
```

### "While you wait" plaque — discovery (not loyalty)
`ListSheet` "While you wait" block shows other venues in the same organization.
Guest taps → navigates to `/venue/[other-slug]`. Standard link, no login, no loyalty mechanics.
This fills the `[TODO]` slot already present in the BB design.

### Shared brand
All venues in a chain share one `data-venue` attribute and one stylesheet.
Individual venue can override specific token values by appending to their own stylesheet section.

### Migration path (purely additive, no existing code changes)
1. Add `organization` table + `venue.org_id` FK (nullable → backward compatible)
2. Add `guest_visit` table + anonymous token logic in `lib/guest.ts`
3. Wire "While you wait" plaque to `organization.venues` list
4. Build chain admin dashboard under `/admin/org/[slug]`

---

## Dev Rules — do not violate

### Banned word — "Чесний" / "чесно" (honest)
NEVER use the word «Чесний», «Чесно», or any form of it (in any language: "honest",
"honestly", "to be honest"). Say the thing directly without framing it as honesty.

### Before ANY decision — state your confidence level
Before implementing anything non-trivial, write ONE sentence:
"Confidence: X/10 — [why I might be wrong]"
If confidence < 8, ask before doing. This catches hallucinations before they become wasted work.
Examples of low-confidence signals: assuming a layout without seeing a design, guessing a
component exists, inferring what "fix X" means without seeing the current state of X.

### Never assume layout without a design spec
If a component renders elements in a certain order (e.g. desc → name, or name → price),
**do not reorder them** unless:
1. The design handoff explicitly shows a different order, OR
2. The user explicitly says "put X above Y"

If something looks visually wrong, **ask first** — do not silently "fix" it by guessing
what the correct layout should be. Violations of this rule repeat the same mistake in a loop.

### Never assume design intent for a new venue
Each venue (BB, Saly, future) has its own design spec. Do not port BB decisions to Saly or
vice versa without confirming. When a new venue's component looks different from BB:
→ ask "what should the layout be?" before touching anything.

### Check for existing components before creating new ones
Before building a new component, check if one already exists (grep components/, lib/).
If unsure whether to reuse or create — **ask**. Do not create duplicate components for
"slightly different" layouts. Prefer adding a prop to an existing component over forking it.
One component shared across BB and Saly is always better than two near-identical ones.

---

## Open TODOs (content — confirm with client before fixing)
From BB design handoff — do not silently fill in:

- Real photos/videos for cocktails and dishes (only Aperol Spritz has `bb-cocktail-1.webm`)
- **Americana** pizza description duplicates **Cotto e Funghi** — needs real copy
- Content translations for sq/it — only `en` seeded in static data
- "While you wait" plaque: copy text + link target (venue guide)
- Direct pairing dish names mismatch: `pairings` uses "Pizza Margherita" / "Miks Sallame & Djathëra"
  which don't match `foodData` names → opening a paired dish from cocktail detail shows name+price
  only (no description). Reconcile names before enabling that flow.
