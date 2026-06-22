# Admin (menu editor) — рішення перед побудовою

> Контекст: Digital Waiter, Next 14 App Router + Supabase. Гість-частина готова (`/venue/[slug]/menu`).
> Адмінки ще нема. Дата-модель = V1 у CLAUDE.md. i18n-first з дня 1.
> Критерій вибору (founder): де МЕНШЕ багів і галюнів від AI при побудові.

---

## 1. Загальний layout екрана редагування
**РІШЕННЯ: two-pane master-detail, НЕ three-pane.**

- **Ліво** = дерево (секції, розгортаються в items; drag = reorder).
- **Право** = контекстний редактор: клік на item → форма item; клік на секцію → форма секції.
- Save = Server Action → `revalidateTag('venue:'+slug)` (DEC-004). Кожна форма зберігається окремо.

**Чому не three-pane** (`[секції][items][редактор]`):
- 3 пейни = ДВА стани вибору (вибрана секція + вибраний item) + окрема логіка згортання на вузькому екрані = більше edge-cases і race-станів → саме там я найбільше галюциную/плутаю.
- При нашому масштабі (5-8 секцій × 5-15 items) третій пейн не дає виграшу.
- Two-pane = ОДИН стан виб喑ору (`selectedNode`), дерево зліва вже показує і секції, і items. Простіше = надійніше.

**Найнадійніший fallback (якщо й two-pane глючить):** route-per-item — `/admin/[slug]/item/[id]` як окрема сторінка-форма (RSC + Server Action). Роут = природна межа стану, нуль клієнтського sync. UX гірший (постійна навігація), баги майже нульові. Тримаємо як запасний.

---

## 2. Глибина вкладеності категорій
**РІШЕННЯ: дата = дерево (adjacency list), UI = зафіксовані 2 рівні зараз.**

- Додати `menu_section.parent_id uuid FK NULL` (self-reference). Зберігання вже деревоподібне.
- App-рівень: **cap = 2 рівні** (top-category → sub-category → items). UI рендериться НЕ рекурсивно — два явні рівні.
- Приклад: `Food → Starters / Mains / Fresh fish → items` · `Drinks → Bitter / Sour / … → items`.

**Різниця fixed-2 vs unlimited:**
| | Fixed depth 2 | Unlimited (parent_id рекурсія) |
|---|---|---|
| UI | 2 явні рівні, не рекурсія | рекурсивний рендер |
| Reorder | в межах рівня, просто | drag між рівнями, складно |
| Баг-поверхня | мала | велика (нескінченна рекурсія, performance) |
| Меню реально | вистачає (меню рідко глибше 2-3) | overkill зараз |

**Як скейлити потім:** дані вже adjacency list → щоб дозволити глибше, просто **знімаєш app-cap і міняєш рендер на рекурсивний. БЕЗ міграції схеми.** Тобто платимо за гнучкість сховища зараз (одна колонка), а складність UI відкладаємо.

---

## 3. Редагування перекладів
**РІШЕННЯ: «Translate from base» (AI-чернетка) + per-field review-флаг + side-by-side.**

- Base locale = `venue.default_locale` (напр. en). Оператор пише base.
- Кнопка **«Translate from base»** (per-field АБО bulk «fill all missing») → Server Action → Claude (`claude-haiku`, переклад дешевий) → пише в `i18n[locale]`.
- AI-заповнене поле = флаг `draft/unverified` (візуально жовте). Ручна правка → `verified`. Оператор лише ВИЧИТУЄ, не перекладає з нуля.
- При редагуванні перекладу — показувати base поряд (порівняти).
- НЕ перекладати на кожен keystroke (вартість + races). Тільки explicit-кнопка.
- Зберігається в `i18n` jsonb (вже наш shape).

> Флаг-стан (draft vs verified) — мінімальне поле, але рятує від «AI наплів, ніхто не вичитав».

---

## 4. Поля продукту (item)
Реальний набір (розділено: спільне / коктейль / їжа). Зірочка = required.

