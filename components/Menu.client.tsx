'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import HeaderControls from '@/components/HeaderControls'
import ItemCard from '@/components/ItemCard'
import FoodCard from '@/components/FoodCard'
import SectionNote from '@/components/SectionNote'
import CartBar from '@/components/CartBar'
import AddedToast from '@/components/AddedToast'
import ListSheet from '@/components/ListSheet'
import OspitalittaMark from '@/components/OspitalittaMark'
import LegendSheet from '@/components/LegendSheet'
import type { VenueMenuData, TasteKey, FoodKey } from '@/lib/menu-data'
import { TASTE_KEYS } from '@/lib/menu-data'
import { pickLocale, money } from '@/lib/locale'
import { parsePrice } from '@/lib/cart'
import { useCart } from '@/lib/useCart'
import { lsGet, lsSet } from '@/lib/storage'
import { setLocaleAction } from '@/app/actions/locale'
import { track } from '@/lib/analytics'
import { useImpressions } from '@/lib/useImpressions'
import MenuBackdrop from '@/components/MenuBackdrop'
import TasteIcon, { TasteSprite } from '@/components/TasteIcon'

const SCALE_STEPS = [0.9, 1, 1.15, 1.3] as const

interface Props {
  menuData: VenueMenuData
  venueSlug: string
  locale: string
  leadTaste: TasteKey
  locales: string[]
  logoSrc?: string
  logoText?: string
  onboarding: { pricesNote: string; welcome?: string }
  defaultCategory?: 'cocktails' | 'drinks' | 'food'
  drinksCategoryLabel?: 'cocktails' | 'drinks'
  forceCompact?: boolean
  houseIndicator?: string
  showCocktailGuide?: boolean
  backgroundTheme?: 'seafood' | 'cocktail' | 'patisserie' | 'none'
  reviewUrl?: string
  headerDecor?: string
  headerDecorLeft?: string
}

function ViewToggle({ mode, onChange }: { mode: 'expanded' | 'compact'; onChange: (m: 'expanded' | 'compact') => void }) {
  const isCompact = mode === 'compact'
  return (
    <button
      onClick={() => onChange(isCompact ? 'expanded' : 'compact')}
      style={{
        flexShrink: 0, padding: '0 13px', height: '100%', minHeight: 44,
        background: 'transparent', border: 'none', borderLeft: '1px solid var(--line)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink-faint)',
      }}
      aria-label={isCompact ? 'Switch to card view' : 'Switch to list view'}
    >
      {isCompact ? (
        /* grid.svg — switch back to cards */
        <svg viewBox="0 0 48 48" width="17" height="17" fill="currentColor" style={{ display: 'block' }} aria-hidden>
          <path d="m19.48 26.64h-17.1c-1.04 0-1.88.84-1.88 1.88v17.1c0 1.04.84 1.88 1.88 1.88h17.1c1.04 0 1.88-.84 1.88-1.88v-17.1c0-1.04-.84-1.88-1.88-1.88z"/>
          <path d="m19.48.5h-17.1c-1.04 0-1.88.84-1.88 1.88v17.1c0 1.04.84 1.88 1.88 1.88h17.1c1.04 0 1.88-.84 1.88-1.88v-17.1c0-1.04-.84-1.88-1.88-1.88z"/>
          <path d="m45.62.5h-17.1c-1.04 0-1.88.84-1.88 1.88v17.1c0 1.04.84 1.88 1.88 1.88h17.1c1.04 0 1.88-.84 1.88-1.88v-17.1c0-1.04-.84-1.88-1.88-1.88z"/>
          <path d="m45.62 26.64h-17.1c-1.04 0-1.88.84-1.88 1.88v17.1c0 1.04.84 1.88 1.88 1.88h17.1c1.04 0 1.88-.84 1.88-1.88v-17.1c0-1.04-.84-1.88-1.88-1.88z"/>
        </svg>
      ) : (
        /* view-list.svg — switch to compact */
        <svg viewBox="0 0 28 28" width="17" height="17" fill="currentColor" style={{ display: 'block' }} aria-hidden>
          <path d="m25 25h-14c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1zm-18 0h-4c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1zm18-8h-14c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1zm-18 0h-4c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1zm18-8h-14c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1zm-18 0h-4c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1z"/>
        </svg>
      )}
    </button>
  )
}

