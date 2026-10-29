// Hand-drawn style illustrations, flat colours with thick kajal outlines.

const INK = '#231815'

export function Chili({ size = 34, fill = '#D7261E' }: { size?: number; fill?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <path d="M27 7c-2 0-3 2-3 4" stroke="#2F8F46" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M24 11c-9 2-16 10-17 22 6-3 18-8 21-17 1-3-1-5-4-5z" fill={fill} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 22c2-3 5-5 8-6" stroke="#FFF8EA" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Lemon({ size = 34, face = false }: { size?: number; face?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <ellipse cx="20" cy="22" rx="14" ry="11" fill="#C9DC3B" stroke={INK} strokeWidth="2.5" />
      <path d="M33 20l4-2M7 24l-4 2" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 18c2-2 5-3 8-3" stroke="#FFF8EA" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 11c1-3 4-4 6-3-1 2-3 3-6 3z" fill="#2F8F46" stroke={INK} strokeWidth="2" />
      {face && (
        <>
          <circle cx="15" cy="21" r="1.6" fill={INK} />
          <circle cx="25" cy="21" r="1.6" fill={INK} />
          <path d="M15 25c1.5 2 3 2.6 5 2.6s3.5-.6 5-2.6" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export const TeamEmblem = ({ team, size = 34 }: { team: 'mirchi' | 'nimbu'; size?: number }) =>
  team === 'mirchi' ? <Chili size={size} /> : <Lemon size={size} />

/** Nimbu-mirchi charm, the kind hung on trucks and shop doors. */
export function Charm({ className }: { className?: string }) {
  const chili = (d: string, f: string) => <path d={d} fill={f} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
  return (
    <svg viewBox="0 0 140 200" className={className} aria-hidden="true">
      <line x1="70" y1="0" x2="70" y2="176" stroke={INK} strokeWidth="3" />
      <rect x="61" y="14" width="18" height="12" rx="3" fill={INK} />
      <ellipse cx="70" cy="46" rx="21" ry="17" fill="#C9DC3B" stroke={INK} strokeWidth="3" />
      <path d="M58 38c4-4 9-6 15-6" stroke="#FFF8EA" strokeWidth="3" fill="none" strokeLinecap="round" />
      {chili('M70 68c-14 4-24 16-26 30 10-4 22-12 26-24z', '#D7261E')}
      {chili('M70 68c14 4 24 16 26 30-10-4-22-12-26-24z', '#E03A22')}
      {chili('M70 92c-13 5-21 18-22 32 9-5 19-14 22-26z', '#E03A22')}
      {chili('M70 92c13 5 21 18 22 32-9-5-19-14-22-26z', '#D7261E')}
      {chili('M70 116c-11 6-17 18-17 30 8-5 15-14 17-24z', '#D7261E')}
      {chili('M70 116c11 6 17 18 17 30-8-5-15-14-17-24z', '#E03A22')}
      {chili('M70 140c-5 10-5 24 0 36 5-12 5-26 0-36z', '#D7261E')}
      {[66, 90, 114, 138].map((y) => <circle key={y} cx="70" cy={y} r="4" fill="#2F8F46" stroke={INK} strokeWidth="2" />)}
    </svg>
  )
}

/** Small pressure cooker for the SEETI button. */
export function CookerIcon({ size = 52 }: { size?: number }) {
  return (
    <svg viewBox="0 0 56 48" width={size} height={size * 48 / 56} aria-hidden="true">
      <path d="M30 4c4 2 4 5 0 7M38 3c4 2 4 5 0 7" fill="none" stroke="#F7ECD5" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="22" y="9" width="8" height="8" rx="2" fill="#F5B820" stroke={INK} strokeWidth="2.5" />
      <path d="M8 30c2-9 9-14 18-14s16 5 18 14z" fill="#D9D2C3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M42 24l12-3" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <rect x="5" y="29" width="42" height="15" rx="5" fill="#C9C1B3" stroke={INK} strokeWidth="3" />
    </svg>
  )
}

/** The shouting cooker mascot for the seeti screen. */
export function CookerMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 250" className={className} role="img" aria-label="A pressure cooker whistling">
      <g className="steam">
        <circle cx="96" cy="30" r="16" fill="#FFF8EA" stroke={INK} strokeWidth="3" />
        <circle cx="122" cy="18" r="20" fill="#FFF8EA" stroke={INK} strokeWidth="3" />
        <circle cx="152" cy="26" r="15" fill="#FFF8EA" stroke={INK} strokeWidth="3" />
        <circle cx="140" cy="44" r="12" fill="#FFF8EA" stroke={INK} strokeWidth="3" />
      </g>
      <path d="M40 70l-22-10M36 92l-26 0M44 114l-22 10M216 70l22-10M220 92h26" stroke="#F5B820" strokeWidth="5" strokeLinecap="round" />
      <rect x="112" y="56" width="22" height="20" rx="4" fill="#F5B820" stroke={INK} strokeWidth="3" />
      <rect x="118" y="48" width="10" height="10" rx="3" fill={INK} />
      <path d="M52 128c4-30 34-52 72-52s68 22 72 52z" fill="#E4DED2" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M190 112l58-14" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <rect x="40" y="124" width="168" height="104" rx="22" fill="#D9D2C3" stroke={INK} strokeWidth="3.5" />
      <rect x="42" y="140" width="164" height="10" fill="#C2B9A8" />
      <path d="M58 168c10-6 18-6 26 0M162 168c10-6 18-6 26 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M70 158l12 6M176 158l-12 6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="124" cy="196" rx="24" ry="20" fill={INK} />
      <ellipse cx="124" cy="206" rx="13" ry="8" fill="#E0457B" />
      <circle cx="66" cy="196" r="8" fill="#E0457B" opacity=".55" />
      <circle cx="182" cy="196" r="8" fill="#E0457B" opacity=".55" />
    </svg>
  )
}

/** Cutting-chai glass that drains as the turn runs down. `level` is 0..1. */
export function ChaiGlass({ level, size = 40 }: { level: number; size?: number }) {
  const top = 6 + (1 - Math.max(0, Math.min(1, level))) * 52
  const inset = (y: number) => 5 + ((y - 4) / 56) * 6
  return (
    <svg viewBox="0 0 56 64" width={size} height={size * 64 / 56} aria-hidden="true">
      <path d={`M${inset(top)} ${top}H${56 - inset(top)}L45 60H11Z`} fill="#B5651D" />
      {level > 0.02 && <path d={`M${inset(top)} ${top}H${56 - inset(top)}`} stroke="#F3D9A8" strokeWidth="4" />}
      <path d="M5 4H51L45 60H11Z" fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M18 8l2 48M28 8v48M38 8l-2 48" stroke={INK} strokeWidth="1.4" opacity=".35" />
    </svg>
  )
}

export function GoaScene() {
  return (
    <svg viewBox="0 0 390 104" className="block h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="390" height="104" fill="#F5B820" />
      <circle cx="300" cy="62" r="46" fill="#E0457B" stroke={INK} strokeWidth="3" />
      <circle cx="300" cy="62" r="30" fill="#C8242B" />
      <rect y="66" width="390" height="22" fill="#0E6C6A" />
      <path d="M0 72c20 4 40-4 60 0s40 4 60 0 40-4 60 0 40 4 60 0 40-4 60 0 40 4 60 0 30-4 30-4" fill="none" stroke="#F7ECD5" strokeWidth="2.5" />
      <rect y="86" width="390" height="18" fill="#F7ECD5" />
      <line x1="0" y1="66" x2="390" y2="66" stroke={INK} strokeWidth="3" />
      <line x1="0" y1="86" x2="390" y2="86" stroke={INK} strokeWidth="3" />
      <path d="M52 100c4-28 6-50 18-74" fill="none" stroke="#7A4A26" strokeWidth="7" strokeLinecap="round" />
      <path d="M70 26c-14-8-30-6-40 4 14-2 26 0 40-4z" fill="#2F8F46" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 26c10-12 26-14 38-8-14 2-26 4-38 8z" fill="#2F8F46" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 26c-4-12-14-20-26-20 8 6 14 12 26 20z" fill="#3FA35A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 26c12-2 24 6 28 18-8-8-18-12-28-18z" fill="#3FA35A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="66" cy="30" r="4" fill="#7A4A26" stroke={INK} strokeWidth="2" />
    </svg>
  )
}

export function TollBooth() {
  return (
    <svg viewBox="0 0 390 170" className="block w-full" aria-hidden="true">
      <rect x="0" y="138" width="390" height="32" fill="#3B3330" />
      <path d="M0 154h390" stroke="#F7ECD5" strokeWidth="3" strokeDasharray="18 14" />
      <rect x="24" y="44" width="92" height="94" fill="#F5B820" stroke={INK} strokeWidth="3.5" />
      <path d="M14 46l56-30 56 30z" fill="#C8242B" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="40" y="62" width="60" height="38" rx="4" fill="#BFE3E0" stroke={INK} strokeWidth="3" />
      <path d="M48 70l14 22M64 68l14 22" stroke="#FFF8EA" strokeWidth="3" strokeLinecap="round" />
      <rect x="40" y="108" width="60" height="12" fill={INK} />
      <rect x="128" y="104" width="16" height="34" fill={INK} />
      <g transform="rotate(-24 136 108)">
        <rect x="136" y="100" width="230" height="16" rx="3" fill="#FFF8EA" />
        <path d="M156 100v16M186 100v16M216 100v16M246 100v16M276 100v16M306 100v16M336 100v16" stroke="#C8242B" strokeWidth="14" />
        <rect x="136" y="100" width="230" height="16" rx="3" fill="none" stroke={INK} strokeWidth="3" />
      </g>
    </svg>
  )
}

export function Garland() {
  const xs = [10, 36, 62, 88, 114, 140, 166, 195, 224, 250, 276, 302, 328, 354, 380]
  const y = (x: number) => 6 + 90 * (1 - Math.pow((x - 195) / 205, 2)) * 0.6
  return (
    <svg viewBox="0 0 390 90" className="block w-full" aria-hidden="true">
      <path d="M-10 6Q195 96 400 6" fill="none" stroke={INK} strokeWidth="2.5" />
      {xs.map((x, i) => (
        <circle key={x} cx={x} cy={y(x)} r={x === 195 ? 12 : 11} fill={x === 195 ? '#C8242B' : i % 2 ? '#FFD23F' : '#F28C1B'} stroke={INK} strokeWidth="2.5" />
      ))}
    </svg>
  )
}
