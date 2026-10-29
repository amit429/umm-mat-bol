import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = ({ size = 22, ...rest }: P) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...rest,
})

export const IconBack = (p: P) => <svg {...base(p)}><path d="M15 5l-7 7 7 7" /></svg>
export const IconArrow = (p: P) => <svg {...base(p)}><path d="M5 12h13M13 6l6 6-6 6" /></svg>
export const IconPlus = (p: P) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
export const IconX = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
export const IconCheck = (p: P) => <svg {...base(p)}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
export const IconShuffle = (p: P) => <svg {...base(p)}><path d="M3 7h4c5 0 6 10 11 10h3M3 17h4c2 0 3-1.5 4-3M15 7h6M18 4l3 3-3 3M18 14l3 3-3 3" /></svg>
export const IconLock = (p: P) => <svg {...base(p)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
export const IconSkip = (p: P) => <svg {...base(p)}><path d="M5 5l8 7-8 7M14 5v14" /></svg>
export const IconUndo = (p: P) => <svg {...base(p)}><path d="M9 7H4V2M4 7c3-3 6-4 9-4a8 8 0 1 1-7.5 10.5" /></svg>
export const IconPause = (p: P) => <svg {...base(p)}><path d="M8 5v14M16 5v14" /></svg>
export const IconPlay = (p: P) => <svg {...base(p)}><path d="M7 5l12 7-12 7z" fill="currentColor" /></svg>
export const IconBolt = (p: P) => <svg {...base(p)}><path d="M14 3l-2 6h6l-8 12 2-8H6z" fill="currentColor" strokeWidth={1.5} /></svg>
export const IconMenu = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
export const IconSound = (p: P) => <svg {...base(p)}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M17 9c1.5 1.5 1.5 4.5 0 6M19.5 6.5c3 3 3 8 0 11" /></svg>
export const IconMute = (p: P) => <svg {...base(p)}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M17 9l5 6M22 9l-5 6" /></svg>
export const IconEye = (p: P) => (
  <svg {...base(p)} viewBox="0 0 24 24"><path d="M2 12c3-5 6-7 10-7s7 2 10 7c-3 5-6 7-10 7s-7-2-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
)
export const IconEyeOff = (p: P) => (
  <svg {...base(p)}><path d="M2 12c3-5 6-7 10-7s7 2 10 7c-3 5-6 7-10 7s-7-2-10-7z" /><circle cx="12" cy="12" r="3" /><path d="M4 20L20 4" /></svg>
)
export const IconWarn = (p: P) => (
  <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 22" aria-hidden="true"><path d="M12 2L23 20H1z" fill="#F5B820" stroke="#231815" strokeWidth="2.2" strokeLinejoin="round" /><path d="M12 8v6M12 16.5v.5" stroke="#231815" strokeWidth="2.6" strokeLinecap="round" /></svg>
)
