interface Props {
  bodyText: string   // the whole note — one plain sentence, no lead-in
  /** Optional target — set when the note points at a specific item in the list. */
  onClick?: () => void
  /** Side padding of the container to bleed past, so the row spans the screen. */
  bleed?: number
}

/**
 * Quiet aside inside a food section: the pizza timing tip, the "for two" recommendation.
 *
 * Deliberately NOT a FramedPlaque: the olive frame is the loud treatment, reserved for
 * things the venue is pushing. These are asides — findable when read, invisible when
 * not. Hence no border, a faint tint, muted ink, and no dismiss control to argue with.
 */
export default function SectionNote({ bodyText, onClick, bleed = 18 }: Props) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'flex-start', gap: 9,
      // Bottom margin so whatever follows (a heading, a list) is not glued to the rule.
      margin: `16px ${-bleed}px 16px`, padding: `10px ${bleed}px 11px`,
      // Faint tint plus one olive rule down the left edge. No full frame: that is the
      // loud treatment, reserved for what the venue is actively pushing.
      background: 'var(--surface-frame)',
      borderLeft: '2px solid var(--hairline)',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <svg viewBox="0 0 24 24"
        style={{ width: 14, height: 14, display: 'block', flexShrink: 0, marginTop: 2 }}
        fill="var(--brand)"
        aria-hidden>
        <path d="M9.6 5.5c-2.9 0-5.1 2.2-5.1 5.1 0 2.6 1.9 4.6 4.4 4.6.5 0 .9-.1 1.3-.2-.5 1.6-1.9 2.8-3.6 3.2-.4.1-.6.4-.5.8.1.3.4.5.7.5h.2c3.4-.8 5.8-3.8 5.8-7.4 0-3.7-1.4-6.6-3.2-6.6z" />
        <path d="M18.3 5.5c-2.9 0-5.1 2.2-5.1 5.1 0 2.6 1.9 4.6 4.4 4.6.5 0 .9-.1 1.3-.2-.5 1.6-1.9 2.8-3.6 3.2-.4.1-.6.4-.5.8.1.3.4.5.7.5h.2c3.4-.8 5.8-3.8 5.8-7.4 0-3.7-1.4-6.6-3.2-6.6z" />
      </svg>
      <p style={{
        fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.75rem',
        lineHeight: 1.45, color: 'var(--ink-body-2)', textWrap: 'pretty', margin: 0,
      }}>
        {bodyText}
      </p>
    </div>
  )
}
