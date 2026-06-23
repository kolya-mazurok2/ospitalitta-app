'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import HeaderControls from '@/components/HeaderControls'
import ItemCard from '@/components/ItemCard'
import FoodCard from '@/components/FoodCard'
import FeaturedPick from '@/components/FeaturedPick'
import PizzaNote from '@/components/PizzaNote'
import DetailSheet from '@/components/DetailSheet'
import CartBar from '@/components/CartBar'
import ListSheet from '@/components/ListSheet'
import LegendSheet from '@/components/LegendSheet'
import type { VenueMenuData, TasteKey, FoodKey, MenuItem } from '@/lib/menu-data'
import { TASTE_KEYS } from '@/lib/menu-data'
import { tabOrder, pickLocale, money } from '@/lib/locale'
import { type CartItem, loadCart, saveCart, addItem, changeQty, cartCount, cartTotal, parsePrice, clearCart } from '@/lib/cart'
import { lsGet, lsSet } from '@/lib/storage'
import { setLocaleAction } from '@/app/actions/locale'
import MenuBackdrop from '@/components/MenuBackdrop'

const SCALE_STEPS = [0.9, 1, 1.15, 1.3] as const

interface DishRowData {
  slug: string
  name: string
  price: string
  isFood: boolean
}

interface OpenItem {
  slug: string
  name: string
  desc: string
  price: string
  rawPrice: number   // for cart ops
  taste?: 'bitter' | 'sour' | 'sweet'
  n?: 1 | 2 | 3
  single?: boolean
  loved?: boolean
  house?: boolean
  isFood: boolean
  pairLabel?: string
  dishes?: DishRowData[]
  hasWhy: boolean
  whyIsCocktail: boolean
  whyLead?: string
  whyDrink?: string
  whyPost?: string
  foodWhy?: string
}

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
  backgroundTheme?: 'seafood' | 'cocktail' | 'none'
  headerDecor?: string
  headerDecorLeft?: string
}

