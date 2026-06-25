# Ospitalitta Admin — Developer Handoff · Phase 1

**Product:** Ospitalitta *Digital Waiter* admin.
**Phase 1 scope:** ship the **Login** screen and the **Dashboard** (analytics preview, mock data) inside the app shell. The **Menu editor** and other sections are a later phase — do not build them now.

- **Platform:** desktop only, target ~1280–1600px, support down to ~1024px. No mobile.
- **UI language:** English only.
- **Theme:** light (`life`) only.
- **Brand:** the admin chrome is **Ospitalitta**, constant. The venue (Saly) is shown as a static label only — **no venue switcher in Phase 1** (will be added later).

## Design references (open in this project)
- `tokens/globals.css` — canonical design tokens (source of truth).
- `Saly Admin · Foundations.dc.html` — rendered styleguide + component gallery.
- `Saly Admin · Login.dc.html` — login design.
- `Ospitalitta Admin · Dashboard.dc.html` — dashboard design.
- `icons.svg` — icon sprite (symbols: `ic-dashboard`, `ic-menu`, `ic-translate`, `ic-qr`, `ic-settings`, `ic-collapse`, `ic-house`, `ic-loved`, `ic-chevron`). 24×24, `currentColor`.

> The `.dc.html` files are the visual spec. Mirror layout, spacing, colors, and copy from them.

---

## 1. Stack & tokens

- Tailwind v4, CSS-first. Tokens already defined in `tokens/globals.css` (3 levels: primitives → semantic → component). **Components read semantic tokens only.** Do not hardcode raw hex in components — use the CSS vars.
- Fonts (Google): **Anton** (page titles + KPI numbers only), **Space Grotesk** (all UI + body), **Space Mono** (labels, codes, numeric data).

Literal values (light / `life`), in case you need them inline:

```
canvas        #F1E9D8   surface #FBF7EE   raised #FFFFFF   sunken #ECE3D0
line-subtle   #EAE0CD   line #DACEB6      line-strong #C3B496
ink #1A1411   ink-2 #5E5243   ink-3 #8C8067   ink-4 #AC9D82
gold #E0992E  core/molten #E8801F  ember/danger #D6431C
fill-selected #F6E7CE  fill-hover #EFE6D3
success #1F8A5B / tint #DCEDE1   warn #C2820C / tint #F6E7C5   danger #D6431C / tint #F8DFD3
```

Rules: hard edges, no soft drop shadows. Asymmetric radius **left round / right sharp** (`sm = 8px 0 0 8px`). **Inputs are square (radius 0).** Motion: `cubic-bezier(0.2,0,0,1)`, fast 120ms / base 200ms; respect `prefers-reduced-motion`. No em dashes, no trailing periods in titles/list items.

---

## 2. App shell — collapsible sidebar

Persistent left sidebar, shared by all app pages.

- Width: **236px expanded / 68px collapsed**. Animate width (180ms).
- Collapse state persists in `localStorage` key **`osp-admin-nav`** (`'1'` collapsed / `'0'` expanded). Read on mount, write on toggle.
- Top: Ospitalitta house-mark + "Ospitalitta admin" wordmark (wordmark hidden when collapsed).
- Nav items (icon + label; label hidden when collapsed, `title` attr for tooltip):
  `Dashboard` (active in Phase 1) · `Menu` · `Translations` · `QR codes` · `Settings`.
  In Phase 1 only **Dashboard** routes to a real page; the rest can be present but inert/disabled.
- Active item: `fill-selected` background + 3px molten left bar + ink icon/label. Inactive: ink-3 icon, ink-2 label, hover `fill-hover`.
- Collapse toggle at the bottom (`ic-collapse`, rotate 180° when collapsed).
- Footer: user avatar (initial) + "Manager" + email (hidden when collapsed). Single hardcoded user for now.

---

## 3. Login

Route: `(login)`. **Shared door** — one login for every venue, branded as the platform, never venue-specific. The venue loads from the account after sign-in.

