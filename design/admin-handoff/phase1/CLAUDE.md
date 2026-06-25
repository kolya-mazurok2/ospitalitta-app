# Ospitalitta — Digital Waiter Admin · Playbook

Адмінка продукту **Digital Waiter**. Бренд-система — **Ospitalitta core** (зафіксована в `Ospitalitta Brand Handoff`). Адмінка **white-label**: візуальна система наша, **лого — клієнтське**. Зараз усе будуємо під заклад **Saly**.

## Продукт (MVP — з офіційного handoff)
Адмінка = **Menu Editor** + **Dashboard (Stage 2 preview, mock-аналітика)** в одному застосунку зі **згортним sidebar** (nav: Dashboard / Menu / Translations / QR codes / Settings; collapse persist у localStorage `osp-admin-nav`). **Desktop only** (~1280–1600, вниз до 1024).

**Menu Editor** — two-pane master-detail. Ліво дерево: **2 рівні категорій** — топ **Food / Drinks (системні, не редагуються)** → підкатегорії (редаговані) → позиції. Порядок = `sort_order` число, **drag не потрібен**. Право контекстна форма.
**Поля позиції (фінал):** name (i18n, EN обовʼязковий, решта опційні, **руками без AI**), desc (i18n), **price = число (`price_minor` integer)** + валюта-лейбл `Lekë` від закладу (не вводиться) + **unit-селектор (none / /kg / /100g)** окремо, **badge** (вільний текст, напр. «For 2»), **media: 1 фото (=постер) + опц. відео**, **available (86)** toggle, **loved** + **house** тоглери. Коктейль/drink: **glass** + **flavor intensity (1–3)**. Food: без додаткових полів (без алергенів/таксономії).
Переклади: side-by-side base(EN)↔target, стани Empty/Filled, гість фолбекає на EN.

**Dashboard** = мок-аналітика (Stage 2 preview, позначено): scans day/week/month, unique visitors, menu views, bookmarks, top countries (гео country-level), most bookmarked, most viewed, busiest hours.

**Бренд:** один venue (Saly) статично, **без switcher** (полагодимо потім). **Жодних замовлень / столів / виручки.** Валюта = `Lekë` (ALL) на рівні закладу. Гео = країна з Accept-Language.

## Залізні правила
- **Мова UI: тільки англійська.** Без мішанини. (Ці нотатки/плейбук — укр, але все що видно користувачу = English.)
- **Sidebar-бренд = наш house-mark + wordmark ЗАКЛАДУ (Saly).** White-label: мітка/лого наша (split house-mark), назва клієнтська (Anton «Saly» + mono «admin»). Топбари без дублю «Saly» (тільки page-context). За рішенням клієнта (раніше був Ospitalitta-wordmark).
- **Логін** мінімальний, low-priority (хардкод 1 юзер). Ospitalitta-бренд, спільний вхід.
- **Тема:** тільки `life` (світла) поки що. Canvas теплий, не білий.
- **Anton — стримано.** Тільки page titles і великі KPI-числа. Решта UI = Space Grotesk. Labels/meta/IDs/coords = Space Mono.
- Hard edges, без м'яких drop-shadow під усе. Тіні delikатні (1px line робить більше роботи).
- **Asym radius** (ліво кругле / право гостре) — ехо розрізу. Картки/кнопки = sm asym. **Inputs square (radius 0)** — з core.
- Без em dash. Без крапок у кінці тайтлів/пунктів. Дані не вигадувати — питати клієнта, ставити явні плейсхолдери.
- Менше слопу: жодних зайвих чисел/іконок «для краси».

## Літеральні токени (light / life) — копіювати як inline hex

### Brand / core (зафіксовано, не міняти)
```
gold   #E0992E   ember  #D6431C   molten/core #E8801F
cream  #FAF4E8   char   #15110E   ink #1A1411   ash #F2E9DA
```
`core #E8801F` = action/attention through-line, не міняється з темою.

### Surfaces (admin light)
```
canvas        #F1E9D8   // фон застосунку (тепла піщана)
surface        #FBF7EE   // панелі, картки
surface-raised #FFFFFF   // інпути, підняті картки, поповери
surface-sunken #ECE3D0   // wells, шапка таблиці, треки
```

### Lines
```
line-subtle #EAE0CD   line #DACEB6   line-strong #C3B496
```

### Text (тепла ink-шкала на світлому)
```
ink   #1A1411   // primary
ink-2 #5E5243   // secondary / body
ink-3 #8C8067   // tertiary / labels
ink-4 #AC9D82   // placeholder / disabled / faint
```

### Fills (hover / selected)
```
fill-hover    #EFE6D3   // ховер рядків/кнопок-привидів
fill-selected #F6E7CE   // активний nav, обраний рядок (теплий gold-tint)
```

### States (визначено для адмінки)
```
success  #1F8A5B  tint #DCEDE1  on-tint #15633F   // з core (форма Subscribe)
warn     #C2820C  tint #F6E7C5  on-tint #7E5403   // burnt-amber, наше рішення
danger   #D6431C  tint #F8DFD3  on-tint #9A2E10   // = ember
accent   #E8801F                                  // = core/molten, для info/attention
```
Чотири стани, не більше. «Info» = accent(molten)/нейтраль, окремий синій НЕ вводимо (бренд теплий).

## Типографіка (admin-tuned scale)
```
page-title   Anton 40–52 / lh .98 / UPPERCASE        // тільки заголовок сторінки
kpi-number   Anton 40–64 / lh .9                       // велике число у stat
h-section    Space Grotesk 600  20 / lh 1.2
h-card       Space Grotesk 600  16 / lh 1.3
ui-strong    Space Grotesk 600  14
ui-base      Space Grotesk 400/500  14 / lh 1.5        // базовий UI-текст
body         Space Grotesk 400  15 / lh 1.6            // довгий текст
label/meta   Space Mono 400/700  12 / +0.12em / UPPERCASE
mono-data    Space Mono 400  12–13                     // ID, coords, суми
```
Контраст великий: Anton-число проти Mono-лейбла.

## Spacing / radius
- 4px base: 4 8 12 16 24 32 48 64 96 128.
- Density: середня. Рядок таблиці ~44px, поля інпутів ~40px, hit-target ≥ 40px.
- Radius asym: `sm 8 0 0 8`, `md 14 0 0 14`. Кнопки/картки = sm. Інпути = `0`.

## Motion
`--ease cubic-bezier(0.2,0,0,1)` · fast 120ms · base 200ms. Ховери швидкі, без glow-кросфейдів. Поважати prefers-reduced-motion.

## Файли
- `tokens/globals.css` — канонічні токени (core + admin layer).
- `Saly Admin · Foundations.dc.html` — рендер-стайлгайд + галерея компонентів (джерело патернів).
- `Ospitalitta Admin · Menu Editor.dc.html` — головний екран MVP (two-pane).
- `Saly Admin · Login.dc.html` — мінімальний логін (low-priority).
- Компоненти, що повторюються ≥4×, виносити в child DC (`<dc-import>`).
