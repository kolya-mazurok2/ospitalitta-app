'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import TasteMark from '@/components/TasteMark'
import CardVideo from '@/components/CardVideo'
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
}

/**
 * Full product page. Replaces the old 60% bottom sheet.
 *
 * Back always lands the guest on the menu tab this item belongs to — including when
 * they arrived by a shared link and have no history to go back through. The tab is
 * written to localStorage before navigating, which is the same channel the menu already
 * reads its landing tab from.
 */
export default function ItemPage({ detail, venueSlug }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const { cart, count, total, toast, add, changeQty, clear } = useCart(venueSlug)
  const [showList, setShowList] = useState(false)

  const menuHref = `/venue/${venueSlug}/menu`

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
  const whyText = detail.isFood
    ? detail.foodWhy
    : (detail.whyLead ? `${detail.whyLead} ${detail.whyDrink}${detail.whyPost ?? ''}` : undefined)

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
          {detail.videoSrc ? (
            <CardVideo
              src={detail.videoSrc} poster={detail.posterSrc}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : detail.posterSrc ? (
            // Same file the card already showed, so this is a cache hit, not a second download.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={detail.posterSrc} alt={detail.name}
              fetchPriority="high" decoding="async"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : null}

          <button
            onClick={goBack}
            aria-label="Back to menu"
            style={{
              position: 'absolute', top: 14, left: 14,
              width: 38, height: 38, borderRadius: '50%',
              border: 'none', background: 'var(--surface-dark-2)', color: 'var(--on-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
              boxShadow: '0 4px 14px rgb(0 0 0 / 0.3)',
            }}
          >
            <svg width="9" height="16" viewBox="0 0 6 11" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              style={{ display: 'block', transform: 'rotate(180deg)' }} aria-hidden>
              <path d="M1 1.5 L5 5.5 L1 9.5" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '18px 24px 120px' }}>
          {detail.loved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 9 }}>
              <span style={{
                fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.53125rem',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--brand)', lineHeight: 1,
              }}>
                loved here
              </span>
              <svg viewBox="154 164 314 303" style={{ width: 12, height: 12, display: 'block', fill: 'var(--brand)' }} aria-hidden>
                <path d="m467.804 292.907c-7.47-48.489-60.582-101.763-132.159-62.814-29.177-90.905-119.689-69.448-145.953-43.65-85.322 76.173 8.362 203.179 40.333 268.032 14.045-39.091-117.417-181.241-27.244-255.414 68.632-56.454 126.977 25.183 124.741 56.454 44.947-40.995 121.184-16.165 122.736 37.392 3.752 129.472-200.887 143.96-206.188 175.093 115.457-25.643 238.406-79.846 223.734-175.093z" />
                <path d="m287.945 231.035c-46.589-62.449-117.225 12.49-74.644 84.931-12.023-79.435 25.55-110.91 74.644-84.931z" />
              </svg>
            </div>
          )}

          {/* name + olive */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.4375rem',
              letterSpacing: '0.01em', color: 'var(--ink)', lineHeight: 1.15, margin: 0,
            }}>
              {detail.name}
            </h1>
            {detail.house && (
              <svg width="12" height="14" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
                <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
                <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
                <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
              </svg>
            )}
          </div>

          {tasteRows.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 20px', marginTop: 14, color: 'var(--brand)' }}>
              {tasteRows.map((r, i) => (
                <TasteMark key={i} taste={r.taste} n={r.n} single={detail.single} size={22} style={{ gap: 5 }} />
              ))}
            </div>
          )}

          <p style={{
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '1rem',
            lineHeight: 1.5, color: 'var(--ink-body)',
            textWrap: 'pretty', margin: '14px 0 0',
          }}>
            {detail.desc}
          </p>

          <div style={{
            fontFamily: 'var(--font-text)', fontSize: '0.875rem',
            letterSpacing: '0.03em', color: 'var(--brand)', marginTop: 12,
          }}>
            {detail.price}
          </div>

          {detail.dishes.length > 0 && (
            <div style={{ marginTop: 26 }}>
              {/* Same quiet note as the menu asides — one component, one treatment */}
              {whyText && <SectionNote bodyText={whyText} bleed={24} />}

              <span style={{
                display: 'block',
                fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.875rem',
                letterSpacing: '0.01em', color: 'var(--ink-heading)', lineHeight: 1.3,
              }}>
                {pairLabel}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {detail.dishes.map(d => (
                  <div key={d.slug} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderTop: '1px solid var(--line-soft)',
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

      {/* add to cart */}
      <button
        onClick={() => add(detail.slug, detail.name, detail.rawPrice)}
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
          clearLabel={t('cart.clear')} keepBrowsing={t('cart.keep_browsing')}
          onClear={() => { clear(); setShowList(false) }}
          onClose={() => setShowList(false)}
        />
      )}
    </div>
  )
}
