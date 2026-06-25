# Ospitalitta — Admin (Menu Editor) MVP · Designer Handoff

> Single self-contained brief for the designer. Covers the product, the MVP scope, the full data
> model, and the design spec (screens, components, states, visual direction).
> Built in `ospitalitta-app` under `/admin` (same app as the guest menu).
> Companion: `README.md` (same folder) repeats the design detail; this file is the one-stop.

---

## 1. Product context

**Ospitalitta Digital Waiter** — venues (restaurants, bars) get a guest-facing mobile menu at
`/venue/[slug]`. A guest scans a QR at the table → browses the menu → optionally builds a cart to
show the waiter. No orders go to a kitchen, no real-time, no guest login.

**This handoff is for the ADMIN** — the internal tool where the operator edits that menu.
The admin is the *input*; the guest menu is the *output*. Before designing, view the live output
(`/venue/bottle-brothers`) as the product quality bar.

- **User:** venue owner / operator (and us). Single hardcoded user for MVP.
- **Device:** **desktop only.** No mobile, no touch.
- **Tone:** clean, fast, no-nonsense editing tool. Clarity over delight.
- **Demo venue:** **Saly** (seafood restaurant). Switcher also lists Bottle Brothers & Côte.

---

## 2. MVP scope

**In scope (design these):**
1. **Categories** — create / edit / delete / reorder. Two levels (category → sub-category).
2. **Products (items)** — create / edit / delete / reorder within a category (drag).
3. **Translations** — edit item/category text per language; "translate from base" AI draft + review.

**Out of scope (do NOT design now):** analytics dashboards, guest-facing screens, pairings,
featured-pick editor, image cropping, multi-user roles/permissions UI, billing, onboarding wizard.

**Stages:**
- **MVP (now):** menu management (above).
- **Stage 2:** analytics preview, owner self-serve onboarding, network features.

---

## 3. Account & venues

- **One account can access several venues** (Saly / Bottle Brothers / Côte) → **venue switcher** in
  the header. Switching changes only the *content* you edit.
- MVP: single hardcoded user with a hardcoded access list. (Real auth + per-venue access comes later;
  the data model already supports it — no rework.)

---

## 4. Data model (what the admin edits)

```
venue
  slug, name, locales[], default_locale, brand, onboarding
    │
    └── menu_section        (= category)
          type: 'cocktail' | 'food'
          parent_id          → null = top category · set = sub-category (max 2 levels)
          sort_order
          i18n: { <locale>: { label, sub } }
            │
            └── menu_item    (= product)
```

### Menu item — full field set
`*` = required. Group visually in the form.

**Common (all venues):**
| Field | Type | Notes |
|---|---|---|
| `name` * | translatable text | per-locale |
| `description` | translatable text | per-locale |
| `price` * | text | e.g. `L600` |
| `price_type` | `fixed` \| `per_unit` \| `market` | drives the price control |
| `price_unit` | text | `/kg`, `/100g` — shown when `per_unit` (critical for Saly fresh fish) |
| `available` | toggle | in stock / **86'd** (out of stock) |
| `house` | toggle | house signature ★ |
| `loved` | toggle | guest favourite ♥ |
| `image_url` | image | upload / replace / empty placeholder (optional) |
| `sort_order` | int | reorder within category |

**If category type = cocktail:** `glass` (pick a silhouette — reuse `Glass.tsx`), `lvl` (strength 1–3), `flavor` (zero-section only).

**If category type = food:** `portion` / weight note (e.g. "≈300–400 g"), `tags` = **allergens / diet**
multi-select chips (veg / vegan / gluten-free / shellfish), `prep_note` / ETA (optional).

### Languages
- **Menu content** (names, descriptions, category labels): stored per-locale (`i18n`). Per-venue locale
  set — Saly = EN (base) + sq, it, pl, hu, de, fr, no.
- **UI chrome** (buttons, tabs, legend on the guest menu): separate system (next-intl), Ospitalitta-level
  (en, sq, it, pl). The designer mainly cares about the **content** layer in the admin forms.
- Base language = venue default (usually EN); operator writes base, then translates to the rest.

### QR
- **One QR per venue** → opens the public URL `/venue/[slug]` → the guest menu.
- No table ID in the URL, no guest login. QR is printed per venue.

### Geo
- **Country-level only**, inferred from the browser `Accept-Language` (e.g. `pl-PL` → PL).
- Used only to set guest-menu tab order by taste (PL/GB→sweet · IT/DE→bitter · FR/NO→sour).
- No GPS, no IP-geo, no city, no precise location.

### Metrics (MVP)
- **None as a product feature.** No orders, no guest login, cart is show-to-waiter only (not persisted),
  no event tracking. At most, infrastructure-level "menu opens per venue."
