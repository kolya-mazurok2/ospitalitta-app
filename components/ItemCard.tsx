'use client'

import CardVideo from '@/components/CardVideo'
import Glass from '@/components/Glass'
import type { GlassType } from '@/lib/menu-data'
import { clampDesc } from '@/lib/text'


interface Props {
  id: string
  name: string
  desc: string
  price: string
  glass?: GlassType
  taste: string
  lvl?: 1 | 2 | 3
  flavor?: 'sweet' | 'sour'
  loved?: boolean
  house?: boolean
  houseIndicator?: string
  compact?: boolean
  videoSrc?: string
  posterSrc?: string
  lovedLabel: string
  priority?: boolean   // first card in the list — eager, everything below stays lazy
  onTap: () => void
  onAdd: (e: React.MouseEvent) => void
}

function OliveSvg({ size = 11, inline = false, style: extraStyle }: { size?: number; inline?: boolean; style?: React.CSSProperties }) {
  return (
    <svg
      width={size} height={Math.round(size * 13 / 11)} viewBox="0 0 24 24"
      style={inline
        ? { display: 'inline-block', verticalAlign: 'middle', position: 'relative', top: '-1px', flexShrink: 0, ...extraStyle }
        : { display: 'block', flexShrink: 0, ...extraStyle }
      }
      aria-hidden
    >
      <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
      <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
      <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
    </svg>
  )
}

function FishSvg({ size = 11, inline = false, style: extraStyle }: { size?: number; inline?: boolean; style?: React.CSSProperties }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 64 64"
      style={inline
        ? { display: 'inline-block', verticalAlign: 'middle', position: 'relative', top: '-1px', flexShrink: 0, fill: 'var(--brand)', ...extraStyle }
        : { display: 'block', flexShrink: 0, fill: 'var(--brand)', ...extraStyle }
      }
      aria-hidden
    >
      <path d="m58.05566 34.94824c-.51465.20215-.76807.78223-.56689 1.2959.79639 2.03516.50586 4.03027.1958 5.19727-1.48096-.01367-2.89453-.3916-4.12402-1.10742-1.22119-.70508-2.22656-1.71875-2.98779-3.00977-.53955-.91992-1.4458-1.54102-2.4873-1.7041-.99854-.15527-1.99658.1377-2.7417.80371-5.09766 4.55078-10.46289 7.06445-15.94824 7.46875-10.72559.7998-18.5542-5.39941-22.2749-9.16602-1.48779-1.50293-1.48779-3.94971.00098-5.4541 2.55823-2.58972 6.3175-5.62054 11.14551-7.48596 1.77833 3.105 2.72198 6.61941 2.73291 10.19739.0083 2.22705-.35693 4.43896-1.08642 6.57275-.17871.52246.1001 1.09082.62305 1.26953.50909.17684 1.09164-.09464 1.26953-.62305.80127-2.34472 1.20313-4.77636 1.19385-7.22705-.01236-3.79691-.98132-7.52652-2.80591-10.85345 5.22467-1.6425 10.93906-1.37221 16.10959.55431.33015-.0143.6373-.17739.83157-.44648.50001-.74461 2.02101-3.00975.99317-5.17577-1.09619-2.30859-3.94922-2.7749-6.06104-2.47119-2.72217.38989-5.46021 2.00989-7.94135 4.67163-8.40521 1.0564-14.65143 5.78949-18.42682 9.61157-2.25537 2.2793-2.25537 5.98779-.00049 8.26611 3.30981 3.35059 9.69812 8.49908 18.42139 9.60596 2.87416 3.00076 5.71094 4.67363 9.11325 4.76032 1.89163-.00006 3.99124-.65045 4.89505-2.55475.72565-1.5285.18158-3.10358-.37726-4.16132 3.05145-1.34161 6.03589-3.28821 8.92511-5.86798.30127-.26953.68945-.38574 1.09961-.31934.44629.07031.83691.33984 1.07275.74219.93945 1.59375 2.18799 2.84766 3.7085 3.72656 1.75928 1.02344 3.81592 1.48926 5.93799 1.35352.40039-.02637.74609-.28906.87891-.66797.39893-1.13867 1.19482-4.12305-.02295-7.23438-.20117-.51465-.78174-.76953-1.29541-.56738zm-25.7041-19.38525c2.35858-.39684 5.44373.81073 3.52016 3.90478-2.82222-1.0008-5.68201-1.47059-8.62173-1.42515 1.40705-1.16518 3.14411-2.19887 5.10156-2.47963zm3.97021 31.52393c-.67383 1.41895-2.81543 1.51758-3.97021 1.34961-1.95996-.28076-3.69855-1.31641-5.10632-2.48285.08698.00085.17029.00922.25769.00922 2.84345.01031 5.63585-.45468 8.37073-1.42744.60144 1.06984.75202 1.91102.44812 2.55146z" />
      <path d="m57.06738 28.63525c-.56689 1.00732-1.36426 1.85986-2.37061 2.53369-.45898.30713-.58203.92871-.2749 1.38721 1.20517 1.62982 3.82518-1.94652 4.38872-2.94033 2.00435-3.56211.93941-7.30283.56538-8.36436-.15691-.35536-.47127-.64113-.87697-.66894-2.14637-.14714-4.17695.33393-5.93944 1.35156-1.52246.87939-2.771 2.13378-3.7124 3.72998-.41954.76114-1.52265 1.02885-2.17139.4199-1.75292-1.56394-3.55468-2.91258-5.35644-4.00828-.47217-.28662-1.08691-.13818-1.37402.33496-.28711.47168-.13721 1.08691.33496 1.37402 1.69775 1.03271 3.40137 2.30811 5.0625 3.79053 1.55132 1.44757 4.21534.9364 5.2285-.89752.76271-1.2934 1.76857-2.30659 2.97804-3.0058 1.23598-.71858 2.66323-1.09085 4.13953-1.09704.33527 1.28131.68585 3.73693-.62146 6.06042z" />
      <path d="m28.99561 34.93457-2.0498-1.02051c-.49561-.24707-1.09521-.04492-1.34082.4502-.24609.49414-.04492 1.09473.44922 1.34082l2.05322 1.02148c4.53801 1.64426 5.23522-5.65896 3.4653-8.35679-.6528-1.22573-2.20749-1.71694-3.46823-1.09536l-2.0498 1.02002c-.49463.24609-.6958.84668-.4502 1.34082.24609.49365.8457.69385 1.34082.4502l2.04688-1.01855c.29932-.14893.66504-.03857.82178.25537.91016 1.65186.91016 3.7041-.00635 5.36719-.15088.28223-.51514.39258-.81201.24512z" />
      <path d="m14 28.85986v2c0 .55225.44775 1 1 1s1-.44775 1-1v-2c-.02218-1.31382-1.97776-1.31471-2 0z" />
    </svg>
  )
}

