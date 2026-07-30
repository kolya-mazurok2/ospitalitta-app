'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import TasteMark from '@/components/TasteMark'
import { FlavourGlyph, SizeGlyph, TasteGlyph } from '@/components/MenuGlyphs'
import VariantSlider from '@/components/VariantSlider'

const TASTE_LABEL: Record<'bitter' | 'sour' | 'sweet', string> = {
  bitter: 'Bitterness', sour: 'Sourness', sweet: 'Sweetness',
}

/** One rhythm step between the blocks under the title (24px). Every block owns its TOP
 *  margin and nothing owns a bottom one, so the gap never depends on what comes after and
 *  two neighbours can't quietly add up to a different number. */
const BLOCK_GAP = '1.5rem'
/** Section label → its own content, inside a block. */
const LABEL_GAP = '0.5625rem'

/** Shared look of the Size/Flavour and Taste section labels. */
const sectionLabel: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
  fontFamily: 'var(--font-text)', fontSize: '0.6875rem', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-faint)',
}

/** One taste characteristic in its own box: small mark + label on top, n-of-3 scale below.
 *  Boxes sit in a row, so several characteristics read as a set, not a stack. */
function TasteBox({ taste, label, n, single }: {
  taste: 'bitter' | 'sour' | 'sweet'; label: string; n: 1 | 2 | 3; single?: boolean
}) {
  return (
    <div style={{
      border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        fontFamily: 'var(--font-text)', fontSize: '0.625rem', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)',
      }}>
        <span style={{ color: 'var(--brand)', display: 'inline-flex' }}>
          <TasteMark taste={taste} n={1} single size={13} />
        </span>
        <span>{label}</span>
      </div>
      <div style={{ color: 'var(--brand)' }}>
        <TasteMark taste={taste} n={n} single={single} size={22} style={{ gap: 5 }} />
      </div>
    </div>
  )
}
import CartBar from '@/components/CartBar'
import SectionNote from '@/components/SectionNote'
import ListSheet from '@/components/ListSheet'
import AddedToast from '@/components/AddedToast'
import { useCart } from '@/lib/useCart'
import { money } from '@/lib/locale'
import { lsSet } from '@/lib/storage'
import { track } from '@/lib/analytics'
import { TASTE_KEYS } from '@/lib/menu-data'
import type { ItemDetail } from '@/lib/item-detail'
import { useState } from 'react'

interface Props {
  detail: ItemDetail
  venueSlug: string
  reviewUrl?: string
}

/**
 * Full product page. Replaces the old 60% bottom sheet.
 *
 * Back always lands the guest on the menu tab this item belongs to — including when
 * they arrived by a shared link and have no history to go back through. The tab is
 * written to localStorage before navigating, which is the same channel the menu already
 * reads its landing tab from.
 */