function SectionIcon({ taste }: { taste: string }) {
  const s = { display: 'block' as const, color: 'var(--brand)', flexShrink: 0 as const }
  if (taste === 'bitter') return (
    <svg viewBox="0 0 160 160" style={{ ...s, width: 19, height: 19 }} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m88.422 60.233c-6.287-12.673-12.453-25.406-18.622-38.14-6.58-4.906-15.486-4.126-20.64 1.014a16.176 16.176 0 0 0 -1.8 20.02c12.707 6.726 25.52 13.52 38.34 20.313" />
        <path d="m92.8 61.007c1.013-9.987 2.147-19.967 3.273-29.94-3.493-4.287-7.06-8.187-11.72-10.314s-10.94-2.28-14.56 1.34" />
        <path d="m152.455 88.567c-.453-8.287-3.393-16.26-7.146-23.66a110.781 110.781 0 0 0 -56.709-52.074c-7.346-2.966-15.12-5.153-23.04-5.2a37.591 37.591 0 0 0 -19.706 5.554c-.007.006-.014.006-.02.013-.334.213-.654.427-.967.647-7.678 5.386-11.767 14.9-12.167 24.266s2.489 18.607 6.522 27.067a102.76 102.76 0 0 0 70.107 55.553c12.66 2.134 27.153.467 35.766-9.06a26.614 26.614 0 0 0 3.98-5.84 1.028 1.028 0 0 0 .06-.126 34.469 34.469 0 0 0 3.32-17.14z" />
        <path d="m45.851 13.187c-20.479 11.174-35.242 34.569-37.909 57.745a74.421 74.421 0 0 0 23.964 62.94 74.423 74.423 0 0 0 65.251 16.68c22.724-5.275 44.274-26.707 51.978-44.848" />
        <path d="m95.982 63.633c7.48-3.646 20.14-9.386 25.207-11.893a27.68 27.68 0 0 0 -9.127-15.093 25.9 25.9 0 0 0 -15.987-5.58" />
        <path d="m97.115 67.147q21.12 8.34 42.24 16.673a27.948 27.948 0 0 0 -3.34-19.66 28.562 28.562 0 0 0 -14.826-12.42" />
        <path d="m95.575 70.487q12.051 17.61 24.107 35.226a24.847 24.847 0 0 0 11.02 1.207 14.772 14.772 0 0 0 9.127-4.887 13.481 13.481 0 0 0 3.013-9.146 15.579 15.579 0 0 0 -3.487-9.067" />
      </g>
    </svg>
  )
  if (taste === 'sour') return (
    <svg viewBox="0 0 64 64" style={{ ...s, width: 19, height: 19 }} aria-hidden>
      <g fill="currentColor">
        <path d="m43.84 30.82a1.51 1.51 0 0 0 -1.61 1.39 20.91 20.91 0 0 1 -6.37 12.79 21.27 21.27 0 0 1 -2.13 1.88 1.51 1.51 0 0 0 -.27 2.1 1.49 1.49 0 0 0 1.19.59 1.52 1.52 0 0 0 .92-.31 27.43 27.43 0 0 0 2.43-2.1 24 24 0 0 0 7.25-14.73 1.5 1.5 0 0 0 -1.41-1.61z" />
        <path d="m61.06 13.92a9.32 9.32 0 0 0 -11.2-1.49c-1-2.69-3.33-7.18-7.55-9-6.08-2.61-13.44 1.49-13.75 1.67a1.49 1.49 0 0 0 -.72 1.66 22.6 22.6 0 0 0 2.1 5.1 31.13 31.13 0 0 0 -18.12 9.14c-8.75 8.76-11.69 20.87-7.4 29.89a6.1 6.1 0 0 0 .32 8.31 6.11 6.11 0 0 0 8.31.32 20.74 20.74 0 0 0 9 1.95c7.16 0 14.85-3.28 20.93-9.36 8.75-8.75 11.69-20.86 7.4-29.88a6.09 6.09 0 0 0 .66-7 6.34 6.34 0 0 1 7.95.8 1.5 1.5 0 0 0 2.12 0 1.49 1.49 0 0 0 -.05-2.11zm-19.93-7.73c3.54 1.53 5.44 5.88 6.16 8-2 .9-6.45 2.52-10 1s-5.44-5.87-6.17-8c2-.91 6.46-2.52 10.01-1zm-.32 43.81c-8 8-19.54 10.71-27.36 6.37a1.5 1.5 0 0 0 -1.95.44 2.51 2.51 0 0 1 -.26.31 3.13 3.13 0 0 1 -5.3-2.24 3 3 0 0 1 .89-2.17c.14-.14.2-.18.22-.2a1.5 1.5 0 0 0 .53-2c-4.34-7.83-1.66-19.34 6.36-27.36 5.13-5.13 11.65-8.16 18-8.41a11.56 11.56 0 0 0 4.16 3.17 11.33 11.33 0 0 0 4.5.87 20.22 20.22 0 0 0 7.9-1.86 3.1 3.1 0 0 1 -.57 3.52 1.5 1.5 0 0 1 -.27.24 1.5 1.5 0 0 0 -.48 2c4.33 7.78 1.65 19.32-6.37 27.32z" />
      </g>
    </svg>
  )
  if (taste === 'sweet') return (
    <svg viewBox="0 0 64 64" style={{ ...s, width: 19, height: 19 }} aria-hidden>
      <path fill="currentColor" d="m63.50106 20.6098c-.15003-.71998-.52003-1.35-1.03005-1.83005-.50996-.47999-1.17-.8-1.88998-.89998-2.42515-.34376-7.5437-.62312-12.48422 1.73697-.25049-.95308-.88673-1.77127-1.78854-2.24241l-6.04728-3.15582c3.55938-3.31225 8.029-4.42933 10.19988-4.77889.41999-.08002.82997.12 1.03999.50001.56001 1.01998 1.35 2.65001 1.91 4.66005.18006.65004.85005 1.03005 1.52005.85005.65004-.18006 1.03005-.86006.85005-1.52004-.63002-2.23002-1.50003-4.04005-2.12009-5.18008-.70998-1.28005-2.15-1.98007-3.60004-1.75003-2.55876.42023-7.97725 1.77566-12.10347 6.01676l-12.21877-6.37644c-1.02895-.53852-2.25986-.5373-3.29125-.00122l-20.53965 10.73566c-1.17684.61426-1.90769 1.82113-1.90769 3.1494v22.92336c0 1.32705.72963 2.53154 1.90408 3.14941l20.53965 10.7633c.51686.26923 1.08303.40388 1.64804.40388.56617 0 1.13234-.13464 1.6492-.40388l20.56974-10.7633c.8965-.46937 1.53152-1.28353 1.78384-2.23179 3.54126-.53272 7.62897-2.01859 10.97644-5.60458 6.0501-6.48016 5.11008-14.85029 4.43007-18.15034zm-60.45383 23.80619c-.36182-.18995-.5854-.56019-.5854-.96889v-22.92336c0-.40748.2248-.77772.5854-.96645l20.53843-10.73565c.15869-.08295.33301-.12378.50727-.12378.17432 0 .34742.04083.50489.12378l19.74148 10.30278-20.2391 10.58209-17.20037-8.99404c-.59864-.31855-1.34627-.08295-1.66006.52052-.31495.60218-.08295 1.34512.52052 1.66l17.10899 8.94626v22.9623zm42.12394-.00245-19.84005 10.3803v-22.95454l20.42423-10.67883v22.28663c-.00001.4087-.22358.77894-.58418.96644zm12.09981-7.33349c-2.7382 2.93132-6.06901 4.23646-9.0538 4.76235v-6.01438l4.78371-5.11807c.22998-.23999.34003-.55.34003-.86-.01001-.32001-.14001-.64002-.39002-.88002-.50001-.45997-1.28005-.43-1.75003.06l-2.98369 3.1892v-9.89628c3.13195-1.77066 6.48045-2.21305 9.03378-2.21305 1.21004 0 2.24003.09998 2.99004.20001.41999.06.76003.38001.85005.8.59999 2.92003 1.44998 10.33019-3.82007 15.97024z" />
    </svg>
  )
  return null
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

export default function MenuClient({ menuData, venueSlug, locale, leadTaste, locales, logoSrc, logoText, onboarding, defaultCategory, drinksCategoryLabel, forceCompact, houseIndicator, showCocktailGuide, backgroundTheme, headerDecor, headerDecorLeft }: Props) {
  const t = useTranslations()
  const router = useRouter()

  const hasCocktails = menuData.sections.length > 0
  const hasFoodSections = menuData.foodSections.length > 0
  const isTasteBased = hasCocktails && TASTE_KEYS.has(menuData.sections[0].key)
  const rawDefault = defaultCategory ?? (hasCocktails ? 'cocktails' : 'food')
  const initialCategory: 'cocktails' | 'food' = rawDefault === 'drinks' ? 'cocktails' : rawDefault
  const [category, setCategory] = useState<'cocktails' | 'food'>(initialCategory)
  const [viewMode, setViewMode] = useState<'expanded' | 'compact'>(() => {
    if (forceCompact) return 'compact'
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`osp_view_${venueSlug}`)
      return saved === 'compact' ? 'compact' : 'expanded'
    }
    return 'expanded'
  })
  const [tab, setTab] = useState<string>(
    isTasteBased ? leadTaste : (menuData.sections[0]?.key ?? '')
  )
  const [foodTab, setFoodTab] = useState<FoodKey>((menuData.foodSections[0]?.key as FoodKey) ?? 'pizza')
  const [openItem, setOpenItem] = useState<OpenItem | null>(null)
  const [showList, setShowList] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [pickDismissed, setPickDismissed] = useState(false)
  const [foodPickDismissed, setFoodPickDismissed] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [fontScale, setFontScale] = useState(1)
  const [pendingScroll, setPendingScroll] = useState<string | null>(null)

  const changeViewMode = (mode: 'expanded' | 'compact') => {
    sessionStorage.setItem(`osp_view_${venueSlug}`, mode)
    setViewMode(mode)
  }

  const skipOpenRef = useRef(false)

  useEffect(() => {
    const saved = loadCart(venueSlug)
    if (saved.length) setCart(saved)

    const raw = parseFloat(lsGet('font_scale') ?? '1')
    const fs = (SCALE_STEPS as readonly number[]).includes(raw) ? raw : 1
    setFontScale(fs)
    document.documentElement.style.setProperty('--font-scale', String(fs))

    // lsGet returns null both when key absent and when localStorage is blocked (iframe).
    // Treat both as first visit → show onboarding.
    if (!lsGet(`onboarding_seen_${venueSlug}`)) setLegendOpen(true)
  }, [venueSlug])

  useEffect(() => { saveCart(venueSlug, cart) }, [cart, venueSlug])

  // Scroll to pending item — reruns on tab/category/foodTab change so element is in DOM
  useEffect(() => {
    if (!pendingScroll) return
    const el = document.getElementById(`item-${pendingScroll}`)
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setPendingScroll(null) }
  }, [pendingScroll, tab, category, foodTab])

  // ----- Indexes -----
  const cocktailIndex = useMemo(() => {
    const m: Record<string, { item: MenuItem; taste: string }> = {}
    for (const sec of menuData.sections)
      for (const item of sec.items) m[item.slug] = { item, taste: sec.key }
    return m
  }, [menuData])

  const cocktailTabs = useMemo((): string[] => {
    if (!hasCocktails) return []
    if (isTasteBased) {
      const ordered = tabOrder(leadTaste) as string[]
      return ordered.filter(k => menuData.sections.some(s => s.key === k))
    }
    return menuData.sections.map(s => s.key)
  }, [menuData.sections, leadTaste, hasCocktails, isTasteBased])

  const sectionByKey = useMemo(() => {
    const m: Record<string, (typeof menuData.sections)[0]> = {}
    for (const sec of menuData.sections) m[sec.key] = sec
    return m
  }, [menuData.sections])

  const foodIndex = useMemo(() => {
    const m: Record<string, MenuItem> = {}
    for (const sec of menuData.foodSections)
      for (const item of sec.items) m[item.slug] = item
    return m
  }, [menuData])

  const pairingIndex = useMemo(() => {
    const m: Record<string, (typeof menuData.pairings)[0]> = {}
    for (const p of menuData.pairings) m[p.cocktailRef] = p
    return m
  }, [menuData])

  const foodPairingIndex = useMemo(() => {
    const m: Record<string, (typeof menuData.foodPairings)[0]> = {}
    for (const fp of menuData.foodPairings) m[fp.dishRef] = fp
    return m
  }, [menuData])

  const pickEntry = useMemo(() =>
    cocktailIndex[menuData.featuredPick.cocktailRef] ?? null,
    [menuData, cocktailIndex])

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

  const pushToCart = (slug: string, name: string, rawPrice: number) => {
    setCart(prev => addItem(prev, { slug, name, price: rawPrice }))
  }

  const handleScaleChange = (v: number) => {
    setFontScale(v)
    document.documentElement.style.setProperty('--font-scale', String(v))
    lsSet('font_scale', String(v))
  }

  const handleLocaleChange = async (lc: string) => {
    await setLocaleAction(lc)   // server action sets cookie via Set-Cookie header (works in iframes)
    router.refresh()
  }

  // ----- Detail open -----
  const openCocktailDetail = (slug: string) => {
    if (skipOpenRef.current) return
    const entry = cocktailIndex[slug]
    if (!entry) return
    const { item, taste } = entry
    const text = pl(item.i18n)
    const tasteKey = (taste === 'bitter' || taste === 'sour' || taste === 'sweet')
      ? (taste as 'bitter' | 'sour' | 'sweet')
      : undefined
    const pairing = pairingIndex[slug]
    const whyData = tasteKey ? menuData.tasteWhy?.[tasteKey] : undefined

    const dishes: DishRowData[] = pairing?.dishes.map(d => {
      const fi = foodIndex[d.itemRef]
      const fiText = fi ? pl(fi.i18n) : { name: d.itemRef, desc: '' }
      return { slug: d.itemRef, name: fiText.name, price: money(d.price), isFood: true }
    }) ?? []

    setOpenItem({
      slug, name: text.name, desc: text.desc, price: money(item.price),
      rawPrice: parsePrice(item.price),
      taste: tasteKey, n: item.lvl,
      single: taste === 'zero',
      loved: item.loved, house: item.house, isFood: false,
      pairLabel: dishes.length ? t('pairing.drink_label') : undefined,
      dishes: dishes.length ? dishes : undefined,
      hasWhy: !!whyData, whyIsCocktail: true,
      whyLead: whyData?.lead, whyDrink: text.name, whyPost: whyData?.post,
    })
  }

  const openFoodDetail = (slug: string) => {
    if (skipOpenRef.current) return
    const item = foodIndex[slug]
    if (!item) return
    const text = pl(item.i18n)
    const fp = foodPairingIndex[slug]
    const fpWhy = fp ? (fp.i18n[locale]?.why ?? fp.i18n['en']?.why) : undefined

    const dishes: DishRowData[] = fp?.cocktailRefs.map(ref => {
      const ce = cocktailIndex[ref]
      if (!ce) return null
      const ct = pl(ce.item.i18n)
      return { slug: ref, name: ct.name, price: money(ce.item.price), isFood: false }
    }).filter((x): x is DishRowData => !!x) ?? []

    setOpenItem({
      slug, name: text.name, desc: text.desc, price: money(item.price),
      rawPrice: parsePrice(item.price),
      isFood: true,
      pairLabel: dishes.length ? t('pairing.plate_label') : undefined,
      dishes: dishes.length ? dishes : undefined,
      hasWhy: !!fpWhy, whyIsCocktail: false, foodWhy: fpWhy,
    })
  }

  // Dish row handlers (computed at render, not stored in state — avoids stale closure)
  const makeDishHandlers = (row: DishRowData) => ({
    onOpen: () => row.isFood ? openFoodDetail(row.slug) : openCocktailDetail(row.slug),
    onAdd: () => {
      skipOpenRef.current = true
      setTimeout(() => { skipOpenRef.current = false }, 0)
      const entry = row.isFood ? foodIndex[row.slug] : cocktailIndex[row.slug]?.item
      if (entry) pushToCart(row.slug, row.name, parsePrice(entry.price))
    },
  })

  // ----- Cart -----
  const count = cartCount(cart)
  const total = cartTotal(cart)

  const cartLines = cart.map(ci => ({
    slug: ci.slug, name: ci.name, qty: ci.qty,
    lineTotal: money(`L${ci.price * ci.qty}`),
    onMinus: () => setCart(prev => changeQty(prev, ci.slug, -1)),
    onPlus: () => setCart(prev => changeQty(prev, ci.slug, 1)),
  }))

  // ----- Tab labels -----
  const foodLabel: Record<string, string> = {
    pizza: t('food.pizza'), burgers: t('food.burgers'), sharing: t('food.sharing'),
  }
  const foodTabLabel = (sec: typeof menuData.foodSections[0]) =>
    pl(sec.i18n).label || foodLabel[sec.key] || sec.key

  const currentSection = menuData.sections.find(s => s.key === tab)
  const currentFoodSection = menuData.foodSections.find(s => s.key === foodTab)
  const pickShown = !pickDismissed && category === 'cocktails' && !!pickEntry

  const handlePickTap = () => {
    if (!pickEntry) return
    setCategory('cocktails')
    setTab(pickEntry.taste)   // string from cocktailIndex
    setPendingScroll(pickEntry.item.slug)
  }

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
                <button key={cat} onClick={() => { setCategory(cat); setOpenItem(null) }} style={tabBtn(active)}>
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
                  <button key={tk} onClick={() => setTab(tk)} style={tabBtn(active)}>
                    {label}
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
                  <button key={sec.key} onClick={() => setFoodTab(sec.key as FoodKey)} style={tabBtn(active)}>
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

      {/* Scrollable content */}
      <div className="scrollbar-none" style={{ flex: 1, minHeight: 0, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

        {/* ===== COCKTAILS ===== */}
        {category === 'cocktails' && (
          <>

            <div style={{ padding: '0 18px 50px' }}>
              {pickShown && pickEntry && (() => {
                const text = pl(pickEntry.item.i18n)
                return (
                  <FeaturedPick
                    name={text.name} desc={text.desc} price={money(pickEntry.item.price)}
                    glass={pickEntry.item.glass ?? 'wine'} taste={pickEntry.taste} n={pickEntry.item.lvl}
                    house={pickEntry.item.house} label={t('pick.label')}
                    onTap={handlePickTap}
                    onDismiss={() => {
                      skipOpenRef.current = true
                      setTimeout(() => { skipOpenRef.current = false }, 0)
                      setPickDismissed(true)
                    }}
                  />
                )
              })()}

              {currentSection && (() => {
                const secText = pl(currentSection.i18n) as { label: string; sub?: string; note?: string }
                const hasIcon = tab === 'bitter' || tab === 'sour' || tab === 'sweet'
                return (
                  <div style={{ marginTop: 24, borderBottom: '1px solid var(--line-strong)', paddingBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                        {hasIcon && <SectionIcon taste={tab} />}
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3125rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-heading)', lineHeight: 1 }}>
                          {secText.label}
                        </h3>
                      </div>
                      {secText.sub && (
                        <span style={{ fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.625rem', letterSpacing: '0.02em', color: 'var(--ink-faint)', textAlign: 'right', maxWidth: 150 }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'compact' ? 0 : 14, marginTop: viewMode === 'compact' ? 8 : 16 }}>
                {currentSection?.items.map(item => {
                  const text = pl(item.i18n)
                  return (
                    <ItemCard
                      key={item.slug} id={item.slug}
                      name={text.name} desc={text.desc} price={money(item.price)}
                      glass={item.glass} taste={currentSection.key}
                      compact={viewMode === 'compact'}
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

              <div style={{ textAlign: 'center', fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(84 89 90 / 0.32)', marginTop: 34 }}>
                {t('footer.powered')}
              </div>
            </div>
          </>
        )}

        {/* ===== FOOD ===== */}
        {category === 'food' && (
          <>

            <div style={{ padding: '0 18px 50px' }}>
              {foodTab === 'pizza' && (
                <PizzaNote boldText={t('pizza_note.bold')} bodyText={t('pizza_note.text')} />
              )}

              {currentFoodSection && (() => {
                const secText = pl(currentFoodSection.i18n) as { label: string; sub?: string; badge?: string; note?: string }
                return (
                  <div style={{ marginTop: 24, borderBottom: '1px solid var(--line-strong)', paddingBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3125rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-heading)', lineHeight: 1 }}>
                          {secText.label}
                        </h3>
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
                {currentFoodSection?.items.map(item => {
                  const text = pl(item.i18n)
                  return (
                    <FoodCard
                      key={item.slug} id={item.slug}
                      name={text.name} desc={text.desc} price={item.price}
                      badge={item.badge}
                      compact={viewMode === 'compact'}
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

              {/* Food featured pick callout — appears at bottom of showAfterSection tab */}
              {!foodPickDismissed && menuData.foodFeaturedPick?.showAfterSection === foodTab && foodPickEntry && (() => {
                const fp = menuData.foodFeaturedPick!
                const fpText = pl(fp.i18n) as { label: string; desc?: string }
                const itemText = pl(foodPickEntry.item.i18n)
                return (
                  <div
                    onClick={() => {
                      skipOpenRef.current = true
                      setTimeout(() => { skipOpenRef.current = false }, 0)
                      setFoodTab(foodPickEntry.sectionKey)
                      setPendingScroll(foodPickEntry.item.slug)
                    }}
                    style={{
                      cursor: 'pointer',
                      background: 'var(--pick-bg, var(--surface-frame))',
                      borderLeft: '3px solid var(--pick-border-color, var(--brand))',
                      padding: '16px 20px',
                      margin: '20px -18px 0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: 'var(--font-text)', fontWeight: 600, fontSize: '11px',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'var(--pick-label-color, var(--brand-bright))',
                      }}>
                        {fpText.label}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFoodPickDismissed(true) }}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--ink-faint)', fontSize: '0.9375rem', lineHeight: 1,
                          padding: '0 0 0 8px', flexShrink: 0,
                        }}
                        aria-label="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                    {fpText.desc && (
                      <p style={{
                        fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.71875rem',
                        color: 'var(--pick-muted, var(--ink-faint))', margin: '8px 0 10px', lineHeight: 1.45,
                      }}>
                        {fpText.desc}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem',
                        color: 'var(--ink-heading)', letterSpacing: '0.02em',
                      }}>
                        {itemText.name}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.9375rem',
                        color: 'var(--ink-heading)', flexShrink: 0,
                      }}>
                        {money(foodPickEntry.item.price)}
                      </span>
                    </div>
                  </div>
                )
              })()}

              <div style={{ textAlign: 'center', fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.5625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgb(84 89 90 / 0.32)', marginTop: 34 }}>
                {t('footer.powered')}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail sheet */}
      {openItem && (
        <DetailSheet
          name={openItem.name} desc={openItem.desc} price={openItem.price}
          taste={openItem.taste} n={openItem.n} single={openItem.single}
          loved={openItem.loved} house={openItem.house} isFood={openItem.isFood}
          pairLabel={openItem.pairLabel}
          dishes={openItem.dishes?.map(d => ({ ...d, ...makeDishHandlers(d) }))}
          hasWhy={openItem.hasWhy} whyIsCocktail={openItem.whyIsCocktail}
          whyLead={openItem.whyLead} whyDrink={openItem.whyDrink} whyPost={openItem.whyPost}
          foodWhy={openItem.foodWhy}
          onClose={() => setOpenItem(null)}
          onAdd={() => {
            pushToCart(openItem.slug, openItem.name, openItem.rawPrice)
            setOpenItem(null)
          }}
          backgroundTheme={backgroundTheme ?? 'none'}
        />
      )}

      {/* Cart bar */}
      {count > 0 && !showList && (
        <CartBar
          count={count} totalStr={String(total)} detailOpen={!!openItem}
          label={t('cart.show_waiter')}
          onClick={() => setShowList(true)}
        />
      )}

      {/* List sheet */}
      {showList && (
        <ListSheet
          lines={cartLines} totalStr={String(total)}
          heading={t('cart.open_list')} totalLabel={t('cart.total_label')}
          clearLabel={t('cart.clear')} keepBrowsing={t('cart.keep_browsing')}
          onClear={() => { clearCart(venueSlug); setCart([]); setShowList(false) }}
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
          onClose={() => { lsSet(`onboarding_seen_${venueSlug}`, '1'); setLegendOpen(false) }}
        />
      )}
    </div>
  )
}
