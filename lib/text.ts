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