- Real analytics = **Stage 2** (preview later). Do not design analytics UI now.

---

## 5. What the admin does (MVP)
Menu management for the selected venue: categories + sub-categories, products (CRUD), prices,
availability (86), translations, and **ordering (drag)**. Analytics preview = Stage 2.

---

## 6. Design spec

### 6.1 Screen map
```
/admin            → redirect to current venue editor
/admin/[slug]     → THE editor (two-pane master-detail)   ← 95% of the design work
(login)           → minimal / placeholder (hardcoded user). Low priority.
```

### 6.2 The editor — two-pane master-detail
```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER:  [Ospitalitta admin]   [Venue ▾ Saly]      [Content lang ▾]   │
├───────────────────────────┬──────────────────────────────────────────┤
│  LEFT — MENU TREE          │  RIGHT — CONTEXTUAL EDITOR               │
│  sections + items,         │  form for whatever is selected:         │
│  expand/collapse,          │  an item OR a category.                 │
│  drag to reorder, + add    │  empty state when nothing selected.     │
│  ~320–380px                │  flexible, fills the rest               │
└───────────────────────────┴──────────────────────────────────────────┘
```
- One selection state (`selectedNode`). Click a tree row → its form opens on the right.
- Each form saves on its own (explicit Save). No global "publish" in MVP.
- Fallback layout (design only if asked): full-page route-per-item form.

### 6.3 Components & states (core of the work)

**Header** — wordmark · **venue switcher** (Saly / BB / Côte) · **content-language switcher**
(which language you're editing) · save status.

**Left — menu tree** (2 levels max: category → sub-category → items):
- Row types × states: category / sub-category / item × { default, hover, **selected**, dragging, drop-target }.
- Drag handle → reorder **within the same level only** (no cross-level drag). Clear drop indicator.
- Expand / collapse categories.
- Add buttons: "+ Category", "+ Sub-category", "+ Item".
- Item row shows: name (current language), price, status marks (86 / ★ house / ♥ loved / ⚠ missing translation).
- Empty state (venue with no categories).

**Right — item editor:** the field set in §4, grouped (common / cocktail / food). Form states:
pristine · dirty (unsaved) · saving · saved · validation error (per field) · delete confirm.
Price control must handle a unit suffix (`/kg`) and a "market price" mode.

**Right — category editor:** name (translatable) · type (cocktail/food) · parent (none = top / a category = sub) · delete (confirm, warn if it has items).

**Translation UX** (design carefully):
- Side-by-side: base text next to the target field being edited.
- "Translate from base" button — per field AND bulk "fill all missing" (AI draft).
- Per-field state: `base` (read-only reference) · `target empty/missing` · `target AI-draft` (flagged, e.g. yellow) · `target verified` (neutral) · `translating` (loading).
- Missing translations flagged in the form and in the tree.

**Global:** toasts/inline confirmation (save, delete, translate) · loading skeletons.

### 6.4 Visual direction
- The admin uses the **Ospitalitta brand identity** (designer has the kit). It is the Ospitalitta tool.
- **NOT per-venue themed.** Repo design tokens are all per-venue + guest-facing (dark, expressive).
  The admin chrome stays **constant** across the venue switcher — only the content changes. The active
  venue appears only as a small preview chip / swatch.
- Reusable assets in `public/assets/`: `icon-plus`, `icon-list`, `icon-grid`, `icon-language`,
  `icon-info`, `icon-typography`. Glass silhouettes + taste marks exist as components
  (`Glass.tsx`, `TasteMark.tsx`) — reuse, don't redraw.

### 6.5 Layout & interaction
- **Desktop only.** Target ~1280–1600px; define down to ~1024px; below = out of scope.
- Two-pane ratio: left ~320–380px, right fills.
- Keyboard-friendly (tab order, enter to save) — nice-to-have.
- Drag: smooth within-level reorder, clear drop indicator, fixed row height (avoid layout jump).

---

## 7. Deliverables from the designer
1. **Admin token set** from the Ospitalitta brand: surface, ink, line/border, accent, state colors (success/warn/danger), radii, spacing scale, type scale.
2. **Editor screen** in key states: nothing selected · item selected · category selected · translating · dragging.
3. **Component specs:** tree rows (all states) · item form (all groups + states) · translation field (all states) · header + both switchers · toasts · empty/loading.
4. Figma (or equivalent) with reusable components mapped to the token set.

## 8. Open questions (minor — resolve during design)
1. **Login screen:** design a minimal one, or skip for MVP (hardcoded user)?
2. **Image handling:** simple upload-and-show, or any cropping / aspect guidance?