export default function MenuClient({ menuData, venueSlug, locale, leadTaste, locales, logoSrc, logoText, onboarding, defaultCategory, drinksCategoryLabel, forceCompact, houseIndicator, showCocktailGuide, backgroundTheme, reviewUrl, headerDecor, headerDecorLeft }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const { cart, count, total, toast, add: pushToCart, changeQty: setQty, clear: clearTheCart, placed, place, unplace } = useCart(venueSlug)

  const hasCocktails = menuData.sections.length > 0
  const hasFoodSections = menuData.foodSections.length > 0
  const isTasteBased = hasCocktails && TASTE_KEYS.has(menuData.sections[0].key)
  const rawDefault = defaultCategory ?? (hasCocktails ? 'cocktails' : 'food')
  const initialCategory: 'cocktails' | 'food' = rawDefault === 'drinks' ? 'cocktails' : rawDefault
  // Returning from a product page lands on that item's own tab — the page writes both
  // keys before navigating back, so a guest who arrived by a shared link still ends up
  // in the right part of the menu.
  const [category, setCategory] = useState<'cocktails' | 'food'>(() => {
    if (typeof window === 'undefined') return initialCategory
    const saved = lsGet(`osp_cat_${venueSlug}`)
    if (saved === 'food' && hasFoodSections) return 'food'
    if (saved === 'cocktails' && hasCocktails) return 'cocktails'
    return initialCategory
  })
  const [viewMode, setViewMode] = useState<'expanded' | 'compact'>(() => {
    if (forceCompact) return 'compact'
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`osp_view_${venueSlug}`)
      return saved === 'compact' ? 'compact' : 'expanded'
    }
    return 'expanded'
  })
  // Landing tab: last taste the guest picked here (localStorage) → locale-derived lead taste
  // → first section. Tab ORDER never changes — only which one starts active.
  const [tab, setTab] = useState<string>(() => {
    const fallback = isTasteBased ? leadTaste : (menuData.sections[0]?.key ?? '')
    if (typeof window === 'undefined') return fallback
    const saved = lsGet(`osp_taste_${venueSlug}`)
    return saved && menuData.sections.some(s => s.key === saved) ? saved : fallback
  })
  const [foodTab, setFoodTab] = useState<FoodKey>(() => {
    const fallback = (menuData.foodSections[0]?.key as FoodKey) ?? 'pizza'
    if (typeof window === 'undefined') return fallback
    const saved = lsGet(`osp_foodtab_${venueSlug}`)
    return saved && menuData.foodSections.some(s => s.key === saved) ? (saved as FoodKey) : fallback
  })
  const [showList, setShowList] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [fontScale, setFontScale] = useState(1)
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)

  // Remember the guest's taste choice — next visit lands there instead of the locale default.
  const changeTab = (key: string) => {
    lsSet(`osp_taste_${venueSlug}`, key)
    setTab(key)
  }

  const changeCategory = (cat: 'cocktails' | 'food') => {
    lsSet(`osp_cat_${venueSlug}`, cat)
    setCategory(cat)
  }

  const changeFoodTab = (key: FoodKey) => {
    lsSet(`osp_foodtab_${venueSlug}`, key)
    setFoodTab(key)
  }

  const changeViewMode = (mode: 'expanded' | 'compact') => {
    sessionStorage.setItem(`osp_view_${venueSlug}`, mode)
    setViewMode(mode)
  }

  const skipOpenRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = parseFloat(lsGet('font_scale') ?? '1')
    const fs = (SCALE_STEPS as readonly number[]).includes(raw) ? raw : 1
    setFontScale(fs)
    document.documentElement.style.setProperty('--font-scale', String(fs))

    // Landing tab never fires taste_tab_switch (nothing was switched) — record it here,
    // otherwise the most-seen tab of all is the one missing from the report.
    track('menu_view', { venue_slug: venueSlug, locale, category: initialCategory, tab })
    // Mount-only: category/tab are read as LANDING values on purpose. Later switches are
    // their own events — re-running this would double-count views.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueSlug, locale])

  // A new tab is a new list — start it at the top instead of keeping the old offset.
  // Skipped while a scroll target is pending: the featured pick switches tab on purpose
  // to reach an item further down, and resetting here would undo that jump.
  useEffect(() => {
    if (pendingScroll) return
    scrollRef.current?.scrollTo({ top: 0 })
    // Deliberately not keyed on pendingScroll — this fires on tab switches only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, foodTab, category])

  // Scroll to pending item — reruns on tab/category/foodTab change so element is in DOM
  useEffect(() => {
    if (!pendingScroll) return
    const el = document.getElementById(`item-${pendingScroll}`)
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setPendingScroll(null) }
  }, [pendingScroll, tab, category, foodTab])

  // ----- Indexes -----
  const cocktailTabs = useMemo((): string[] => {
    if (!hasCocktails) return []
    return menuData.sections.map(s => s.key)
  }, [menuData.sections, hasCocktails])

  const sectionByKey = useMemo(() => {
    const m: Record<string, (typeof menuData.sections)[0]> = {}
    for (const sec of menuData.sections) m[sec.key] = sec
    return m
  }, [menuData.sections])

  // slug → which list the item lives in. Impressions resolve their own section instead of
  // trusting the active tab, so a mid-scroll tab switch can't mislabel an in-flight card.
  const sectionOfSlug = useMemo(() => {
    const m: Record<string, { kind: 'cocktail' | 'food'; section: string }> = {}
    for (const sec of menuData.sections)
      for (const item of sec.items) m[item.slug] = { kind: 'cocktail', section: sec.key }
    for (const sec of menuData.foodSections)
      for (const item of sec.items) m[item.slug] = { kind: 'food', section: sec.key }
    return m
  }, [menuData])

  // "Which items did nobody ever look at" — the dead-zone report. Half the card in view,
  // held 1s, once per item per session. Rendered cards already carry id="item-{slug}".
  useImpressions(
    scrollRef,
    (slug, position) => {
      const meta = sectionOfSlug[slug]
      if (!meta) return
      track('item_impression', {
        venue_slug: venueSlug,
        item_slug: slug,
        kind: meta.kind,
        section: meta.section,
        position,
        view_mode: viewMode,
      })
    },
    !legendOpen && !showList,
    [category, tab, foodTab, viewMode, sectionOfSlug, venueSlug],
  )

  const foodPickEntry = useMemo(() => {
    const fp = menuData.foodFeaturedPick
    if (!fp) return null
    for (const sec of menuData.foodSections) {
      const item = sec.items.find(i => i.slug === fp.itemRef)
      if (item) return { item, sectionKey: sec.key as FoodKey }
    }
    return null
  }, [menuData])

  // ----- Helpers -----
  const pl = <T,>(i18n: Record<string, T>) => pickLocale(i18n, locale)

  // The review link lives inside the sentence, so it renders as rich text rather than a
  // separate call to action underneath it.
  const reviewLink = (chunks: React.ReactNode) => (
    <a href={reviewUrl} target="_blank" rel="noopener noreferrer"
      style={{ color: 'var(--brand)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
      {chunks}
    </a>
  )

  const handleScaleChange = (v: number) => {
    setFontScale(v)
    document.documentElement.style.setProperty('--font-scale', String(v))
    lsSet('font_scale', String(v))
  }

  const handleLocaleChange = async (lc: string) => {
    track('language_change', { venue_slug: venueSlug, locale: lc })
    await setLocaleAction(lc)   // server action sets cookie via Set-Cookie header (works in iframes)
    router.refresh()
  }

  // ----- Detail open -----
  // The product now lives on its own route. skipOpenRef still guards the card tap so a
  // "+" press on the card does not also navigate.
  const openDetail = (slug: string, kind: 'cocktail' | 'food') => {
    if (skipOpenRef.current) return
    track('item_detail_open', { venue_slug: venueSlug, item_slug: slug, kind })
    router.push(`/venue/${venueSlug}/menu/${slug}`)
  }
  const openCocktailDetail = (slug: string) => openDetail(slug, 'cocktail')
  const openFoodDetail = (slug: string) => openDetail(slug, 'food')

  // ----- Cart -----
  const cartLines = cart.map(ci => ({
    slug: ci.slug, name: ci.name, qty: ci.qty,
    lineTotal: money(`L${ci.price * ci.qty}`),
    onMinus: () => setQty(ci.slug, -1),
    onPlus: () => setQty(ci.slug, 1),
    // Tapping a line opens that item's detail. The list sheet closes first — it sits
    // above the detail sheet, so leaving it up would bury what the tap just opened.
    onOpen: () => {
      const meta = sectionOfSlug[ci.slug]
      if (!meta) return
      setShowList(false)
      if (meta.kind === 'food') openFoodDetail(ci.slug)
      else openCocktailDetail(ci.slug)
    },
  }))

  // ----- Tab labels -----
  const foodLabel: Record<string, string> = {
    pizza: t('food.pizza'), sharing: t('food.sharing'),
  }
  const foodTabLabel = (sec: typeof menuData.foodSections[0]) =>
    pl(sec.i18n).label || foodLabel[sec.key] || sec.key

  const currentSection = menuData.sections.find(s => s.key === tab)
  const currentFoodSection = menuData.foodSections.find(s => s.key === foodTab)

  // shared tab button style
  const tabBtn = (active: boolean) => ({
    position: 'relative' as const, flexShrink: 0,
    background: 'transparent', border: 'none',
    padding: '12px 16px 13px', cursor: 'pointer',
    fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
    letterSpacing: '0.1em', textTransform: 'uppercase' as const,
    color: active ? 'var(--ink)' : 'var(--ink-faint)',
    transition: 'color .15s', whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, position: 'relative', background: 'var(--surface)' }}>
      <TasteSprite />

      <MenuBackdrop theme={backgroundTheme ?? 'none'} />

      <HeaderControls
        logoSrc={logoSrc} logoText={logoText}
        locale={locale} locales={locales} fontScale={fontScale}
        onOpenLegend={() => setLegendOpen(true)}
        onLocaleChange={handleLocaleChange}
        onScaleChange={handleScaleChange}
        headerDecor={headerDecor}
        headerDecorLeft={headerDecorLeft}
      />

      {/* Category nav — hidden for food-only venues */}
      {hasCocktails && menuData.foodSections.length > 0 && (
        <div style={{ flexShrink: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', padding: '0 18px' }}>
            {(defaultCategory === 'food'
              ? ['food', 'cocktails'] as const
              : ['cocktails', 'food'] as const
            ).map(cat => {
              const active = category === cat
              return (
                <button key={cat} onClick={() => changeCategory(cat)} style={tabBtn(active)}>
                  {cat === 'cocktails'
                    ? t(`category.${drinksCategoryLabel ?? 'cocktails'}`)
                    : t('category.food')}
                  {active && <span style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 2, background: 'var(--tab-underline)' }} />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tabs outside scrollable — backdrop paints over them like CategoryNav */}
      {category === 'cocktails' && (
        <div style={{ flexShrink: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <div className="scrollbar-none" style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ display: 'flex', padding: '0 16px', width: 'max-content' }}>
              {cocktailTabs.map(tk => {
                const active = tab === tk
                const sec = sectionByKey[tk]
                const label = sec ? pl(sec.i18n).label : tk
                return (
                  <button key={tk} onClick={() => { track('taste_tab_switch', { venue_slug: venueSlug, taste: tk }); changeTab(tk) }} style={{ ...tabBtn(active), display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {label}
                    <TasteIcon taste={tk} active={active} />
                    {active && <span style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 2, background: 'var(--tab-underline)' }} />}
                  </button>
                )
              })}
            </div>
          </div>
          {!forceCompact && <ViewToggle mode={viewMode} onChange={changeViewMode} />}
        </div>
      )}
      {category === 'food' && (
        <div style={{ flexShrink: 0, background: 'var(--surface)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <div className="scrollbar-none" style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ display: 'flex', padding: '0 16px', width: 'max-content' }}>
              {menuData.foodSections.map(sec => {
                const active = foodTab === sec.key
                return (
                  <button key={sec.key} onClick={() => changeFoodTab(sec.key as FoodKey)} style={tabBtn(active)}>
                    {foodTabLabel(sec)}
                    {active && <span style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 2, background: 'var(--tab-underline)' }} />}
                  </button>
                )
              })}
            </div>
          </div>
          {!forceCompact && <ViewToggle mode={viewMode} onChange={changeViewMode} />}
        </div>
      )}

      {/* Scrollable content — also the IntersectionObserver root for item impressions */}
      <div ref={scrollRef} className="scrollbar-none" style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

        {/* ===== COCKTAILS ===== */}
        {category === 'cocktails' && (
          <>

            <div style={{ padding: '0 18px 28px' }}>
              {/* Section heading dropped — the active tab already names the taste.
                  The operational note stays: it carries pricing, not a label. */}
              {currentSection && (() => {
                const secText = pl(currentSection.i18n) as { label: string; sub?: string; note?: string }
                if (!secText.note) return null
                return (
                  <div style={{
                    background: 'var(--note-bg, var(--surface-frame))',
                    borderLeft: '3px solid var(--note-border-color, var(--brand))',
                    padding: '10px 14px', marginTop: 24,
                    fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.75rem', lineHeight: 1.5,
                    color: 'var(--note-text-color, var(--ink-body))',
                  }}>
                    {secText.note}
                  </div>
                )
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'compact' ? 0 : 14, marginTop: viewMode === 'compact' ? 8 : 16 }}>
                {currentSection?.items.map((item, i) => {
                  const text = pl(item.i18n)
                  return (
                    <ItemCard
                      key={item.slug} id={item.slug}
                      name={text.name} desc={text.desc} price={money(item.price)}
                      glass={item.glass} taste={currentSection.key}
                      compact={viewMode === 'compact'}
                      priority={i === 0}
                      lvl={item.lvl} flavor={item.flavor}
                      loved={item.loved} house={item.house}
                      houseIndicator={houseIndicator}
                      videoSrc={item.videoSrc} posterSrc={item.posterSrc}
                      lovedLabel="loved here"
                      onTap={() => openCocktailDetail(item.slug)}
                      onAdd={(e) => {
                        e.stopPropagation()
                        skipOpenRef.current = true
                        setTimeout(() => { skipOpenRef.current = false }, 0)
                        pushToCart(item.slug, text.name, parsePrice(item.price))
                      }}
                    />
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <OspitalittaMark />
              </div>
            </div>
          </>
        )}

        {/* ===== FOOD ===== */}
        {category === 'food' && (
          <>

            <div style={{ padding: '0 18px 28px' }}>
              {foodTab === 'pizza' && (
                <SectionNote bodyText={t('pizza_note.text')} />
              )}

              {/* Food recommendation — same quiet quote as the pizza tip, not a plaque */}
              {menuData.foodFeaturedPick?.showAfterSection === foodTab && foodPickEntry && (() => {
                const fpText = pl(menuData.foodFeaturedPick!.i18n) as { label: string; desc?: string }
                return (
                  <SectionNote
                    bodyText={fpText.label}
                    onClick={() => {
                      track('featured_pick_tap', { venue_slug: venueSlug, item_slug: foodPickEntry.item.slug, kind: 'food' })
                      changeFoodTab(foodPickEntry.sectionKey)
                      setPendingScroll(foodPickEntry.item.slug)
                    }}
                  />
                )
              })()}

              {currentFoodSection && (() => {
                const secText = pl(currentFoodSection.i18n) as { label: string; sub?: string; badge?: string; note?: string }
                // The section title repeated what the active tab already says, so it's gone.
                // The block still renders for the extras a section may carry (badge, sub, note);
                // with none of them there is nothing left to show.
                if (!secText.badge && !secText.sub && !secText.note) return null
                return (
                  <div style={{ marginTop: 24, borderBottom: '1px solid var(--line-strong)', paddingBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {secText.badge && (
                          <span style={{
                            fontFamily: 'var(--font-text)', fontSize: 'var(--badge-size, 9px)',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: 'var(--badge-color, var(--brand-bright))',
                            background: 'var(--badge-bg, var(--surface-frame))',
                            border: 'var(--badge-border, 1px solid var(--brand))',
                            borderRadius: 'var(--badge-radius, 0px)',
                            padding: 'var(--badge-padding, 2px 6px)',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}>
                            {secText.badge}
                          </span>
                        )}
                      </div>
                      {secText.sub && (
                        <span style={{
                          fontFamily: 'var(--font-text)', fontWeight: 300,
                          fontSize: 'var(--section-sub-size, 0.6875rem)', letterSpacing: '0.04em',
                          color: 'var(--section-sub-color, var(--ink-faint))', textAlign: 'right', maxWidth: 150,
                        }}>
                          {secText.sub}
                        </span>
                      )}
                    </div>
                    {secText.note && (
                      <div style={{
                        background: 'var(--note-bg, var(--surface-frame))',
                        borderLeft: '3px solid var(--note-border-color, var(--brand))',
                        padding: '10px 14px', marginTop: 12,
                        fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.75rem', lineHeight: 1.5,
                        color: 'var(--note-text-color, var(--ink-body))',
                      }}>
                        {secText.note}
                      </div>
                    )}
                  </div>
                )
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'compact' ? 0 : 12, marginTop: viewMode === 'compact' ? 8 : 16 }}>
                {currentFoodSection?.items.map((item, i) => {
                  const text = pl(item.i18n)
                  return (
                    <FoodCard
                      key={item.slug} id={item.slug}
                      name={text.name} desc={text.desc} price={item.price}
                      badge={item.badge}
                      compact={viewMode === 'compact'}
                      priority={i === 0}
                      videoSrc={item.videoSrc}
                      posterSrc={item.posterSrc}
                      onTap={() => openFoodDetail(item.slug)}
                      onAdd={(e) => {
                        e.stopPropagation()
                        skipOpenRef.current = true
                        setTimeout(() => { skipOpenRef.current = false }, 0)
                        pushToCart(item.slug, text.name, parsePrice(item.price))
                      }}
                    />
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <OspitalittaMark />
              </div>
            </div>
          </>
        )}
      </div>

      {toast && <AddedToast id={toast.id} text={t('cart.added', { name: toast.name })} />}

      {/* Cart bar */}
      {count > 0 && !showList && (
        <CartBar
          count={count} totalStr={String(total)} detailOpen={false}
          label={t('cart.show_waiter')}
          onClick={() => {
            track('cart_show_waiter', { venue_slug: venueSlug, item_count: count })
            // "Order" = cart at the moment it's shown to the waiter → GA4 purchase for item×country reports.
            track('purchase', {
              transaction_id: `${venueSlug}-${Date.now()}`,
              venue_slug: venueSlug,
              currency: 'ALL',
              value: total,
              items: cart.map(ci => ({ item_id: ci.slug, item_name: ci.name, price: ci.price, quantity: ci.qty })),
            })
            setShowList(true)
          }}
        />
      )}

      {/* List sheet */}
      {showList && (
        <ListSheet
          lines={cartLines} totalStr={String(total)}
          heading={t('cart.open_list')} totalLabel={t('cart.total_label')}
          clearLabel={t('cart.clear')}
          confirmLabel={t('cart.confirm')}
          onConfirm={() => { track('order_confirmed', { venue_slug: venueSlug, item_count: count, value: total }); place() }}
          placed={placed}
          placedHeading={t('cart.thanks_title')}
          changeLabel={t('cart.change_order')}
          onChange={unplace}
          thanksBody={reviewUrl ? t.rich('cart.thanks_body', { link: reviewLink }) : undefined}
          newOrderLabel={t('cart.new_order')}
          onNewOrder={() => { clearTheCart(); setShowList(false) }}
          onClear={() => { clearTheCart(); setShowList(false) }}
          onClose={() => setShowList(false)}
        />
      )}

      {/* Legend sheet */}
      {legendOpen && (
        <LegendSheet
          title={t('legend.title')} sub={t('legend.sub')}
          hasCocktails={hasCocktails} showRows={showCocktailGuide ?? true}
          bitterName={t('legend.bitter_name')} bitterDesc={t('legend.bitter_desc')}
          sourName={t('legend.sour_name')} sourDesc={t('legend.sour_desc')}
          sweetName={t('legend.sweet_name')} sweetDesc={t('legend.sweet_desc')}
          marksName={t('legend.marks_name')} marksDesc={t('legend.marks_desc')}
          oliveName={t('legend.olive_name')} oliveDesc={t('legend.olive_desc')}
          lovedName={t('legend.loved_name')} lovedDesc={t('legend.loved_desc')}
          pricesNote={onboarding.pricesNote} welcome={onboarding.welcome} cta={t('legend.cta')}
          onClose={() => setLegendOpen(false)}
        />
      )}
    </div>
  )
}
