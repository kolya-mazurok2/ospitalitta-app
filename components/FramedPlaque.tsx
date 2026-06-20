import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export default function FramedPlaque({ children, className, style, onClick }: Props) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--surface-frame)',
        border: '1px solid var(--hairline)',
        padding: '14px 16px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