export default function ItemPage({ detail, venueSlug, reviewUrl }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const { cart, count, total, toast, add, changeQty, clear, placed, place, unplace } = useCart(venueSlug)
  const [showList, setShowList] = useState(false)

  // Size (S/M/L) or variant (flavour) options — one selected at a time, price follows.
  const options = detail.sizes ?? detail.variants
  const optionLabel = detail.sizes ? 'Size' : 'Flavour'
  const foodSweet = detail.isFood ? detail.sweet : undefined
  const [optIdx, setOptIdx] = useState(0)
  const selected = options?.[optIdx]
  // Hero slider is for FLAVOUR variants only (each has its own image). Sizes (S/M/L) share
  // one image, so switching size must NOT swipe the hero.
  const flavourImages = detail.variants && detail.variants.length > 1 && detail.variants.some(v => v.posterSrc || v.videoSrc)
    ? detail.variants.map(o => ({ src: o.posterSrc ?? detail.posterSrc ?? '', alt: detail.name, videoSrc: o.videoSrc }))
    : null
  const selPriceRaw = selected ? (Number(selected.price.replace(/\D/g, '')) || 0) : detail.rawPrice
  const selPriceText = selected ? money(selected.price) : detail.price
  const addName = selected ? `${detail.name} (${selected.label})` : detail.name
  const addSlug = selected ? `${detail.slug}-${selected.label.toLowerCase().replace(/\s+/g, '-')}` : detail.slug

  const menuHref = `/venue/${venueSlug}/menu`

  const reviewLink = (chunks: React.ReactNode) => (
    <a href={reviewUrl} target="_blank" rel="noopener noreferrer"
      style={{ color: 'var(--brand)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
      {chunks}
    </a>
  )

  const rememberSection = (sectionKey: string, isFood: boolean) => {
    lsSet(`osp_cat_${venueSlug}`, isFood ? 'food' : 'cocktails')
    if (isFood) lsSet(`osp_foodtab_${venueSlug}`, sectionKey)
    else if (TASTE_KEYS.has(sectionKey)) lsSet(`osp_taste_${venueSlug}`, sectionKey)
  }

  const goBack = () => {
    rememberSection(detail.sectionKey, detail.isFood)
    router.push(menuHref)
  }

  const openDish = (slug: string) => {
    router.push(`/venue/${venueSlug}/menu/${slug}`)
  }

  const tasteRows = detail.tastes?.length
    ? detail.tastes
    : (detail.taste && detail.n ? [{ taste: detail.taste, n: detail.n }] : [])

  const pairLabel = detail.isFood ? t('pairing.plate_label') : t('pairing.drink_label')

  const cartLines = cart.map(ci => ({
    slug: ci.slug, name: ci.name, qty: ci.qty,
    lineTotal: money(`L${ci.price * ci.qty}`),
    onMinus: () => changeQty(ci.slug, -1),
    onPlus: () => changeQty(ci.slug, 1),
    onOpen: () => { setShowList(false); openDish(ci.slug) },
  }))

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
      position: 'relative', background: 'var(--surface)',
    }}>
      <div className="scrollbar-none" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* hero — full-bleed, the back control floats on top of it */}
        <div style={{
          position: 'relative', aspectRatio: '4/3',
          background: 'var(--surface-media)', overflow: 'hidden',
        }}>
          {/* Still only. The card in the list is where the clip plays; repeating it here
              would fetch several MB for a screen the guest is reading, not scanning. */}
          {flavourImages ? (
            // Same swipe slider as the grid card, synced to the selected flavour.
            <VariantSlider
              images={flavourImages}
              index={optIdx}
              onIndexChange={setOptIdx}
              priority
            />
          ) : (selected?.posterSrc ?? detail.posterSrc) ? (
            // Same file the card already showed, so this is a cache hit, not a second download.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={selected?.posterSrc ?? detail.posterSrc} className="osp-fade"
              src={selected?.posterSrc ?? detail.posterSrc} alt={detail.name}
              fetchPriority="high" decoding="async"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : null}

          {/* Back = app chrome (frosted glass + full arrow), deliberately NOT the slider's
              solid espresso chevron circles, so the two never read as the same control. */}
          <button
            onClick={goBack}
            aria-label="Back to menu"
            style={{
              position: 'absolute', top: 14, left: 14, zIndex: 3,
              width: 40, height: 40, borderRadius: '50%',
              border: '1px solid rgb(255 255 255 / 0.22)',
              background: 'rgb(20 15 11 / 0.42)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
              boxShadow: '0 4px 14px rgb(0 0 0 / 0.28)',
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ display: 'block' }} aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>

        </div>

        <div style={{ padding: '18px 24px 160px' }}>
          {/* name — no house mark and no "loved here" here on purpose: both marks are grid
              affordances that help the guest pick between cards, and the guest who opened
              this page has already picked. */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4375rem',
            letterSpacing: '0.01em', color: 'var(--ink)', lineHeight: 1.15, margin: 0,
          }}>
            {detail.name}
          </h1>

          {/* Size / Flavour switcher — right under the title */}
          {options && (
            <div style={{ marginTop: BLOCK_GAP, display: 'flex', flexDirection: 'column', gap: LABEL_GAP }}>
              <div style={sectionLabel}>
                {detail.sizes && <span style={{ color: 'var(--brand)', display: 'inline-flex' }}><SizeGlyph size={13} /></span>}
                {detail.variants && <span style={{ color: 'var(--brand)', display: 'inline-flex' }}><FlavourGlyph size={13} /></span>}
                <span>{optionLabel}</span>
              </div>
              {/* Pills carry 15px of inner padding, so their label text starts well inside the
                  content gutter and reads as indented against the title above. Pulling the row
                  out by 12px lands that text back on the gutter line. */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: -12 }}>
                {options.map((o, i) => (
                  <button
                    key={o.label}
                    onClick={() => setOptIdx(i)}
                    style={{
                      fontFamily: 'var(--font-text)', fontSize: '0.8125rem', fontWeight: 600,
                      letterSpacing: '0.04em', padding: '7px 15px', borderRadius: 999, cursor: 'pointer',
                      border: '1px solid ' + (i === optIdx ? 'var(--brand)' : 'var(--line-strong)'),
                      background: i === optIdx ? 'var(--brand)' : 'transparent',
                      color: i === optIdx ? 'var(--fab-fg)' : 'var(--ink-body)',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Taste characteristics — own section, so bitterness/sweetness read as one group
              under a heading instead of loose boxes floating after the option pills.
              Heading matches the Size/Flavour one; the box row keeps its -15 pull so the
              box CONTENT (not the border) lines up with the gutter. */}
          {(foodSweet || tasteRows.length > 0) && (
            <div style={{ marginTop: BLOCK_GAP, display: 'flex', flexDirection: 'column', gap: LABEL_GAP }}>
              <div style={sectionLabel}>
                <span style={{ color: 'var(--brand)', display: 'inline-flex' }}><TasteGlyph size={13} /></span>
                <span>Taste</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginInline: -15 }}>
                {foodSweet && <TasteBox taste="sweet" label="Sweetness" n={foodSweet} />}
                {tasteRows.map((r, i) => (
                  <TasteBox key={i} taste={r.taste} label={TASTE_LABEL[r.taste]} n={r.n} single={detail.single} />
                ))}
              </div>
            </div>
          )}

          <p style={{
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '1rem',
            lineHeight: 1.5, color: 'var(--ink-body)',
            textWrap: 'pretty', margin: 0, marginTop: BLOCK_GAP,
          }}>
            {detail.desc}
          </p>

          <div style={{
            fontFamily: 'var(--font-text)', fontSize: options ? '1.0625rem' : '0.875rem',
            fontWeight: options ? 600 : 400,
            letterSpacing: '0.03em', color: 'var(--price, var(--brand))', marginTop: 30,
          }}>
            {selPriceText}
          </div>

          {/* Divider — full-bleed to the screen edges (past the 24px content gutter). */}
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 24, marginInline: -24 }} />

          {/* Item-level serving note (e.g. espresso "Served with a glass of water.") — same quiet quote as pairings */}
          {detail.note && (
            <div style={{ marginTop: 20 }}>
              <SectionNote bodyText={detail.note} bleed={24} />
            </div>
          )}

          {detail.dishes.length > 0 && (
            <div style={{ marginTop: 26 }}>
              {/* Same quiet note as the menu asides — one component, one treatment */}
              {detail.why && <SectionNote bodyText={detail.why} bleed={24} />}

              <span style={{
                display: 'block',
                fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '1.0625rem',
                letterSpacing: '0.01em', color: 'var(--ink-heading)', lineHeight: 1.3,
              }}>
                {pairLabel}
              </span>

              {/* Tight against the heading — the list is what the heading announces. */}
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 4 }}>
                {detail.dishes.map((d, i) => (
                  <div key={d.slug} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    // Rules separate rows from each other, so the first one goes without.
                    borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
                  }}>
                    <span
                      onClick={() => openDish(d.slug)}
                      style={{ flex: 1, minWidth: 0, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-text)', fontWeight: 400, fontSize: '0.875rem',
                        color: 'var(--ink-body-2)',
                      }}>
                        {d.name}
                      </span>
                      <svg width="6" height="11" viewBox="0 0 6 11" fill="none"
                        stroke="var(--ink-heading)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        style={{ display: 'block', flexShrink: 0 }} aria-hidden>
                        <path d="M1 1.5 L5 5.5 L1 9.5" />
                      </svg>
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
                      letterSpacing: '0.05em', color: 'var(--brand)', flexShrink: 0,
                    }}>
                      {d.price}
                    </span>
                    <button
                      onClick={() => add(d.slug, d.name, Number(d.price.replace(/\D/g, '')) || 0)}
                      style={{
                        flexShrink: 0, width: 27, height: 27, borderRadius: '50%',
                        border: '1px solid var(--line-strong)',
                        background: 'transparent', color: 'var(--ink-heading)',
                        fontFamily: 'var(--font-text)', fontSize: '1.0625rem', fontWeight: 300,
                        lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', paddingBottom: 1,
                      }}
                      aria-label={`Add ${d.name}`}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* add to cart — hidden while the waiter list is up, it would float over the sheet */}
      {!showList && (
      <button
        onClick={() => add(addSlug, addName, selPriceRaw)}
        style={{
          position: 'absolute', right: 24, bottom: count > 0 ? 96 : 28,
          width: 56, height: 56, borderRadius: '50%',
          border: 'none', background: 'var(--fab-bg)', color: 'var(--fab-fg)',
          fontFamily: 'var(--font-text)', fontSize: '1.875rem', fontWeight: 300,
          lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', paddingBottom: 3,
          boxShadow: '0 8px 22px rgb(0 0 0 / 0.3)', zIndex: 30,
        }}
        aria-label={`Add ${detail.name} to cart`}
      >
        +
      </button>
      )}

      {toast && <AddedToast id={toast.id} text={t('cart.added', { name: toast.name })} />}

      {count > 0 && !showList && (
        <CartBar
          count={count} totalStr={String(total)} detailOpen={false}
          label={t('cart.show_waiter')}
          onClick={() => {
            track('cart_show_waiter', { venue_slug: venueSlug, item_count: count })
            setShowList(true)
          }}
        />
      )}

      {showList && (
        <ListSheet
          lines={cartLines} totalStr={String(total)}
          heading={t('cart.open_list')} totalLabel={t('cart.total_label')}
          clearLabel={t('cart.clear')}
          confirmLabel={t('cart.confirm')}
          onClear={() => { clear(); setShowList(false) }}
          onConfirm={() => { track('order_confirmed', { venue_slug: venueSlug, item_count: count, value: total }); place() }}
          placed={placed}
          placedHeading={t('cart.thanks_title')}
          changeLabel={t('cart.change_order')}
          onChange={unplace}
          thanksBody={reviewUrl ? t.rich('cart.thanks_body', { link: reviewLink }) : undefined}
          newOrderLabel={t('cart.new_order')}
          onNewOrder={() => { clear(); setShowList(false); router.push(menuHref) }}
          onClose={() => setShowList(false)}
        />
      )}

    </div>
  )
}
