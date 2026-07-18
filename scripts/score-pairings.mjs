/**
 * Score every dish × cocktail pair and print the ranked triples.
 *
 * The rules are the ones already written into the wisdom lines, made explicit:
 *   fat and salt need something to cut them — bitter first, then sour
 *   heat needs sweetness to sit on it
 *   a light plate wants a light glass, and a heavy one wants a glass with body
 *
 * Read-only: it prints a table so the picks can be judged before they go into
 * menu-data.ts. Nothing here writes.
 */
import { readFileSync } from 'node:fs'

const src = readFileSync('lib/menu-data.ts', 'utf8')

/** Pull `{ id: 'x', ... }` blocks out of a named section. */
function itemsOf(section) {
  const m = new RegExp(`const ${section}: MenuSection = \\{([\\s\\S]*?)\\n\\}`).exec(src)
  if (!m) return []
  return [...m[1].matchAll(/\{ id: '([a-z0-9-]+)'[\s\S]*?(?=\n    \{ id:|\n  \])/g)].map((b) => {
    const body = b[0]
    const tastes = [...body.matchAll(/\{ taste: '([a-z]+)', lvl: (\d) \}/g)]
      .map((t) => ({ taste: t[1], lvl: +t[2] }))
    const lvl = +(body.match(/lvl: (\d)/)?.[1] ?? 0)
    const prof = body.match(/profile: \{ rich: (\d), salt: (\d)(, spicy: true)? \}/)
    return {
      slug: b[1],
      section,
      lvl,
      tastes: tastes.length ? tastes : (lvl ? [{ taste: section, lvl }] : []),
      profile: prof ? { rich: +prof[1], salt: +prof[2], spicy: !!prof[3] } : null,
      name: body.match(/name: (['"])(.*?)\1/)?.[2] ?? b[1],
      price: body.match(/price: '(L\d+)'/)?.[1] ?? '',
    }
  })
}

const cocktails = ['bitter', 'sour', 'sweet', 'spicy', 'zero'].flatMap(itemsOf)
const dishes = ['pizza', 'sharing'].flatMap(itemsOf).filter((d) => d.profile)

const level = (c, axis) => c.tastes.find((t) => t.taste === axis)?.lvl ?? 0

function score(dish, c) {
  const { rich, salt, spicy } = dish.profile
  const cut = rich + salt          // 2 (light) … 6 (heavy)
  let s = 0

  // Bitter is the strongest cutter, sour the cleanser. Both scale with how much
  // there is to cut through.
  s += level(c, 'bitter') * cut * 1.2
  s += level(c, 'sour') * cut * 0.9

  // Sweetness cools chilli, and against a salty plate it is the cheese-and-preserve
  // move. It only gets in the way on a plain, light one.
  if (spicy) s += level(c, 'sweet') * 6
  else if (salt >= 3) s += level(c, 'sweet') * 3
  else if (cut <= 3) s -= level(c, 'sweet') * 2

  // A delicate plate is drowned by an intense glass and lifted by a light one.
  if (cut <= 3) s += (3 - Math.max(...c.tastes.map((t) => t.lvl), 0)) * 3

  // Alcohol-free drinks belong on the list, but never ahead of a real match.
  if (c.section === 'zero') s -= 4

  return s
}

/**
 * Raw score alone hands the same three cocktails to almost every dish — bitterness
 * scales with fat, so the most bitter drink wins everywhere. A guest reading the
 * menu sees one suggestion repeated, which is worse than a slightly weaker but
 * distinct pick. Each use therefore taxes a cocktail for the rest of the pass.
 */
const REUSE_TAX = 4
const used = new Map()

const picks = []
for (const dish of dishes) {
  const chosen = []
  for (let slot = 0; slot < 3; slot++) {
    const best = cocktails
      .filter((c) => !chosen.includes(c))
      .map((c) => ({ c, s: score(dish, c) - (used.get(c.slug) ?? 0) * REUSE_TAX }))
      .sort((a, b) => b.s - a.s)[0]
    chosen.push(best.c)
    used.set(best.c.slug, (used.get(best.c.slug) ?? 0) + 1)
  }
  picks.push({ dish, chosen })
}

for (const { dish, chosen } of picks) {
  const { rich, salt, spicy } = dish.profile
  console.log(`\n${dish.name}  (rich ${rich}, salt ${salt}${spicy ? ', spicy' : ''})`)
  chosen.forEach((c, i) => console.log(`   ${i + 1}. ${c.name.padEnd(28)} [${c.section}]`))
}

console.log('\n--- скільки разів кожен коктейль ужито ---')
for (const c of cocktails) {
  const n = used.get(c.slug) ?? 0
  console.log(`  ${c.name.padEnd(28)} ${'●'.repeat(n)}${n ? '' : '—'}`)
}

/** The `why` has to say the same thing the score acted on, or the two drift apart. */
function why({ rich, salt, spicy }) {
  if (spicy) return 'Sweet is what sits on chilli heat and takes the edge off it.'
  if (rich >= 3 && salt >= 3) return 'Salt and fat the whole way through — bitter cuts it, sour clears it.'
  if (rich >= 3) return 'Heavy and starchy, so the glass has to be sharp enough to cut through.'
  if (salt >= 3) return 'Salt-forward, so the glass answers with citrus and a little sweetness.'
  if (rich + salt <= 2) return 'Light and fresh, so the glass stays light and fresh too.'
  return 'Enough going on to need cutting through, not so much that a light glass drowns.'
}

if (process.argv.includes('--write')) {
  const { writeFileSync } = await import('node:fs')
  let out = src
  let n = 0
  for (const { dish, chosen } of picks) {
    const refs = chosen.map((c) => `'${c.slug}'`).join(', ')
    const before = out
    out = out.replace(
      new RegExp(`\\{ dishRef: '${dish.slug}', cocktailRefs: \\[[^\\]]*\\],\\s*\\n?\\s*i18n: \\{ en: \\{ why: (['"])[\\s\\S]*?\\1 \\} \\} \\},`),
      `{ dishRef: '${dish.slug}', cocktailRefs: [${refs}],\n    i18n: { en: { why: '${why(dish.profile)}' } } },`
    )
    if (out !== before) n++
    else console.error(`  ! не вдалось замінити: ${dish.slug}`)
  }
  writeFileSync('lib/menu-data.ts', out)
  console.log(`\nзаписано у menu-data.ts: ${n}/${picks.length}`)
}
