import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IconBack } from './icons'
import { sfx } from '../audio/sfx'
import { KIND_META, type PabandiCard } from '../data/pabandi'

export function Screen({ children, className = 'bg-kagaz', dots = true }: { children: ReactNode; className?: string; dots?: boolean }) {
  return (
    <main className={`relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden ${className}`}>
      {dots && <div className="halftone pointer-events-none absolute inset-0" />}
      <div className="relative flex flex-1 flex-col">{children}</div>
    </main>
  )
}

export function Header({ title, sub, step, onBack, tone = 'sindoor' }: {
  title: string; sub?: string; step?: string; onBack?: () => void; tone?: 'sindoor' | 'nimbu'
}) {
  const bg = tone === 'sindoor' ? 'bg-sindoor text-kagaz' : 'bg-nimbu text-kajal'
  return (
    <>
      <header className={`${bg} border-b-[3px] border-kajal px-5 pt-5 pb-4`}>
        <div className="flex min-h-11 items-center justify-between">
          {onBack ? (
            <button type="button" aria-label="Back" onClick={() => { sfx.tap(); onBack() }}
              className="flex size-11 items-center justify-center rounded-xl border-[3px] border-kajal bg-kagaz text-kajal">
              <IconBack />
            </button>
          ) : <span />}
          {step && <span className="text-sm font-bold">{step}</span>}
        </div>
        <h1 className="mt-3 font-display text-[26px] leading-tight">{title}</h1>
        {sub && <p className={`mt-0.5 text-[15px] font-semibold ${tone === 'sindoor' ? 'text-blush' : 'text-kajal'}`}>{sub}</p>}
      </header>
      <div className="zigzag h-3.5 border-b-[3px] border-kajal" />
    </>
  )
}

type Tone = 'haldi' | 'paper' | 'kajal' | 'sindoor' | 'peacock'
const TONES: Record<Tone, string> = {
  haldi: 'bg-haldi text-kajal',
  paper: 'bg-paper text-kajal',
  kajal: 'bg-kajal text-kagaz',
  sindoor: 'bg-sindoor text-kagaz',
  peacock: 'bg-peacock text-kagaz',
}

export function Btn({ tone = 'haldi', big = false, className = '', children, onClick, silent, ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; big?: boolean; silent?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      onClick={(e) => { if (!silent) sfx.tap(); onClick?.(e) }}
      className={`pop flex items-center justify-center gap-2.5 rounded-[18px] [&_svg]:shrink-0 border-[3px] border-kajal px-4 font-display disabled:cursor-not-allowed disabled:opacity-50 ${big ? 'min-h-[62px] text-lg' : 'min-h-[52px] text-base'} ${TONES[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Footer({ children }: { children: ReactNode }) {
  return <div className="sticky bottom-0 mt-auto flex flex-col gap-3 bg-gradient-to-t from-kagaz via-kagaz to-transparent px-5 pt-6 pb-[max(20px,env(safe-area-inset-bottom))]">{children}</div>
}

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border-2 border-kajal px-3 py-0.5 text-[13px] font-bold ${className}`}>{children}</span>
}

/** A Pabandi rule card, drawn as a perforated postage stamp. */
export function Stamp({ card, size = 'md', className = '' }: { card: PabandiCard; size?: 'sm' | 'md' | 'wide' | 'lg'; className?: string }) {
  const meta = KIND_META[card.kind]
  const big = size === 'lg'
  const box = { lg: 'min-h-[230px] px-5 py-6', wide: 'min-h-[118px] px-4 py-3', md: 'min-h-[150px] px-2.5 py-3', sm: 'min-h-[86px] px-2 py-2' }[size]
  const title = { lg: 'text-[34px]', wide: 'text-[26px]', md: 'text-xl', sm: 'text-base' }[size]
  const rule = { lg: 'text-lg', wide: 'text-base', md: 'text-[12.5px]', sm: '' }[size]
  return (
    <div className={`stamp ${className}`}>
      <div
        className={`flex flex-col items-center justify-center gap-1 border-2 border-kajal text-center ${box}`}
        style={{ background: meta.color, color: meta.ink }}
      >
        <span className={`font-extrabold tracking-wider uppercase ${big || size === 'wide' ? 'text-xs' : 'text-[10.5px]'}`}>{meta.label}</span>
        <span className={`font-display leading-none ${title}`}>{card.title}</span>
        {size !== 'sm' && <span className={`font-bold leading-tight ${rule}`}>{card.rule}</span>}
      </div>
    </div>
  )
}

export function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label}
      onClick={() => { sfx.tap(); onChange(!on) }}
      className={`relative h-8 w-14 shrink-0 rounded-full border-[2.5px] border-kajal p-0 transition-colors ${on ? 'bg-peacock' : 'bg-[#D9CBB0]'}`}>
      <span className={`absolute top-[2px] size-[23px] rounded-full border-2 border-kajal bg-paper transition-all ${on ? 'left-[27px]' : 'left-[2px]'}`} />
    </button>
  )
}

export function Segmented<T extends string | number>({ value, options, onChange, label }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-[14px] border-[2.5px] border-kajal bg-paper p-1">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button key={String(o.value)} type="button" role="radio" aria-checked={on}
            onClick={() => { sfx.tap(); onChange(o.value) }}
            className={`min-h-11 flex-1 rounded-[10px] text-base font-extrabold ${on ? 'bg-kajal text-haldi' : 'text-kajal'}`}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
