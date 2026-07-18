/**
 * Bake After Effects expressions out of a Lottie JSON.
 *
 * LottieFiles exports icons with a "control null" layer holding Base Color /
 * Highlight / Stroke width, and every stroke reads them via an AE expression.
 * Only the FULL lottie-web build evaluates expressions — lottie_light and the
 * WASM players (dotlottie/thorvg) ignore them and fall back to the static `k`
 * value, which in these files is BLACK. So the navy outline renders black.
 *
 * This resolves each expression to a literal and strips `x`, so any player
 * renders it correctly and we can ship the light build.
 *
 * Usage: node scripts/bake-lottie.mjs <in.json> <out.json> [--base "#RRGGBB"]
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [, , inPath, outPath, ...rest] = process.argv
if (!inPath || !outPath) {
  console.error('usage: node scripts/bake-lottie.mjs <in.json> <out.json> [--base "#RRGGBB"]')
  process.exit(1)
}

const hexToRgba = (hex) => {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
    1,
  ]
}

const overrides = {}
let colorMap = {}
for (let i = 0; i < rest.length; i += 2) {
  if (rest[i] === '--base') overrides['Base Color'] = hexToRgba(rest[i + 1])
  if (rest[i] === '--highlight') overrides['Highlight'] = hexToRgba(rest[i + 1])
  if (rest[i] === '--highlight2') overrides['Highlight 2'] = hexToRgba(rest[i + 1])
  // --map "#000000=#181817,#33cccc=#7E8C50" — remaps every fill/stroke of that colour
  if (rest[i] === '--map') {
    colorMap = Object.fromEntries(
      rest[i + 1].split(',').map((pair) => {
        const [from, to] = pair.split('=')
        return [from.trim().toLowerCase(), hexToRgba(to.trim())]
      })
    )
  }
}

const toHex = (rgba) =>
  '#' + rgba.slice(0, 3).map((n) => Math.round(n * 255).toString(16).padStart(2, '0')).join('')

const doc = JSON.parse(readFileSync(inPath, 'utf8'))

// Collect every control value from every null layer that carries effects.
const controls = {}
for (const layer of doc.layers ?? []) {
  for (const eff of layer.ef ?? []) {
    const value = eff.ef?.[0]?.v?.k
    if (value !== undefined) controls[eff.nm] = value
  }
}
Object.assign(controls, overrides)

let baked = 0
let unresolved = 0

const resolve = (expr) => {
  // effect('Base Color')('Color')  |  effect('Stroke width')('Slider')
  const m = /effect\('([^']+)'\)/.exec(expr)
  if (!m) return undefined
  return controls[m[1]]
}

const walk = (node) => {
  if (Array.isArray(node)) return node.forEach(walk)
  if (!node || typeof node !== 'object') return

  // A property object looks like { a: 0, k: <value>, x: "<expression>" }
  if (typeof node.x === 'string' && 'k' in node) {
    if (node.x.trim() === '') {
      delete node.x // AE leaves empty expression stubs; not a real reference
    } else {
      const value = resolve(node.x)
      if (value !== undefined) {
        node.k = value
        delete node.x
        baked++
      } else {
        unresolved++
      }
    }
  }
  Object.values(node).forEach(walk)
}

walk(doc.layers)

// Remap colours AFTER baking, so control-driven strokes get remapped too.
let recoloured = 0
const recolour = (node) => {
  if (Array.isArray(node)) return node.forEach(recolour)
  if (!node || typeof node !== 'object') return
  if ((node.ty === 'st' || node.ty === 'fl') && Array.isArray(node.c?.k)) {
    const next = colorMap[toHex(node.c.k)]
    if (next) {
      node.c.k = [...next.slice(0, 3), node.c.k[3] ?? 1]
      recoloured++
    }
  }
  Object.values(node).forEach(recolour)
}
if (Object.keys(colorMap).length) recolour(doc.layers)

// The control nulls exist only to feed the expressions we just baked.
const before = doc.layers.length
doc.layers = doc.layers.filter((l) => !(l.ty === 3 && l.ef?.length))
const dropped = before - doc.layers.length

// Re-index: `parent` and `ind` are positional, so dropping layers must remap them.
const remap = new Map(doc.layers.map((l, i) => [l.ind, i + 1]))
for (const layer of doc.layers) {
  layer.ind = remap.get(layer.ind)
  if (layer.parent !== undefined) {
    const next = remap.get(layer.parent)
    if (next === undefined) delete layer.parent
    else layer.parent = next
  }
}

writeFileSync(outPath, JSON.stringify(doc))
console.log(
  `baked ${baked} expressions, recoloured ${recoloured}, dropped ${dropped} control layer(s)` +
    (unresolved ? `, ${unresolved} UNRESOLVED` : '')
)
