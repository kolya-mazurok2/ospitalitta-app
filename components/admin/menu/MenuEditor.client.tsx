'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EditTree, EditCategory, EditItem } from '@/lib/admin-repo'
import {
  saveItem, createItem, createCategory, deleteItem, deleteCategory, moveItem, moveCategory,
  createUploadUrl, setMedia, type SaveItemInput,
} from '@/app/admin/(dashboard)/menu/actions'
import { supabaseBrowser } from '@/lib/supabase-browser'
import Icon, { type IconName } from '@/components/admin/Icon'

const MEDIA_BUCKET = 'menu-media'

const GLASS_OPTIONS = ['wine', 'collins', 'rocks', 'martini', 'coupe']
const TOP_LABEL: Record<'cocktail' | 'food', string> = { cocktail: 'Drinks', food: 'Food' }
const LOCALE_NAMES: Record<string, string> = {
  en: 'English', sq: 'Albanian', it: 'Italian', pl: 'Polish',
  uk: 'Ukrainian', de: 'German', fr: 'French', no: 'Norwegian',
}

function priceLabel(minor: number | null, unit: string | null): string {
  if (minor == null) return ''
  return `L${minor}${unit ? `/${unit}` : ''}`
}

interface Selected { type: 'item' | 'category'; id: string }

