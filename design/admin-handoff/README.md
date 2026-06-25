# Admin (Menu Editor) — Design Handoff

> Spec for designing the **menu editor admin** for the Ospitalitta Digital Waiter platform.
> Mirrors the existing guest-menu handoff pattern (spec + states). Built in `ospitalitta-app`
> as routes under `/admin` (same app as the guest menu — see `CLAUDE.md` DEC-004/005).
> Source of truth for scope & data: `ADMIN-DECISIONS.md` (root of `ospitalitta-app`).

---

## 1. What this is

An internal tool where a venue operator edits the **menu that guests see** at `/venue/[slug]`.
The operator changes a price, marks a dish out of stock, adds an item, reorders a section, or
fills in a translation — and the published guest menu updates.

- **User:** venue owner / operator (and us). Not a guest. Single hardcoded user for MVP.
- **Device:** **desktop only.** No mobile, no touch. Design for a wide screen.
- **Tone:** a clean, fast, no-nonsense editing tool. Confidence and clarity over delight.

### Relationship to the guest menu (look at this first)
The admin is the *input*; the guest menu is the *output*. Before designing, view the live output:
- Live guest menu: `/venue/bottle-brothers` (run the app locally) — this is the quality bar for the product.
- Guest-menu design system: `CLAUDE.md` DEC-006/007 (per-venue theming, token layers).

**The admin does NOT inherit the per-venue guest theme.** See §4.

---

## 2. Scope (MVP)

**In scope — design these:**
1. **Categories** (sections) — create / edit / delete / reorder. Two levels (category → sub-category).
2. **Products** (items) — create / edit / delete / **reorder within a category** (drag).
3. **Translations** — edit item/category text per language; "translate from base" AI draft + review.

**Out of scope — do NOT design now:** analytics, guest-facing anything, pairings, featured-pick
editor, image cropping tools, multi-user roles/permissions UI, billing, onboarding wizard.

**Demo venue:** **Saly** (seafood restaurant, bilingual base). The venue switcher also lists
Bottle Brothers and Côte, but only Saly is the demo target.

---

## 3. Screen map

```
/admin                         → redirect to current venue editor
/admin/[slug]                  → THE editor (two-pane master-detail)   ← 95% of the design work
(login)                        → minimal / placeholder for MVP (hardcoded user). Low priority.
```