**Спільне (всі venue):**
- `name*` (i18n)
- `description` (i18n)
- `price*` — АЛЕ потрібен `price_type`: `fixed` | `per_unit` (+`price_unit`, напр. «/100g», «/kg») | `market`. ← критично для Saly (свіжа риба за вагою).
- `section*` (FK)
- `sort_order`
- `available` (86 / out of stock) — toggle ← ДОДАТИ, реально потрібно
- `house` (house signature) — є
- `loved` (guest favourite) — є
- `image_url` (опц.) ← ДОДАТИ (зараз поля фото НЕМА)

**Коктейль-тип (section.type='cocktail'):**
- `glass*` (силует) · `lvl` (міцність 1-3) · `flavor` (тільки zero-секція)

**Їжа-тип (section.type='food'):**
- `portion` / weight-note (напр. «≈300-400 g», «per 100 g»)
- `tags` text[] (опц.): дієта/алергени — veg / vegan / gluten-free / shellfish (для seafood алергени важливі)
- `prep_note` / ETA (опц., напр. «made to order ~15 min» — зараз це секційний PizzaNote)

**Окремими таблицями (не в формі item, v2):** pairing (cocktail→3 dishes), food_pairing (dish→3 cocktails), featured_pick.

**Схема-дельта до menu_item:** `+available boolean default true` · `+image_url text null` · `+price_type text` · `+price_unit text null` · `+tags text[] null` · `+portion text null`.

---

## 5. Мови в роботі
**РІШЕННЯ: гнучко, per-venue. НЕ фіксований глобальний набір.**

- Два шари (DEC-008):
  - **UI chrome** (next-intl `messages/*.json`) = Ospitalitta тримає набір. Зараз реально є **en, it, pl, sq** (CLAUDE.md каже en/sq/it — застаріло, треба оновити). Нова UI-мова = новий messages-файл (dev-задача).
  - **Контент меню** (`i18n` jsonb) = довільні локалі per venue, `pickLocale` робить fallback. BB = en(+), Saly = en+pl (польські туристи).
- `venue.locales text[]` вже задає набір на заклад. → гнучкість вже в моделі.
- Практика: **EN = універсальний base, кожен venue обирає target-локалі зі списку підтримуваних UI-мов.** Список росте, коли додаєш messages-файл.

> Action: оновити CLAUDE.md DEC-008 — локалі en/it/pl/sq + «per-venue, не фіксовано».

---

## 6. Що будуємо першим
**РІШЕННЯ: один екран — menu-tree + item-edit (two-pane) для BB, через Supabase write-path.**

Перший екран має прогнати найризикованішу сантехніку на найменшій поверхні: auth + RLS + Server Action + `revalidateTag`.

Порядок (по одному):
1. Admin shell + auth (Supabase) + venue = hardcode BB поки.
2. Read-only дерево секцій+items (доказ читання з БД).
3. **Edit одного item** (форма + save через Server Action + revalidateTag) ← доказ write-path. **Це і є перший справжній екран.**
4. Add / delete item + reorder.
5. Translations (AI-чернетка, п.3).
6. Секції CRUD · featured pick · pairings.

---

## 7. Скільки варіантів layout показати
**1 рекомендований + 1 fallback** (не 3-4 — decision fatigue).
- Рекомендований: **two-pane master-detail** (п.1).
- Fallback: **route-per-item** (окрема сторінка-форма) — якщо клієнтський sync глючить.

---

## Зведення схема-дельт (для міграції перед білдом)
- `menu_section`: `+parent_id uuid FK NULL`
- `menu_item`: `+available boolean default true` · `+image_url text null` · `+price_type text` · `+price_unit text null` · `+tags text[] null` · `+portion text null`
- (опц. перекладів) per-field verified-стан: тримати у `i18n` як `{ en:{name,desc}, pl:{name,desc,_draft:true} }` АБО окрема легка таблиця `translation_status`. Почати з `_draft` прапора в jsonb (простіше).