export default function MenuEditor({ tree }: { tree: EditTree }) {
  const base = tree.venue.defaultLocale
  const [selected, setSelected] = useState<Selected | null>(null)
  // collapse every sub-category except the first one (only one open by default)
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    const subs = tree.topCategories.flatMap(t => t.children.map(c => c.id))
    return new Set(subs.slice(1))
  })
  const [locale, setLocale] = useState(base)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  // TODO: bulk-publish all pending edits to the DB + revalidateTag in one shot.
  // For now per-item Save already persists; this just confirms.
  const publish = () => showToast('Menu published · all updated')

  const router = useRouter()
  const slug = tree.venue.slug
  const venueId = tree.venue.id

  const addItem = async (categoryId: string) => {
    const res = await createItem(slug, venueId, categoryId)
    if (res.ok && res.id) { setSelected({ type: 'item', id: res.id }); showToast('Item added') }
    router.refresh()
  }
  const addCategory = async (parentId: string) => {
    const res = await createCategory(slug, venueId, parentId)
    if (res.ok && res.id) { setSelected({ type: 'category', id: res.id }); showToast('Sub-category added') }
    router.refresh()
  }
  const removeNode = async (type: 'item' | 'category', id: string) => {
    const res = await (type === 'item' ? deleteItem(slug, id) : deleteCategory(slug, id))
    setSelected(null)
    if (res.ok) showToast(type === 'item' ? 'Item deleted' : 'Category deleted')
    router.refresh()
  }
  const moveNode = async (type: 'item' | 'category', id: string, dir: 'up' | 'down') => {
    await (type === 'item' ? moveItem(slug, id, dir) : moveCategory(slug, id, dir))
    router.refresh()
  }

  // flat lookups
  const { catById, itemById, catOfItem } = useMemo(() => {
    const catById = new Map<string, EditCategory>()
    const itemById = new Map<string, EditItem>()
    const catOfItem = new Map<string, EditCategory>()
    for (const top of tree.topCategories)
      for (const c of top.children) {
        catById.set(c.id, c)
        for (const it of c.items) { itemById.set(it.id, it); catOfItem.set(it.id, c) }
      }
    return { catById, itemById, catOfItem }
  }, [tree])

  const toggle = (id: string) =>
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const selItem = selected?.type === 'item' ? itemById.get(selected.id) ?? null : null
  const selCat = selected?.type === 'category' ? catById.get(selected.id) ?? null : null

  return (
    <>
      {/* page header */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 13, height: 58, padding: '0 22px',
        background: 'var(--surface-panel)', borderBottom: '1px solid var(--line)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          menu editor
        </span>
        <LanguageSwitcher locales={tree.venue.locales} base={base} value={locale} onChange={setLocale} />
        <button onClick={publish} className="admin-btn-primary" style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#FAF4E8', background: 'var(--ink)',
          border: 'none', padding: '8px 16px', borderRadius: 'var(--r-asym-sm)', cursor: 'pointer',
        }}>
          Publish
        </button>
      </header>

      {/* body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* tree */}
        <aside style={{
          width: 320, flexShrink: 0, background: 'var(--surface-panel)',
          borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--line-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              Menu tree
            </span>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '6px 0' }}>
            {tree.topCategories.map(top => {
              const topCollapsed = collapsed.has(top.id)
              return (
                <div key={top.id}>
                  <Row
                    pad={0} caret={top.children.length ? (topCollapsed ? '▶' : '▼') : null}
                    onCaret={() => toggle(top.id)}
                    label={TOP_LABEL[top.key]} fs={12} weight={700} tracking="0.08em"
                    color="var(--ink-2)"
                    trailing={<TreeAddBtn title="Add sub-category" onClick={() => addCategory(top.id)} />}
                  />
                  {!topCollapsed && top.children.map(cat => {
                    const catCollapsed = collapsed.has(cat.id)
                    const label = cat.i18n[locale]?.label ?? cat.i18n[base]?.label ?? cat.key
                    return (
                      <div key={cat.id}>
                        <Row
                          pad={14} caret={cat.items.length ? (catCollapsed ? '▶' : '▼') : null}
                          onCaret={() => toggle(cat.id)}
                          onSelect={() => setSelected({ type: 'category', id: cat.id })}
                          selected={selected?.type === 'category' && selected.id === cat.id}
                          label={label} fs={14} weight={600} color="var(--ink)"
                        />
                        {!catCollapsed && cat.items.map(it => {
                          const name = it.i18n[locale]?.name ?? it.i18n[base]?.name ?? it.slug
                          return (
                            <Row
                              key={it.id} pad={30}
                              onSelect={() => setSelected({ type: 'item', id: it.id })}
                              selected={selected?.type === 'item' && selected.id === it.id}
                              label={name} fs={14} weight={400} color="var(--ink)"
                              marks={[
                                it.house ? { icon: 'house' as IconName, color: 'var(--brand)' } : null,
                                it.loved ? { icon: 'loved' as IconName, color: 'var(--danger)' } : null,
                                !it.available ? { text: '86', color: 'var(--s-danger-ink)' } : null,
                              ]}
                              price={priceLabel(it.price_minor, it.price_unit)}
                            />
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <div style={{
            borderTop: '1px solid var(--line-subtle)', padding: '11px 16px', display: 'flex', gap: 16,
            flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="house" size={12} style={{ color: 'var(--brand)' }} /> signature</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="loved" size={12} style={{ color: 'var(--danger)' }} /> loved</span>
            <span><span style={{ color: 'var(--s-danger-ink)' }}>86</span> out</span>
          </div>
        </aside>

        {/* editor */}
        <section style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {selItem ? (
            <ItemForm
              key={selItem.id}
              slug={tree.venue.slug}
              base={base}
              locale={locale}
              cat={catOfItem.get(selItem.id) ?? null}
              item={selItem}
              onMove={dir => moveNode('item', selItem.id, dir)}
              onDelete={() => removeNode('item', selItem.id)}
              onToast={showToast}
              onRefresh={() => router.refresh()}
            />
          ) : selCat ? (
            <CategoryPanel
              base={base} locale={locale} cat={selCat}
              onAddItem={() => addItem(selCat.id)}
              onMove={dir => moveNode('category', selCat.id, dir)}
              onDelete={() => removeNode('category', selCat.id)}
            />
          ) : (
            <Empty />
          )}
        </section>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: '#FAF4E8', padding: '12px 20px', borderRadius: 'var(--r-asym-sm)',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, zIndex: 100,
          boxShadow: '0 8px 26px rgba(21,17,14,0.2)', display: 'flex', alignItems: 'center', gap: 9,
        }}>
          <span style={{ color: 'var(--success)' }}>✓</span>{toast}
        </div>
      )}
    </>
  )
}

// ---------- tree row ----------
function Row({
  pad, caret, onCaret, onSelect, selected, label, fs, weight, color, tracking, marks, price, trailing,
}: {
  pad: number; caret?: string | null; onCaret?: () => void; onSelect?: () => void
  selected?: boolean; label: string; fs: number; weight: number; color: string; tracking?: string
  marks?: ({ icon?: IconName; text?: string; color: string } | null)[]; price?: string; trailing?: React.ReactNode
}) {
  return (
    <div
      onClick={onSelect}
      className={onSelect ? 'admin-nav-link' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 7, height: 38, paddingRight: 12,
        cursor: onSelect ? 'pointer' : 'default',
        background: selected ? 'var(--fill-selected)' : 'transparent',
      }}
    >
      <span style={{ width: pad, flexShrink: 0 }} />
      {caret != null ? (
        <span onClick={e => { e.stopPropagation(); onCaret?.() }} style={{ width: 15, textAlign: 'center', color: 'var(--ink-3)', fontSize: 9, flexShrink: 0, cursor: 'pointer' }}>
          {caret}
        </span>
      ) : (
        <span style={{ width: 15, flexShrink: 0 }} />
      )}
      <span style={{
        flex: 1, minWidth: 0, fontSize: fs, fontWeight: weight, color,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        letterSpacing: tracking, textTransform: tracking ? 'uppercase' : undefined,
      }}>
        {label}
      </span>
      {marks?.filter(Boolean).map((m, i) => (
        m!.icon
          ? <Icon key={i} name={m!.icon} size={12} style={{ color: m!.color }} />
          : <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: m!.color, flexShrink: 0 }}>{m!.text}</span>
      ))}
      {price ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', flexShrink: 0 }}>{price}</span> : null}
      {trailing}
    </div>
  )
}

function TreeAddBtn({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick() }} title={title} style={{
      width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink-2)', cursor: 'pointer',
      fontSize: 13, lineHeight: 1, marginLeft: 4,
    }}>+</button>
  )
}

function GhostBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink)', background: 'transparent',
      border: '1px solid var(--line-strong)', padding: '8px 12px', borderRadius: 'var(--r-asym-sm)', cursor: 'pointer',
    }}>{children}</button>
  )
}

