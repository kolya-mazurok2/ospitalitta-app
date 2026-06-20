import FramedPlaque from '@/components/FramedPlaque'

interface Props {
  boldText: string   // "Made to order." / "Fatto su ordinazione."
  bodyText: string   // the full sentence from messages
}

export default function PizzaNote({ boldText, bodyText }: Props) {
  return (
    <FramedPlaque style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginTop: 16, padding: '12px 14px 13px' }}>
      <svg viewBox="0 0 24 24"
        style={{ width: 18, height: 18, display: 'block', flexShrink: 0, marginTop: 1 }}
        fill="none" stroke="var(--brand)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5l3 2" />
      </svg>
      <p style={{
        fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.84375rem',
        lineHeight: 1.45, color: 'var(--ink)', textWrap: 'pretty', margin: 0,
      }}>
        <span style={{ fontWeight: 500, color: 'var(--ink-body-2)' }}>{boldText}</span>{' '}{bodyText}
      </p>
    </FramedPlaque>
  )
}
