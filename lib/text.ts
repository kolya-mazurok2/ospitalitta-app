/**
 * Compact-list description cap.
 *
 * CSS ellipsis already cuts at the container edge, but that cut moves with screen
 * width and font scale — a wide phone shows a long tail, a narrow one shows almost
 * nothing. Capping the string first makes every row end at the same place.
 *
 * 77 = the length of the Aperol Spritz line, taken as the reference row.
 */
export const LIST_DESC_MAX = 77

export function clampDesc(desc: string, max = LIST_DESC_MAX): string {
  if (desc.length <= max) return desc
  return `${desc.slice(0, max).trimEnd()}…`
}

/** Sweetness level read from a dessert description: very=3, medium/plain=2, lightly/little=1. */
export function sweetLevel(desc: string): 1 | 2 | 3 | undefined {
  const d = desc.toLowerCase()
  if (/very sweet/.test(d)) return 3
  if (/lightly sweet|little sweet/.test(d)) return 1
  if (/medium sweet|mid sweet|\bsweet\b/.test(d)) return 2
  return undefined
}