function NodeToolbar({ onMove, onDelete, deleteLabel, extra }: {
  onMove: (d: 'up' | 'down') => void; onDelete: () => void; deleteLabel: string; extra?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
      {extra}
      <GhostBtn onClick={() => onMove('up')}>Move up</GhostBtn>
      <GhostBtn onClick={() => onMove('down')}>Move down</GhostBtn>
      <DeleteButton onDelete={onDelete} label={deleteLabel} />
    </div>
  )
}

function DeleteButton({ onDelete, label }: { onDelete: () => void; label: string }) {
  const [confirming, setConfirming] = useState(false)
  const danger: React.CSSProperties = {
    fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: '#9A2E10', background: 'transparent',
    border: '1px solid #E6B9A6', padding: '8px 14px', borderRadius: '7px 0 0 7px', cursor: 'pointer',
  }
  if (!confirming) return <button onClick={() => setConfirming(true)} style={danger}>Delete</button>
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--ink-2)' }}>{label}</span>
      <button onClick={onDelete} style={{ ...danger, color: '#FAF4E8', background: 'var(--danger)', border: '1px solid var(--danger)' }}>Yes, delete</button>
      <button onClick={() => setConfirming(false)} style={{
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink)', background: 'transparent',
        border: '1px solid var(--line-strong)', padding: '8px 12px', borderRadius: 'var(--r-asym-sm)', cursor: 'pointer',
      }}>Cancel</button>
    </span>
  )
}

// ---------- item form ----------
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', display: 'block', marginBottom: 7,
}

