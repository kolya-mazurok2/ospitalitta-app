/**
 * Patch the `flag-en` symbol inside lib/flag-sprite.ts into a split flag:
 * USA in the top-left triangle (canton visible), UK Union Jack in the bottom-right,
 * divided along the anti-diagonal. Source flags live in scripts/en-flag-src/
 * (real rectangular flags, same 512x512 letterboxed layout as the rest of the sprite).
 *
 * The other flags' source SVGs are not in the repo, so the sprite can't be rebuilt
 * wholesale — this rewrites only the en symbol string.
 *
 * Usage: node scripts/patch-en-flag.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SPRITE_PATH = join(HERE, '..', 'lib', 'flag-sprite.ts')

// Flag band inside the 512x512 square (3:2 flag, letterboxed — matches the other flags).
const TOP = 85.331
const BOT = 426.668

/** Inner markup of an SVG file: drop the xml decl, comments, and the <svg> wrapper. */
function inner(file) {
  let s = readFileSync(join(HERE, 'en-flag-src', file), 'utf8')
  s = s.replace(/<\?xml[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '')
  s = s.slice(s.indexOf('>', s.indexOf('<svg')) + 1, s.lastIndexOf('</svg>'))
  return s.replace(/\s+/g, ' ').trim()
}

// clipPaths live at the sprite ROOT (siblings of the symbols), NOT inside the symbol:
// <use href="#flag-en"> clones the symbol's children, so a clipPath defined inside would
// be duplicated (two #en-us) and the clip silently fails. At the root it stays unique.
const CLIPS =
  `<clipPath id="en-us"><polygon points="0,${TOP} 512,${TOP} 0,${BOT}"/></clipPath>` +
  `<clipPath id="en-uk"><polygon points="512,${TOP} 512,${BOT} 0,${BOT}"/></clipPath>`

function buildEnSymbol() {
  const us = inner('us.svg')
  const uk = inner('uk.svg')
  return (
    '<symbol id="flag-en" viewBox="0 0 512 512">' +
    `<g clip-path="url(#en-us)">${us}</g>` +
    `<g clip-path="url(#en-uk)">${uk}</g>` +
    `<line x1="512" y1="${TOP}" x2="0" y2="${BOT}" stroke="#F0F0F0" stroke-width="4"/>` +
    '</symbol>'
  )
}

const src = readFileSync(SPRITE_PATH, 'utf8')
const m = src.match(/export const FLAG_SPRITE = ("(?:[^"\\]|\\.)*")/)
if (!m) throw new Error('FLAG_SPRITE literal not found')

let sprite = JSON.parse(m[1])
if (!/<symbol id="flag-en"[\s\S]*?<\/symbol>/.test(sprite)) throw new Error('flag-en symbol not found')

// Idempotent: drop any en clipPaths from earlier runs (inside the symbol or at root),
// rewrite the symbol, then prepend fresh root-level clipPaths.
sprite = sprite.replace(/<clipPath id="en-(?:us|uk)">[\s\S]*?<\/clipPath>/g, '')
sprite = sprite.replace(/<symbol id="flag-en"[\s\S]*?<\/symbol>/, buildEnSymbol())
sprite = CLIPS + sprite

const out = src.replace(m[1], () => JSON.stringify(sprite))
writeFileSync(SPRITE_PATH, out)
console.log('flag-en patched into a US/UK split flag (real source flags)')