function HouseMark({ kind, size, inline, style }: { kind?: string; size: number; inline?: boolean; style?: React.CSSProperties }) {
  if (kind === 'olive') return <OliveSvg size={size} inline={inline} style={style} />
  if (kind === 'fish') return <FishSvg size={size} inline={inline} style={style} />
  return null
}

export default function ItemCard({
  id, name, desc, price, glass,
  loved, house, houseIndicator, compact, videoSrc, posterSrc, lovedLabel, priority, onTap, onAdd,
}: Props) {
  // taste/lvl/flavor stay in Props — callers pass them and the detail sheet still shows
  // the profile. The card itself no longer draws taste marks.
  const showIndicator = !!(house && houseIndicator)

  if (compact) {
    return (
      <div
        id={`item-${id}`}
        onClick={onTap}
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 12,
          padding: '10px 0',
          borderBottom: '1px solid var(--hairline)',
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Line 1: name + indicator — inline so olive sits flush against text */}
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
              color: 'var(--ink)', verticalAlign: 'middle',
            }}>
              {name}
            </span>
            {showIndicator && <HouseMark kind={houseIndicator} size={houseIndicator === 'fish' ? 13 : 9} inline style={{ marginLeft: 3 }} />}
          </div>
          {/* Description only — price lives in the detail sheet, not in the list */}
          {desc && (
            <p style={{
              fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.6875rem',
              color: 'var(--ink-body-2)', margin: '2px 0 0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {clampDesc(desc)}
            </p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e) }}
          style={{
            flexShrink: 0, width: 34, height: 34,
            background: 'transparent', border: 'none', color: 'var(--ink-faint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
          aria-label={`Add ${name}`}
        >
          <svg viewBox="0 0 100 100" width="30" height="30" fill="none" stroke="currentColor" strokeLinecap="round" style={{ display: 'block' }} aria-hidden>
            <circle cx="50" cy="50" r="46" strokeWidth="3.5"/>
            <line x1="50" y1="32" x2="50" y2="68" strokeWidth="4.5"/>
            <line x1="32" y1="50" x2="68" y2="50" strokeWidth="4.5"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div
      id={`item-${id}`}
      onClick={onTap}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* 16:9 media zone */}
      <div style={{
        aspectRatio: '16/9',
        background: (posterSrc && !videoSrc) ? 'var(--surface-dark)' : 'var(--surface-media)',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {videoSrc ? (
          <CardVideo
            src={videoSrc} poster={posterSrc}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : posterSrc ? (
          <img
            src={posterSrc} alt={name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : glass ? (
          <Glass type={glass} style={{ width: 40, height: 56, color: 'var(--line-strong)' }} />
        ) : null}

        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e) }}
          style={{
            position: 'absolute', bottom: 8, right: 8,
            width: 34, height: 34, borderRadius: '50%',
            border: 'none', background: 'var(--fab-bg)', color: 'var(--fab-fg)',
            fontFamily: 'var(--font-text)', fontSize: '1.375rem', fontWeight: 300,
            lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgb(0 0 0 / 0.28), 0 0 0 1px rgb(255 255 255 / 0.18)', paddingBottom: 2,
          }}
          aria-label={`Add ${name}`}
        >
          <svg viewBox="0 0 100 100" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" style={{ display: 'block' }} aria-hidden>
            <line x1="50" y1="22" x2="50" y2="78" strokeWidth="7"/>
            <line x1="22" y1="50" x2="78" y2="50" strokeWidth="7"/>
          </svg>
        </button>
      </div>

      {/* body: 2×2 grid — desc/name left, price right. loved spans full width above */}
      <div style={{ padding: '10px 15px 14px' }}>
        {loved && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 7 }}>
            <span style={{
              fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.53125rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--brand)', lineHeight: 1, whiteSpace: 'nowrap',
            }}>
              {lovedLabel}
            </span>
            <svg viewBox="154 164 314 303" style={{ width: 12, height: 12, display: 'block', flexShrink: 0, fill: 'var(--brand)' }} aria-hidden>
              <path d="m467.804 292.907c-7.47-48.489-60.582-101.763-132.159-62.814-29.177-90.905-119.689-69.448-145.953-43.65-85.322 76.173 8.362 203.179 40.333 268.032 14.045-39.091-117.417-181.241-27.244-255.414 68.632-56.454 126.977 25.183 124.741 56.454 44.947-40.995 121.184-16.165 122.736 37.392 3.752 129.472-200.887 143.96-206.188 175.093 115.457-25.643 238.406-79.846 223.734-175.093z" />
              <path d="m287.945 231.035c-46.589-62.449-117.225 12.49-74.644 84.931-12.023-79.435 25.55-110.91 74.644-84.931z" />
            </svg>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px',
          gridTemplateRows: '1fr auto',
          columnGap: 14,
          rowGap: 8,
        }}>
          {/* [1,1] desc */}
          <p style={{
            gridColumn: 1, gridRow: 1,
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.84375rem',
            lineHeight: 1.45, color: 'var(--ink-body-2)',
            margin: 0, textWrap: 'pretty' as React.CSSProperties['textWrap'],
            alignSelf: 'start',
          }}>
            {desc}
          </p>

          {/* [2,1] name + olive indicator */}
          <div style={{ gridColumn: 1, gridRow: 2, alignSelf: 'end' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
              letterSpacing: '0.01em', color: 'var(--ink)',
              verticalAlign: 'middle',
            }}>
              {name}
            </span>
            {showIndicator && <HouseMark kind={houseIndicator} size={houseIndicator === 'fish' ? 15 : 11} inline style={{ marginLeft: 3 }} />}
          </div>

          {/* [2,2] price */}
          <span style={{
            gridColumn: 2, gridRow: 2,
            fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
            letterSpacing: '0.03em', color: 'var(--brand)',
            textAlign: 'right', alignSelf: 'end',
          }}>
            {price}
          </span>
        </div>
      </div>
    </div>
  )
}