function LanguageSwitcher({ locales, base, value, onChange }: {
  locales: string[]; base: string; value: string; onChange: (l: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginLeft: 'auto', position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
        border: '1px solid var(--line)', padding: '7px 12px', borderRadius: 'var(--r-asym-sm)', cursor: 'pointer',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Editing language</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{value.toUpperCase()}</span>
        <Icon name="chevron" size={11} style={{ color: 'var(--ink-3)' }} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{
            position: 'absolute', top: 42, right: 0, width: 212, background: 'var(--surface-raised)',
            border: '1px solid var(--line)', borderRadius: 'var(--r-asym-sm)', boxShadow: '0 8px 26px rgba(21,17,14,0.12)',
            padding: 6, zIndex: 30, maxHeight: 330, overflowY: 'auto',
          }}>
            {locales.map(code => {
              const on = code === value
              return (
                <button key={code} onClick={() => { onChange(code); setOpen(false) }} className={on ? undefined : 'admin-nav-link'} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink)',
                  background: on ? 'var(--fill-selected)' : 'transparent', border: 'none', padding: 8,
                  borderRadius: '6px 0 0 6px', cursor: 'pointer',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', width: 26, flexShrink: 0 }}>{code.toUpperCase()}</span>
                  <span style={{ flex: 1 }}>{LOCALE_NAMES[code] ?? code}</span>
                  {code === base && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B06A1E' }}>base</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function TransPair({ baseText, value, onChange, baseLabel, multiline }: {
  baseText: string; value: string; onChange: (v: string) => void; baseLabel: string; multiline: boolean
}) {
  const filled = value.trim().length > 0
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
      <div style={{ background: 'var(--surface-panel)', border: '1px solid var(--line-subtle)', padding: '11px 13px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 5 }}>{baseLabel}</div>
        <div style={{ fontSize: multiline ? 14 : 15, lineHeight: 1.5, color: 'var(--ink-2)' }}>{baseText || '—'}</div>
      </div>
      <div>
        {multiline
          ? <textarea className="admin-field" value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder="Add translation" style={{ resize: 'vertical' }} />
          : <input className="admin-field" value={value} onChange={e => onChange(e.target.value)} placeholder="Add translation" />}
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: filled ? 'var(--s-success-ink)' : 'var(--ink-4)' }}>
          {filled ? 'filled' : 'empty · falls back to base'}
        </div>
      </div>
    </div>
  )
}

function ItemForm({ slug, base, locale, cat, item, onMove, onDelete, onToast, onRefresh }: {
  slug: string; base: string; locale: string; cat: EditCategory | null; item: EditItem
  onMove: (d: 'up' | 'down') => void; onDelete: () => void; onToast: (m: string) => void; onRefresh: () => void
}) {
  const isCocktail = cat?.type === 'cocktail'
  const isTarget = locale !== base
  const [i18n, setI18n] = useState<Record<string, { name?: string; desc?: string }>>(item.i18n)
  const [amount, setAmount] = useState(item.price_minor != null ? String(item.price_minor) : '')
  const [unit, setUnit] = useState(item.price_unit ?? '')
  const [badge, setBadge] = useState(item.badge ?? '')
  const [glass, setGlass] = useState(item.glass ?? '')
  const [lvl, setLvl] = useState(item.lvl ?? 0)
  const [loved, setLoved] = useState(item.loved)
  const [house, setHouse] = useState(item.house)
  const [available, setAvailable] = useState(item.available)
  const [saving, setSaving] = useState(false)

  const name = i18n[locale]?.name ?? ''
  const desc = i18n[locale]?.desc ?? ''
  const setName = (v: string) => setI18n(p => ({ ...p, [locale]: { ...(p[locale] ?? {}), name: v } }))
  const setDesc = (v: string) => setI18n(p => ({ ...p, [locale]: { ...(p[locale] ?? {}), desc: v } }))
  const titleName = i18n[base]?.name || item.slug
  const catLabel = cat?.i18n[locale]?.label ?? cat?.i18n[base]?.label ?? cat?.key

  const onSave = async () => {
    setSaving(true)
    const input: SaveItemInput = {
      price_minor: amount.trim() === '' ? null : parseInt(amount, 10),
      price_unit: unit || null,
      badge: badge.trim() || null,
      glass: isCocktail ? (glass || null) : null,
      lvl: isCocktail && lvl ? (lvl as number) : null,
      flavor: item.flavor,
      loved, house, available,
      i18n,
    }
    const res = await saveItem(slug, item.id, input)
    setSaving(false)
    onToast(res.ok ? 'Saved · live updated' : 'Save failed')
  }

  return (
    <div style={{ flex: 1, padding: '26px 34px 36px', maxWidth: 860, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', paddingTop: 8 }}>
          {TOP_LABEL[cat?.type ?? 'cocktail']} · {catLabel}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={onSave} disabled={saving} className="admin-btn-primary" style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#FAF4E8', background: 'var(--ink)',
            border: 'none', padding: '8px 18px', borderRadius: 'var(--r-asym-sm)',
            cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving' : 'Save'}
          </button>
          <NodeToolbar onMove={onMove} onDelete={onDelete} deleteLabel="Delete this item?" />
        </div>
      </div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 26, lineHeight: 1.15, color: 'var(--ink)', marginTop: 10 }}>
        {titleName}
      </h1>

      {/* media */}
      <div style={{ marginTop: 22, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <MediaSlot slug={slug} itemId={item.id} kind="image" label="Photo · poster" w={150} h={150} url={item.image_url} onToast={onToast} onRefresh={onRefresh} />
        <MediaSlot slug={slug} itemId={item.id} kind="video" label="Video · optional" w={150} h={86} url={item.video_url} onToast={onToast} onRefresh={onRefresh} />
      </div>

      {/* name + desc · base or translation */}
      <div style={{ marginTop: 26 }}>
        {!isTarget ? (
          <>
            <label style={labelStyle}>Name * · {base.toUpperCase()} base</label>
            <input className="admin-field" value={name} onChange={e => setName(e.target.value)} placeholder="Item name" />
            <label style={{ ...labelStyle, margin: '16px 0 7px' }}>Description</label>
            <textarea className="admin-field" value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Short description" style={{ resize: 'vertical' }} />
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                Translating to {LOCALE_NAMES[locale] ?? locale.toUpperCase()}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                optional · guests fall back to {base.toUpperCase()}
              </span>
            </div>
            <label style={labelStyle}>Name</label>
            <TransPair baseText={i18n[base]?.name ?? ''} value={name} onChange={setName} baseLabel={`base · ${base.toUpperCase()}`} multiline={false} />
            <label style={{ ...labelStyle, margin: '18px 0 7px' }}>Description</label>
            <TransPair baseText={i18n[base]?.desc ?? ''} value={desc} onChange={setDesc} baseLabel={`base · ${base.toUpperCase()}`} multiline />
          </>
        )}
      </div>

      {/* price */}
      <div style={{ marginTop: 22, display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ width: 150 }}>
          <label style={labelStyle}>Amount *</label>
          <input className="admin-field" inputMode="numeric" value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="600" />
        </div>
        <div style={{ width: 150 }}>
          <label style={labelStyle}>Unit</label>
          <select className="admin-field" value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="">none</option>
            <option value="kg">/kg</option>
            <option value="100g">/100g</option>
          </select>
        </div>
        <div style={{ width: 150 }}>
          <label style={labelStyle}>Badge · optional</label>
          <input className="admin-field" value={badge} onChange={e => setBadge(e.target.value)} placeholder="e.g. For 2" />
        </div>
        <div style={{ alignSelf: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', paddingBottom: 12 }}>
          = {priceLabel(amount ? parseInt(amount, 10) : null, unit || null) || '—'} Lekë
        </div>
      </div>

      {/* cocktail-only */}
      {isCocktail && (
        <div style={{ marginTop: 22, display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 150 }}>
            <label style={labelStyle}>Glass</label>
            <select className="admin-field" value={glass} onChange={e => setGlass(e.target.value)}>
              <option value="">none</option>
              {GLASS_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Flavor intensity</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3].map(n => (
                <button key={n} type="button" onClick={() => setLvl(lvl === n ? 0 : n)} style={{
                  width: 40, height: 40, cursor: 'pointer', border: `1px solid ${lvl >= n ? 'var(--core)' : 'var(--line)'}`,
                  background: lvl >= n ? 'var(--fill-selected)' : 'var(--surface-raised)',
                  color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: 13,
                }}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* toggles */}
      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Toggle label="Available" on={available} onClick={() => setAvailable(v => !v)} />
        <Toggle label="Signature" icon="house" on={house} onClick={() => setHouse(v => !v)} />
        <Toggle label="Loved" icon="loved" on={loved} onClick={() => setLoved(v => !v)} />
      </div>

    </div>
  )
}

function Toggle({ label, on, onClick, icon }: { label: string; on: boolean; onClick: () => void; icon?: IconName }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer',
      border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`, background: on ? 'var(--fill-selected)' : 'var(--surface-raised)',
      padding: '9px 13px', borderRadius: 'var(--r-asym-sm)',
    }}>
      <span style={{
        width: 16, height: 16, flexShrink: 0, background: on ? 'var(--ink)' : 'transparent',
        border: `1px solid ${on ? 'var(--ink)' : 'var(--line-strong)'}`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {on && <span style={{ color: '#FAF4E8', fontSize: 11, lineHeight: 1 }}>✓</span>}
      </span>
      <span style={{ fontSize: 14, color: 'var(--ink)' }}>{label}</span>
      {icon && <Icon name={icon} size={14} style={{ color: 'var(--ink-2)' }} />}
    </button>
  )
}

function MediaSlot({ slug, itemId, kind, label, w, h, url, onToast, onRefresh }: {
  slug: string; itemId: string; kind: 'image' | 'video'; label: string; w: number; h: number
  url: string | null; onToast: (m: string) => void; onRefresh: () => void
}) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setBusy(true)
    const ext = file.name.split('.').pop() ?? ''
    const res = await createUploadUrl(slug, itemId, kind, ext)
    if (!res.ok || !res.path || !res.token || !res.publicUrl) { setBusy(false); onToast('Upload failed'); return }
    const { error } = await supabaseBrowser().storage.from(MEDIA_BUCKET).uploadToSignedUrl(res.path, res.token, file)
    if (error) { setBusy(false); onToast('Upload failed'); return }
    await setMedia(slug, itemId, kind, res.publicUrl)
    setBusy(false)
    onToast(kind === 'image' ? 'Photo updated' : 'Video updated')
    onRefresh()
  }

  const remove = async () => {
    await setMedia(slug, itemId, kind, null)
    onToast(kind === 'image' ? 'Photo removed' : 'Video removed')
    onRefresh()
  }

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>{label}</div>
      <div
        onClick={() => !busy && inputRef.current?.click()}
        style={{
          width: w, height: h, background: 'var(--surface-raised)', border: '1px dashed var(--line-strong)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          cursor: busy ? 'default' : 'pointer', overflow: 'hidden', position: 'relative',
        }}
      >
        {url ? (
          kind === 'image'
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <video src={url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <>
            <span style={{ fontSize: 22, color: 'var(--ink-4)', lineHeight: 1 }}>+</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-3)' }}>Add {kind}</span>
          </>
        )}
        {busy && (
          <span style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(251,247,238,0.82)', fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)',
          }}>Uploading…</span>
        )}
      </div>
      {url && (
        <button onClick={remove} style={{
          marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: '#9A2E10', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        }}>Remove</button>
      )}
      <input
        ref={inputRef} type="file" accept={kind === 'image' ? 'image/*' : 'video/*'} style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }}
      />
    </div>
  )
}

function CategoryPanel({ base, locale, cat, onAddItem, onMove, onDelete }: {
  base: string; locale: string; cat: EditCategory
  onAddItem: () => void; onMove: (d: 'up' | 'down') => void; onDelete: () => void
}) {
  return (
    <div style={{ flex: 1, padding: '26px 34px 36px', maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', paddingTop: 8 }}>
          {TOP_LABEL[cat.type]} · sub-category
        </div>
        <NodeToolbar onMove={onMove} onDelete={onDelete} deleteLabel="Delete category and all its items?" extra={<GhostBtn onClick={onAddItem}>+ Item</GhostBtn>} />
      </div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 26, color: 'var(--ink)', marginTop: 10 }}>
        {cat.i18n[locale]?.label ?? cat.i18n[base]?.label ?? cat.key}
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-2)', marginTop: 16 }}>
        {cat.items.length} items. Use <b style={{ color: 'var(--ink)' }}>+ Item</b> to add one. Renaming and translating the category lands next.
      </p>
    </div>
  )
}

function Empty() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
        Select an item or category to edit
      </span>
    </div>
  )
}