### The editor screen — two-pane master-detail (decided, ADMIN-DECISIONS §1)

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER:  [Ospitalitta admin]   [Venue ▾ Saly]      [Content lang ▾]   │
├───────────────────────────┬──────────────────────────────────────────┤
│  LEFT — MENU TREE          │  RIGHT — CONTEXTUAL EDITOR               │
│  (sections + items,        │  (form for whatever is selected in the  │
│   expand/collapse,         │   tree: an item OR a section)           │
│   drag to reorder,         │                                          │
│   + add)                   │  empty state when nothing selected      │
│                            │                                          │
│  ~320–380px                │  flexible, fills the rest               │
└───────────────────────────┴──────────────────────────────────────────┘
```

- One selection state only (`selectedNode`). Click a tree row → its form opens on the right.
- Each form saves on its own (explicit Save). No global "publish" button in MVP.
- **Fallback layout (design only if asked):** route-per-item full-page form (`/admin/[slug]/item/[id]`).
  We keep it as a robustness fallback; design the two-pane first.

---

## 4. Visual direction

The admin uses **Ospitalitta's own brand identity** (the designer already has the kit). It is the
Ospitalitta tool — not a guest surface.

**Key principle — the admin is NOT per-venue themed.** The repo's design tokens are all per-venue
and guest-facing (dark, expressive, change with the venue). The admin chrome stays **constant**
across the venue switcher: only the *content* changes when you switch BB / Saly / Côte, never the
tool's look. The active venue appears only as a small **preview chip / swatch**.

**Why:** a tool that re-skins itself every time you change venue is disorienting and harder to build.
Keep one stable Ospitalitta-branded shell; let the menu content underneath be venue-specific.

Reuse the existing Ospitalitta brand: type, accent, logo — per the kit the designer holds.

Reusable icons already in repo (`public/assets/`): `icon-plus`, `icon-list`, `icon-grid`,
`icon-language`, `icon-info`, `icon-typography`. Glass silhouettes + taste marks exist as
components (`Glass.tsx`, `TasteMark.tsx`) — reuse for cocktail items, don't redraw.

---

## 5. Components & states (the core of the handoff)

### 5.1 Header
- Product wordmark ("Ospitalitta admin" or logo TBD).
- **Venue switcher** (dropdown): Saly / Bottle Brothers / Côte. Shows current venue.
- **Content-language switcher** (dropdown): which language you are currently editing
  (e.g. EN base, SQ, IT, PL…). This drives what the forms show. Distinct from any UI language.
- Optional: save status / "all changes saved".

### 5.2 Left — Menu tree
Rows, two levels deep max: **category → sub-category → items** (items are leaves).
- **Row types & states:** category row, sub-category row, item row × { default, hover, **selected**,
  dragging, drop-target }.
- **Drag handle** on each row → reorder **within the same level only** (item within its category;
  category within its level). No cross-level dragging. Show a clear drop indicator line.
- **Expand / collapse** for categories.
- **Add buttons:** "+ Category", "+ Sub-category" (on a category), "+ Item" (on a category/sub-category).
- **Item row content:** name (in current content language), price, and small status marks:
  out-of-stock (86), house ★, loved ♥, missing-translation flag.
- **Empty state:** venue with no categories yet.

### 5.3 Right — Item editor (form)
Fields (from ADMIN-DECISIONS §4). `*` = required. Group visually.

**Common (all venues):**
- `name *` — translatable (see §5.5)
- `description` — translatable
- `price *` + **`price_type`**: `fixed` | `per_unit` (+ `price_unit` e.g. `/kg`, `/100g`) | `market`
  → the price control must support a unit suffix and a "market price" mode (critical for Saly fresh fish).
- `available` — **toggle** (in stock / 86'd out of stock)
- `house` — toggle (house signature)
- `loved` — toggle (guest favourite)
- `image` — upload / replace / empty placeholder (optional field)

**If section type = cocktail:** `glass` (pick a silhouette — reuse `Glass.tsx`), `lvl` (strength 1–3), `flavor` (zero-section only).

**If section type = food:** `portion` / weight note (e.g. "≈300–400 g"), `tags` (multi-select chips:
veg / vegan / gluten-free / shellfish), `prep_note` / ETA (optional).

**Form states:** pristine, dirty (unsaved), saving, saved (confirmation), validation error (per field),
delete confirmation.

### 5.4 Right — Section (category) editor
- `name` (translatable), `type` (cocktail / food), `parent` (none = top-level, or a category = makes it a sub-category).
- Delete (with confirm; warn if it contains items).

### 5.5 Translation UX (decided, ADMIN-DECISIONS §3) — design carefully
The operator writes the **base language** (venue default, usually EN), then fills other languages.

- **Side-by-side:** base text shown next to the target-language field being edited (compare while typing).
- **"Translate from base"** button — per field AND a bulk "fill all missing". Triggers an AI draft.
- **Draft vs verified state per field:**
  - AI-filled = **draft / unverified** → visually flagged (e.g. yellow edge/badge). Operator reads & confirms.
  - Manually edited / confirmed = **verified** → neutral.
- **Missing translation** = clearly flagged in the form and as a mark in the tree (§5.2).
- Translation happens only on explicit button press (never per keystroke).

Design states for a single translatable field: `base` (read-only reference) · `target empty/missing` ·
`target AI-draft (yellow)` · `target verified` · `translating (loading)`.

### 5.6 Global feedback
- Toasts / inline confirmation for save, delete, translate.
- Loading skeletons for tree + form on first load.

---

## 6. Layout & interaction
- **Desktop only.** Target ~1280–1600px. Define behavior down to ~1024px; below that, out of scope.
- Two-pane ratio ~ left 320–380px fixed-ish, right fills.
- Keyboard-friendly (tab order, enter to save) — nice-to-have, note where relevant.
- Drag: smooth reorder within a level, clear drop indicator, fixed row height to avoid layout jump.

---

## 7. What we need back from the designer
1. **Admin token set** derived from the Ospitalitta brand: surface, ink, line/border, accent, state colors (success/warn/danger), radii, spacing scale, type scale.
2. **The editor screen** in its key states: nothing selected (empty) · item selected · section selected · translating · dragging.
3. **Component specs:** tree rows (all states), item form (all field groups + states), translation field (all states), header + both switchers, toasts, empty/loading.
4. Figma (or equivalent) with reusable components, mapped to the token set.

---

## 8. Open questions (minor — resolve during design)
1. **Login screen:** design a minimal one, or skip for MVP (hardcoded user)?
2. **Image handling:** simple upload-and-show for MVP, or any cropping/aspect guidance?

Visual identity is settled — admin uses the Ospitalitta brand (§4).
```
