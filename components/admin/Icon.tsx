// Admin icons via the external sprite (public/admin/icons.svg) + currentColor.
// 24×24, stroke/fill inherit `color`. Symbols: ic-<name>.

export type IconName =
  | 'dashboard' | 'menu' | 'translate' | 'qr'
  | 'collapse' | 'settings' | 'house' | 'loved' | 'chevron' | 'copy'

interface Props {
  name: IconName
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function Icon({ name, size = 24, className, style }: Props) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <use href={`/admin/icons.svg#ic-${name}`} />
    </svg>
  )
}
