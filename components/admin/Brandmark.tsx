// Ospitalitta house-mark — split logo: gold half-disc (left) + ember star (right).
export default function Brandmark({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block', flexShrink: 0 }} aria-hidden>
      <defs>
        <clipPath id="osp-bL"><rect x="0" y="0" width="96" height="200" /></clipPath>
        <clipPath id="osp-bR"><rect x="104" y="0" width="96" height="200" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="50" fill="#E0992E" clipPath="url(#osp-bL)" />
      <polygon
        points="166,100 146.2,80.9 146.7,53.3 119.1,53.8 100,34 80.9,53.8 53.3,53.3 53.8,80.9 34,100 53.8,119.1 53.3,146.7 80.9,146.2 100,166 119.1,146.2 146.7,146.7 146.2,119.1"
        fill="#D6431C"
        clipPath="url(#osp-bR)"
      />
    </svg>
  )
}
