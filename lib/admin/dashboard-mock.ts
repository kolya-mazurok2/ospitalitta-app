// Dashboard mock data — Stage 2 preview. Exact numbers from the Saly handoff
// (Ospitalitta Admin · Dashboard.dc.html). Real analytics wired later.

export type RangeKey = 'day' | 'week' | 'month'

export interface RangeData {
  scans: number; unique: number; views: number; bookmarks: number
  dScans: string; dUnique: string; dViews: string; dBook: string
  unit: 'by hour' | 'by day'
  bars: number[]
  labels: string[]
}

export const RANGE_DATA: Record<RangeKey, RangeData> = {
  day: {
    scans: 312, unique: 248, views: 1840, bookmarks: 64,
    dScans: '8%', dUnique: '5%', dViews: '7%', dBook: '11%',
    unit: 'by hour',
    bars: [18, 24, 30, 38, 52, 46, 40, 58, 72, 64, 50, 32],
    labels: ['12', '15', '18', '21', '23'],
  },
  week: {
    scans: 1920, unique: 1510, views: 11200, bookmarks: 392,
    dScans: '14%', dUnique: '9%', dViews: '12%', dBook: '18%',
    unit: 'by day',
    bars: [210, 260, 240, 300, 420, 560, 480],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  month: {
    scans: 8400, unique: 6300, views: 49000, bookmarks: 1680,
    dScans: '22%', dUnique: '15%', dViews: '19%', dBook: '24%',
    unit: 'by day',
    bars: [120, 140, 130, 160, 150, 180, 210, 170, 150, 190, 210, 240, 300, 260, 220, 240, 280, 300, 340, 420, 360, 320, 300, 360, 400, 460, 520, 470, 430, 500],
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  },
}

export const RANGE_WORD: Record<RangeKey, string> = { day: 'today', week: 'this week', month: 'this month' }

export interface CountryRow { code: string; name: string; pct: number }
export const COUNTRIES: CountryRow[] = [
  { code: 'PL', name: 'Poland', pct: 24 },
  { code: 'DE', name: 'Germany', pct: 20 },
  { code: 'NO', name: 'Norway', pct: 16 },
  { code: 'IT', name: 'Italy', pct: 14 },
  { code: 'FR', name: 'France', pct: 12 },
  { code: 'AL', name: 'Albania', pct: 8 },
  { code: 'GB', name: 'United Kingdom', pct: 6 },
]

export interface RankedItem { name: string; n: number }
export const BOOKMARKS: RankedItem[] = [
  { name: 'Gillardeau oysters', n: 142 },
  { name: 'Aperol Spritz', n: 119 },
  { name: 'Whole sea bass', n: 98 },
  { name: 'Negroni', n: 87 },
  { name: 'Grilled octopus', n: 74 },
]
export const VIEWS: RankedItem[] = [
  { name: 'Whole sea bass', n: 1240 },
  { name: 'Aperol Spritz', n: 1180 },
  { name: 'Gillardeau oysters', n: 980 },
  { name: 'Catch of the day', n: 870 },
  { name: 'Negroni', n: 760 },
]

export const HOURS: number[] = [28, 34, 30, 26, 32, 44, 62, 78, 96, 88, 64, 40]
export const HOUR_LABELS = ['12', '16', '20', '23']

/** 11200 → "11 200" (space thousands separator). */
export function fmt(n: number): string {
  return n.toLocaleString('en-US').replace(/,/g, ' ')
}