**Layout:** full-height split.
- **Left panel** (`#15110E` char): house-mark + "Ospitalitta" wordmark (top), a **reserved image slot** (middle, to be filled later), tagline "Digital Waiter · one door, every venue" (bottom).
- **Right panel** (`#FBF7EE`): centered form, max-width 400px.

**Form:**
- Eyebrow "Digital Waiter", title **"Sign in"** (Anton), subtitle "Your venue loads from your account".
- **Email** — placeholder `you@company.com`.
- **Password** — with **show / hide** toggle (text link, top-right of the field).
- **Remember me** checkbox (default on) + **Forgot password** link.
- Primary button **"Sign in"** (ink fill, full width).

**States:** square inputs; focus = molten border + 3px molten ring (`rgba(232,128,31,.18)`); error = ember border + helper text below.

**Auth (MVP):** single hardcoded user, low priority. On submit, route to the dashboard. No real auth, no registration, no SSO in this phase.

---

## 4. Dashboard

Route: `/admin` (or app home). Analytics **preview** — label it clearly as **Stage 2 preview · mock data**. The MVP has no real metrics yet; wire mock/placeholder data now, real data later.

**Topbar:** static venue chip (color swatch + "Saly" + "menu analytics"), right side = **range toggle** `Day | Week | Month` (segmented, ink-fill active). No venue switcher.

**Content:**
1. Title block: **"Dashboard"** (Anton) + "Stage 2 · preview · mock data" tag + "Saly · {range}" meta.
2. **KPI row** — 4 stat cards. Each: mono label, Anton number, delta line (success/danger). Values change with the range toggle.
   - **Scans**, **Unique visitors**, **Menu views**, **Bookmarks**.
3. **Scans over time** chart (≈ 1.7fr) — simple bars; per-range buckets (Day = by hour, Week = by day, Month = by day). Tallest bar uses molten, rest use `#E7DBC4`.
4. **Where guests are from** (≈ 1fr) — country list, geo is **country-level only** (from `Accept-Language`). Rows: 2-letter code, name, gold bar, %.
5. Row of 3: **Most bookmarked** (items + ember bars), **Most viewed items** (items + gold bars), **Busiest hours** (bar chart by hour).

**Range toggle** drives the KPI numbers + the main chart. Geo / bookmarks / views / hours can stay static across ranges for the mock.

### Mock data shapes
```ts
type RangeKey = 'day' | 'week' | 'month';

interface RangeData {
  scans: number; unique: number; views: number; bookmarks: number;
  dScans: string; dUnique: string; dViews: string; dBook: string; // e.g. "14%"
  unit: 'by hour' | 'by day';
  bars: number[];      // chart heights
  labels: string[];    // x-axis labels (sparse ok)
}

interface CountryRow  { code: string; name: string; pct: number; }     // pct of scans
interface RankedItem  { name: string; n: number; }                     // bookmarks / views
type Hours = number[]; // value per hour bucket
```

Use the exact mock numbers from `Ospitalitta Admin · Dashboard.dc.html` (Saly seafood venue) so design and build match.

---

## 5. Shared components to build

- `Sidebar` (collapsible, localStorage-persisted, nav items, active state, user footer).
- `StatCard` (mono label · Anton number · delta).
- `RangeToggle` (Day/Week/Month segmented).
- `BarChart` (simple flex bars + labels) — reused by Scans-over-time and Busiest-hours.
- `RankBar` (label + value + horizontal bar) — reused by Countries / Bookmarked / Viewed.
- Form primitives: square `Input`, `PasswordInput` (show/hide), `Checkbox`, primary `Button`.
- Icon component reading `icons.svg` symbols via `<use>` + `currentColor`.

---

## 6. Out of scope (Phase 1)

Menu editor (categories / items / price / media / translations UI), Translations / QR codes / Settings pages, real analytics wiring, venue switcher, real auth + multi-user roles, billing, onboarding. These come later — leave nav entries inert.
