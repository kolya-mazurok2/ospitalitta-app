'use server'

import { revalidateTag } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

export interface SaveItemInput {
  price_minor: number | null
  price_unit: string | null
  badge: string | null
  glass: string | null
  lvl: number | null
  flavor: string | null
  loved: boolean
  house: boolean
  available: boolean
  i18n: Record<string, { name?: string; desc?: string }>
}

export interface SaveResult {
  ok: boolean
  error?: string
}

export async function saveItem(slug: string, itemId: string, input: SaveItemInput): Promise<SaveResult> {
  const sb = supabaseAdmin()
  const { error } = await sb
    .from('menu_item')
    .update({
      price_minor: input.price_minor,
      price_unit: input.price_unit,
      badge: input.badge,
      glass: input.glass,
      lvl: input.lvl,
      flavor: input.flavor,
      loved: input.loved,
      house: input.house,
      available: input.available,
      i18n: input.i18n,
    })
    .eq('id', itemId)

  if (error) return { ok: false, error: error.message }

  // DEC-004: publishes the change to the guest menu immediately (no redeploy).
  revalidateTag(`venue:${slug}`)
  return { ok: true }
}

async function nextOrder(table: 'menu_item' | 'menu_category', col: 'category_id' | 'parent_id', parent: string) {
  const sb = supabaseAdmin()
  const { data } = await sb.from(table).select('sort_order').eq(col, parent).order('sort_order', { ascending: false }).limit(1)
  return ((data?.[0]?.sort_order as number | undefined) ?? -1) + 1
}

export async function createItem(slug: string, venueId: string, categoryId: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const sb = supabaseAdmin()
  const order = await nextOrder('menu_item', 'category_id', categoryId)
  const { data, error } = await sb.from('menu_item').insert({
    venue_id: venueId, category_id: categoryId, slug: `item-${Date.now()}`,
    i18n: { en: { name: 'New item' } }, available: true, sort_order: order,
  }).select('id').single()
  if (error) return { ok: false, error: error.message }
  revalidateTag(`venue:${slug}`)
  return { ok: true, id: data.id }
}

export async function createCategory(slug: string, venueId: string, parentId: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const sb = supabaseAdmin()
  const order = await nextOrder('menu_category', 'parent_id', parentId)
  const { data, error } = await sb.from('menu_category').insert({
    venue_id: venueId, parent_id: parentId, key: `cat-${Date.now()}`,
    i18n: { en: { label: 'New category' } }, sort_order: order,
  }).select('id').single()
  if (error) return { ok: false, error: error.message }
  revalidateTag(`venue:${slug}`)
  return { ok: true, id: data.id }
}

export async function deleteItem(slug: string, itemId: string): Promise<SaveResult> {
  const sb = supabaseAdmin()
  const { error } = await sb.from('menu_item').delete().eq('id', itemId)
  if (error) return { ok: false, error: error.message }
  revalidateTag(`venue:${slug}`)
  return { ok: true }
}

export async function deleteCategory(slug: string, catId: string): Promise<SaveResult> {
  const sb = supabaseAdmin()
  const { error } = await sb.from('menu_category').delete().eq('id', catId)
  if (error) return { ok: false, error: error.message }
  revalidateTag(`venue:${slug}`)
  return { ok: true }
}

async function swapOrder(table: 'menu_item' | 'menu_category', col: 'category_id' | 'parent_id', id: string, dir: 'up' | 'down'): Promise<SaveResult> {
  const sb = supabaseAdmin()
  const { data: cur } = await sb.from(table).select(`id, sort_order, ${col}`).eq('id', id).single()
  if (!cur) return { ok: false, error: 'not found' }
  const parent = (cur as Record<string, unknown>)[col] as string
  const { data: sibs } = await sb.from(table).select('id, sort_order').eq(col, parent).order('sort_order')
  if (!sibs) return { ok: false }
  const idx = sibs.findIndex(s => s.id === id)
  const j = dir === 'up' ? idx - 1 : idx + 1
  if (j < 0 || j >= sibs.length) return { ok: true } // edge, no-op
  await sb.from(table).update({ sort_order: sibs[j].sort_order }).eq('id', sibs[idx].id)
  await sb.from(table).update({ sort_order: sibs[idx].sort_order }).eq('id', sibs[j].id)
  return { ok: true }
}

export async function moveItem(slug: string, itemId: string, dir: 'up' | 'down'): Promise<SaveResult> {
  const res = await swapOrder('menu_item', 'category_id', itemId, dir)
  if (res.ok) revalidateTag(`venue:${slug}`)
  return res
}

export async function moveCategory(slug: string, catId: string, dir: 'up' | 'down'): Promise<SaveResult> {
  const res = await swapOrder('menu_category', 'parent_id', catId, dir)
  if (res.ok) revalidateTag(`venue:${slug}`)
  return res
}

// ----- media (Supabase Storage) -----
const MEDIA_BUCKET = 'menu-media'

async function ensureMediaBucket() {
  const sb = supabaseAdmin()
  const { data } = await sb.storage.getBucket(MEDIA_BUCKET)
  if (!data) await sb.storage.createBucket(MEDIA_BUCKET, { public: true }).catch(() => {})
}

export async function createUploadUrl(
  slug: string, itemId: string, kind: 'image' | 'video', ext: string,
): Promise<{ ok: boolean; path?: string; token?: string; publicUrl?: string; error?: string }> {
  await ensureMediaBucket()
  const sb = supabaseAdmin()
  const safeExt = (ext || (kind === 'image' ? 'jpg' : 'mp4')).toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `${slug}/${itemId}/${kind}-${Date.now()}.${safeExt}`
  const { data, error } = await sb.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path)
  if (error || !data) return { ok: false, error: error?.message ?? 'no upload url' }
  const { data: pub } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return { ok: true, path: data.path, token: data.token, publicUrl: pub.publicUrl }
}

export async function setMedia(slug: string, itemId: string, kind: 'image' | 'video', url: string | null): Promise<SaveResult> {
  const sb = supabaseAdmin()
  const col = kind === 'image' ? 'image_url' : 'video_url'
  const { error } = await sb.from('menu_item').update({ [col]: url }).eq('id', itemId)
  if (error) return { ok: false, error: error.message }
  revalidateTag(`venue:${slug}`)
  return { ok: true }
}
