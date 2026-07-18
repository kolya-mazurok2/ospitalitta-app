/**
 * "X added" confirmation. Rendered by both the menu list and the product page from the
 * same useCart toast state, so the feedback is identical wherever the guest taps "+".
 */
export default function AddedToast({ id, text }: { id: number; text: string }) {
  return (
    <div
      key={id}
      className="animate-bb-dim"
      style={{
        position: 'absolute', top: 12, right: 12, zIndex: 70,
        maxWidth: 'calc(100% - 24px)',
        // Brand olive rather than another dark surface: it separates from the cream page
        // AND from the dark one, where a dark toast on a dark background disappeared.
        background: 'var(--brand)', color: 'var(--surface)',
        padding: '11px 15px',
        fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
        lineHeight: 1.3, letterSpacing: '0.01em',
        boxShadow: '0 12px 30px rgb(0 0 0 / 0.35)',
        pointerEvents: 'none',
      }}
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  )
}
