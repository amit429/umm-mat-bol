import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useGame } from '../game/store'
import {
  activePabandi, awards, cardById, describerFor, finishLine, inGhat, playerName, remainingMs, rival,
  tollStops, turnTotals, type SlipReason, type TeamId,
} from '../game/engine'
import { KIND_META } from '../data/pabandi'
import { Btn, Chip, Screen, Stamp } from '../ui/kit'
import { ChaiGlass, CookerIcon, CookerMascot, Garland, GoaScene, TeamEmblem, TollBooth } from '../ui/art'
import { IconArrow, IconBolt, IconCheck, IconEye, IconMenu, IconPause, IconPlay, IconSkip, IconUndo, IconWarn } from '../ui/icons'
import { sfx, unlockAudio } from '../audio/sfx'
import { TEAM_INFO } from './Setup'
import { Menu } from './Menu'
import { PabandiSheet } from './PabandiSheet'

// ---------- Board ----------

export function Board() {
  const { game, beginTurn } = useGame()
  const [menu, setMenu] = useState(false)
  const [sheet, setSheet] = useState<TeamId | null>(null)
  const s = game.settings
  const tolls = tollStops(s)
  const rows = Array.from({ length: s.trackLength }, (_, i) => s.trackLength - i)
  const current = game.teams[game.currentTeam]
  const describer = playerName(game, describerFor(current))
  const pos = { mirchi: game.teams.mirchi.position, nimbu: game.teams.nimbu.position }

  return (
    <Screen>
      <div className="relative h-[100px] border-b-[3px] border-kajal">
        <GoaScene />
        <div className="absolute top-2 left-[118px] flex flex-col">
          <span className="outline-text font-display text-[38px] leading-none text-paper [-webkit-text-stroke-width:2.5px] [text-shadow:3px_3px_0_#231815]">GOA</span>
          <span className="text-sm font-extrabold">First one here wins</span>
        </div>
        <button type="button" aria-label="Menu" onClick={() => { sfx.tap(); setMenu(true) }}
          className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-xl border-[3px] border-kajal bg-paper"><IconMenu /></button>
      </div>
      <div className="checkered h-3 border-b-[3px] border-kajal" />

      <section aria-label="Board" className="flex-1 px-3">
        {rows.map((n) => {
          const toll = tolls.includes(n)
          const ghat = inGhat(s, n)
          const lane = toll
            ? 'repeating-linear-gradient(45deg,#C8242B 0 7px,#FFF8EA 7px 14px)'
            : ghat ? 'repeating-linear-gradient(135deg,#5A3B2A 0 10px,#4A2F22 10px 20px)' : '#3B3330'
          const side = n % 2 ? 'justify-start' : 'justify-end'
          return (
            <div key={n} className="grid h-[calc((100dvh-424px)/var(--rows))] max-h-8 min-h-6 grid-cols-[34px_1fr_10px_1fr_44px] items-stretch"
              style={{ ['--rows' as string]: s.trackLength }}>
              <div className="flex items-center justify-center">
                {ghat ? <IconWarn size={20} /> : <span className="font-display text-xs text-muted">{n}</span>}
              </div>
              {(['mirchi', 'nimbu'] as TeamId[]).map((t, idx) => (
                <Lane key={t} team={t} here={pos[t] === n} n={n} lane={lane} side={side} spacer={idx === 0} />
              ))}
              <div className="flex items-center justify-center">
                {toll && <span className="-rotate-6 rounded-[5px] border-2 border-kajal bg-haldi px-1 font-display text-[9px] leading-tight">TOLL</span>}
              </div>
            </div>
          )
        })}
        <div className="grid grid-cols-[34px_1fr_10px_1fr_44px] pt-1 pb-2">
          <span />
          {(['mirchi', 'nimbu'] as TeamId[]).map((t, i) => (
            <div key={t} className={`flex h-9 items-center justify-center gap-1 rounded-b-lg border-[3px] border-t-0 border-kajal font-display text-[11px] ${i === 0 ? 'col-start-2' : 'col-start-4'} ${TEAM_INFO[t].bg} ${TEAM_INFO[t].text}`}>
              {pos[t] === 0 ? <TeamEmblem team={t} size={22} /> : 'START'}
            </div>
          ))}
        </div>
      </section>

      <div className="border-t-[3px] border-kajal bg-paper px-5 pt-3.5 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex gap-2.5">
          {(['mirchi', 'nimbu'] as TeamId[]).map((t) => {
            const team = game.teams[t]
            const shown = team.planted.slice(0, team.revealed).map(cardById)
            const nextStop = tollStops(s)[team.revealed]
            return (
              <button key={t} type="button" onClick={() => { sfx.tap(); setSheet(t) }}
                aria-label={`${TEAM_INFO[t].name}: view Pabandi cards`}
                className={`flex min-h-[76px] flex-1 flex-col items-start gap-1 rounded-xl border-[2.5px] border-kajal px-2.5 py-1.5 text-left shadow-[2px_3px_0_#231815] ${TEAM_INFO[t].bg} ${TEAM_INFO[t].text}`}>
                <span className="flex w-full items-center justify-between gap-1 text-[13px] font-extrabold">
                  {TEAM_INFO[t].name.replace('Team ', '')} · stop {pos[t]}
                  <span className="rounded-md border-2 border-kajal bg-paper px-1.5 text-[11px] leading-tight text-kajal">Rules</span>
                </span>
                <span className="flex flex-wrap gap-1">
                  {shown.map((c) => (
                    <span key={c.id} className="rounded-full border-2 border-kajal px-1.5 text-[11px] leading-tight font-extrabold"
                      style={{ background: KIND_META[c.kind].color, color: KIND_META[c.kind].ink }}>{c.title}</span>
                  ))}
                  {shown.length === 0 && <span className="text-xs font-semibold">{team.planted.length ? `First Pabandi at stop ${nextStop}` : 'No Pabandi this game'}</span>}
                </span>
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => { sfx.tap(); beginTurn() }}
          className="pop flex min-h-[62px] w-full flex-col items-center justify-center rounded-[18px] border-[3px] border-kajal bg-haldi">
          <span className="font-display text-lg leading-tight">{TEAM_INFO[game.currentTeam].name}’s turn</span>
          <span className="text-[13px] font-bold">Describer: {describer} · {TEAM_INFO[rival(game.currentTeam)].name} holds the seeti</span>
        </button>
      </div>
      <AnimatePresence>{menu && <Menu onClose={() => setMenu(false)} />}</AnimatePresence>
      <AnimatePresence>{sheet && <PabandiSheet initial={sheet} onClose={() => setSheet(null)} />}</AnimatePresence>
    </Screen>
  )
}

function Lane({ team, here, n, lane, side, spacer }: { team: TeamId; here: boolean; n: number; lane: string; side: string; spacer: boolean }) {
  const top = team === 'mirchi' ? '#E0574F' : '#A9CF45'
  return (
    <>
      <div className={`flex items-center px-4 ${side} border-x-[3px] border-kajal`} style={{ background: lane }}>
        {here ? (
          <motion.span layoutId={`pawn-${team}`} className={`z-10 -my-1 flex size-[34px] items-center justify-center rounded-full border-[3px] border-kajal shadow-[0_0_0_3px_#F5B820] ${TEAM_INFO[team].bg}`}>
            <TeamEmblem team={team} size={22} />
          </motion.span>
        ) : (
          <span className="flex h-[22px] w-[26px] items-end justify-center rounded-t-[11px] rounded-b-[3px] border-2 border-kajal font-display text-[10px] leading-tight"
            style={{ background: `linear-gradient(${top} 0 40%, #FFF8EA 40%)` }}>{n}</span>
        )}
      </div>
      {spacer && <div />}
    </>
  )
}

// ---------- Pass the phone ----------

export function Pass() {
  const { game, startTurn, useJugaad, go } = useGame()
  const team = game.teams[game.currentTeam]
  const info = TEAM_INFO[team.id]
  const name = playerName(game, describerFor(team))
  const active = team.planted.slice(0, team.revealed).map(cardById)
  const [count, setCount] = useState<number | null>(null)

  // Tap, then 3-2-1, then the words appear. (A press-and-hold fails on phones:
  // iOS and Android cancel long touches to show their own menus.)
  useEffect(() => {
    if (count === null) return
    if (count === 0) { startTurn(); return }
    sfx.tick(count === 1)
    const id = setTimeout(() => setCount(count - 1), 700)
    return () => clearTimeout(id)
  }, [count, startTurn])

  return (
    <Screen className={`${info.bg} ${info.text}`} dots={false}>
      <div className="rays opacity-30" style={{ background: 'repeating-conic-gradient(rgba(255,248,234,.35) 0 10deg, transparent 10deg 20deg)' }} />
      <div className="halftone-strong pointer-events-none absolute inset-0" />
      <div className="relative flex items-center justify-between px-5 pt-5">
        <button type="button" onClick={() => go('board')} disabled={count !== null}
          className="min-h-11 rounded-xl border-[3px] border-kajal bg-paper px-3 font-bold text-kajal disabled:opacity-50">Board</button>
        <Chip className="bg-paper font-display text-kajal">Round {game.round}</Chip>
      </div>
      <div className="relative mt-8 flex flex-col items-center gap-1 px-5 text-center">
        <span className="text-lg font-extrabold">{count === null ? 'Pass the phone to' : 'Get ready,'}</span>
        <h1 className="outline-text max-w-full font-display text-[60px] leading-[0.95] break-words text-paper">{name.toUpperCase()}</h1>
        <span className="text-lg font-extrabold">{info.name}’s Describer</span>
      </div>

      <div className="relative mx-auto mt-8 flex size-[210px] items-center justify-center">
        <AnimatePresence mode="popLayout">
          {count === null ? (
            <motion.button key="go" type="button" onClick={() => { unlockAudio(); setCount(3) }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
              whileTap={{ scale: 0.94 }}
              aria-label={`${name}: tap to start your turn`}
              className="flex size-[200px] touch-manipulation flex-col items-center justify-center gap-1 rounded-full border-4 border-kajal bg-haldi text-kajal shadow-[0_8px_0_#231815,0_0_0_12px_rgba(255,248,234,.5)] select-none [-webkit-touch-callout:none]">
              <IconEye size={44} />
              <span className="font-display text-xl leading-tight">Tap to start</span>
              <span className="text-[13px] font-bold">Only {name} looks!</span>
            </motion.button>
          ) : (
            <motion.div key={count} role="status" aria-live="assertive"
              initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="flex size-[200px] items-center justify-center rounded-full border-4 border-kajal bg-paper text-kajal shadow-[0_8px_0_#231815]">
              <span className="font-display text-[110px] leading-none">{count || 'GO'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-auto flex flex-col gap-3 px-5 pt-6 pb-6">
        <div className="flex items-center gap-3 rounded-2xl border-[3px] border-kajal bg-kajal px-3.5 py-3 text-kagaz">
          <CookerIcon size={34} />
          <div>
            <div className="text-base font-extrabold">{TEAM_INFO[rival(team.id)].name}: you’re on seeti duty!</div>
            <div className="text-[13px] font-semibold text-[#E6D9C2]">Hear a brain-fart word or a card word? Shout SEETI.</div>
          </div>
        </div>
        {active.length > 0 && (
          <div className="rounded-2xl border-[3px] border-dashed border-kajal bg-paper p-3 text-kajal">
            <div className="text-sm font-extrabold">{name} must follow:</div>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {active.map((c) => {
                const off = team.jugaadOff === c.id
                return (
                  <li key={c.id} className="flex items-center gap-2">
                    <span className={`flex-1 text-[15px] font-bold ${off ? 'line-through opacity-50' : ''}`}>
                      <span className="mr-1.5 rounded px-1.5 py-0.5 text-[11px] font-extrabold" style={{ background: KIND_META[c.kind].color, color: KIND_META[c.kind].ink }}>{KIND_META[c.kind].label}</span>
                      {c.title}
                    </span>
                    {game.settings.twists.jugaad && (team.jugaadLeft > 0 || off) && (
                      <button type="button" disabled={count !== null} onClick={() => { sfx.tap(); useJugaad(off ? null : c.id) }}
                        className={`flex min-h-10 items-center gap-1 rounded-lg border-2 border-kajal px-2.5 text-[13px] font-extrabold ${off ? 'bg-paper' : 'bg-haldi'}`}>
                        <IconBolt size={14} />{off ? 'Undo' : 'Jugaad'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
            {game.settings.twists.jugaad && team.jugaadLeft > 0 && <p className="mt-1.5 text-xs font-semibold text-muted">Jugaad: switch one rule off for this turn only. Once per game.</p>}
          </div>
        )}
        {active.length === 0 && team.planted.length > 0 && (
          <p className="text-center text-sm font-bold">A secret Pabandi waits at your next Toll Naka…</p>
        )}
      </div>
    </Screen>
  )
}

// ---------- The live turn ----------

function useNow(running: boolean) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => force((x) => x + 1), 100)
    return () => clearInterval(id)
  }, [running])
  return Date.now()
}

export function Turn() {
  const { game, correct, slip, skip, undo, timeUp, pause, resume } = useGame()
  const turn = game.turn!
  const running = turn.runningSince !== null
  const now = useNow(running)
  const left = remainingMs(turn, now)
  const secs = Math.ceil(left / 1000)
  const lastSec = useRef(secs)
  const team = game.teams[turn.team]
  const info = TEAM_INFO[turn.team]
  const total = game.settings.turnSeconds * 1000
  const gained = turnTotals(turn).team
  const nextToll = tollStops(game.settings).find((t, i) => t > team.position && i < team.planted.length)
  const rules = activePabandi(team)
  const [menu, setMenu] = useState(false)
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    if (!running) return
    if (secs !== lastSec.current && secs <= 10 && secs > 0) sfx.tick(secs <= 3)
    lastSec.current = secs
    if (left <= 0) timeUp()
  }, [secs, left, running, timeUp])

  const [a, b, c] = turn.pair.words
  return (
    <Screen>
      <div className={`flex h-[92px] items-center gap-3 border-b-[3px] border-kajal pr-3 pl-5 ${info.bg} ${info.text}`}>
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl leading-tight">{info.name}</div>
          <div className="truncate text-sm font-bold">Describer: {playerName(game, turn.describerId)}</div>
        </div>
        <div role="timer" aria-label={`${secs} seconds left`}
          className={`flex items-center gap-1.5 rounded-2xl border-[3px] border-kajal bg-paper py-1 pr-2.5 pl-1.5 text-kajal ${secs <= 10 && running ? 'animate-pulse' : ''}`}>
          <ChaiGlass level={left / total} />
          <span className={`w-[58px] font-display text-[26px] ${secs <= 10 ? 'text-sindoor' : ''}`}>0:{String(secs).padStart(2, '0')}</span>
        </div>
        <button type="button" aria-label="Menu" onClick={() => { sfx.tap(); pause(); setMenu(true) }}
          className="flex size-11 items-center justify-center rounded-xl border-[3px] border-kajal bg-paper text-kajal"><IconMenu /></button>
      </div>

      <div className="flex items-center justify-between px-5 pt-4">
        <Chip className="bg-haldi font-display !text-[15px]">This turn: +{gained}</Chip>
        <span className="text-sm font-extrabold">Stop {team.position}{nextToll ? ` · toll at ${nextToll}` : ` · Goa at ${finishLine(game.settings)}`}</span>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6 py-3">
        <AnimatePresence mode="popLayout">
          <motion.div key={turn.pair.words.join('|')} initial={{ x: 220, opacity: 0, rotate: 8 }} animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -260, opacity: 0, rotate: -10 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="flex flex-col items-stretch">
            {turn.pair.dhamaka && (
              <span className="mx-auto mb-7 -rotate-2 rounded-lg border-[3px] border-kajal bg-rani px-3 py-1 font-display text-sm">Dhamaka! Three words · +2</span>
            )}
            <WordCard label="A · Kaisa?" sub="describing word" word={a} tone="haldi" tilt={-1.5} compact={!!c} />
            {c && <><Plus compact /><WordCard label="A2 · Kaisa?" sub="describing word" word={b} tone="haldi" tilt={1} compact /></>}
            <Plus compact={!!c} />
            <WordCard label="B · Kya?" sub="thing" word={c ?? b} tone="peacock" tilt={1.2} compact={!!c} />
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-center text-sm font-bold text-muted">{c ? 'Clue all three in order. Team must say them in order.' : 'Clue A, then B. Team must say both words, in order.'}</p>
      </div>

      <button type="button" onClick={() => { sfx.tap(); setSheet(true) }} aria-label="View all rules for this turn"
        className="mx-5 mb-3 flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-kajal/50 px-2 py-1.5 text-left">
        <span className="text-[13px] font-extrabold">Banned:</span>
        <span className="rounded-full border-2 border-kajal bg-kajal px-2.5 py-0.5 text-xs font-bold text-kagaz">umm & fillers</span>
        <span className="rounded-full border-2 border-kajal bg-kajal px-2.5 py-0.5 text-xs font-bold text-kagaz">card words</span>
        {rules.map((r) => (
          <span key={r.id} className="rounded-full border-2 border-kajal px-2.5 py-0.5 text-xs font-bold" style={{ background: KIND_META[r.kind].color, color: KIND_META[r.kind].ink }}>{r.title}</span>
        ))}
        <span className="ml-auto text-xs font-extrabold text-peacock underline underline-offset-2">{rules.length ? 'See rules' : 'Pabandi'}</span>
      </button>

      <div className="flex gap-3.5 px-5">
        <button type="button" onClick={correct} disabled={!running}
          className="pop flex h-[120px] flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl border-[3px] border-kajal bg-peacock text-kagaz disabled:opacity-60">
          <span className="flex size-11 items-center justify-center rounded-full border-[3px] border-kajal bg-kagaz text-peacock"><IconCheck size={26} /></span>
          <span className="font-display text-[22px] leading-tight">Got it!</span>
          <span className="text-[13px] font-bold">Sahi! +{turn.pair.dhamaka ? 2 : 1}</span>
        </button>
        <button type="button" onClick={slip} disabled={!running}
          className="pop flex h-[120px] flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl border-[3px] border-kajal bg-sindoor text-kagaz disabled:opacity-60">
          <CookerIcon size={50} />
          <span className="font-display text-[22px] leading-tight">SEETI!</span>
          <span className="text-[13px] font-bold">Slip · {TEAM_INFO[rival(turn.team)].name.replace('Team ', '')} +1</span>
        </button>
      </div>
      <div className="flex gap-2.5 px-5 pt-3.5 pb-[max(18px,env(safe-area-inset-bottom))]">
        <SmallBtn onClick={skip} disabled={!running}><IconSkip size={18} /> Skip</SmallBtn>
        <SmallBtn onClick={running ? pause : resume} tone={running ? 'paper' : 'haldi'}>
          {running ? <><IconPause size={18} /> Pause</> : <><IconPlay size={16} /> Resume</>}
        </SmallBtn>
        <SmallBtn onClick={undo} disabled={game.history.length === 0}><IconUndo size={18} /> Undo</SmallBtn>
      </div>
      <AnimatePresence>{menu && <Menu onClose={() => setMenu(false)} />}</AnimatePresence>
      <AnimatePresence>{sheet && <PabandiSheet initial={turn.team} onClose={() => setSheet(false)} />}</AnimatePresence>
    </Screen>
  )
}

function WordCard({ label, sub, word, tone, tilt, compact = false }: {
  label: string; sub: string; word: string; tone: 'haldi' | 'peacock'; tilt: number; compact?: boolean
}) {
  const size = compact ? (word.length > 12 ? 'text-[28px]' : 'text-[34px]') : word.length > 12 ? 'text-[38px]' : 'text-[48px]'
  return (
    <div className={`relative rounded-[22px] border-[3px] border-kajal bg-paper px-4 text-center shadow-[5px_6px_0_#231815] ${compact ? 'pt-6 pb-3' : 'pt-8 pb-5'}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <span className={`absolute -top-4 ${tone === 'haldi' ? 'left-4 bg-haldi' : 'right-4 bg-peacock text-kagaz'} rounded-lg border-[2.5px] border-kajal px-3 py-0.5 font-display text-[15px]`}>
        {label}{!compact && <span className="font-body text-xs font-bold"> · {sub}</span>}
      </span>
      <div className={`font-extrabold leading-none break-words ${size}`}>{word}</div>
    </div>
  )
}

const Plus = ({ compact = false }: { compact?: boolean }) => (
  <span className={`relative z-10 mx-auto flex items-center justify-center rounded-full border-[3px] border-kajal bg-sindoor font-display text-kagaz ${compact ? '-my-1.5 size-9 text-xl' : '-my-2 size-11 text-2xl'}`}>+</span>
)

function SmallBtn({ children, onClick, disabled, tone = 'paper' }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; tone?: 'paper' | 'haldi' }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-[14px] border-[2.5px] border-kajal text-base font-extrabold disabled:opacity-40 ${tone === 'haldi' ? 'bg-haldi' : 'bg-paper'}`}>
      {children}
    </button>
  )
}

// ---------- SEETI! ----------

const REASONS: { id: SlipReason; label: string }[] = [
  { id: 'filler', label: 'Brain-fart word' },
  { id: 'cardWord', label: 'Said a card word' },
  { id: 'pabandi', label: 'Broke a Pabandi' },
]

export function Seeti() {
  const { game, setSlipReason, closeOverlay, galatSeeti } = useGame()
  const slip = game.lastSlip!
  const turn = game.turn!
  const victim = TEAM_INFO[turn.team]
  const gainer = TEAM_INFO[rival(turn.team)]
  return (
    <Screen className="bg-sindoor text-kagaz" dots={false}>
      <div className="rays" style={{ background: 'repeating-conic-gradient(#C8242B 0 10deg, #B21E25 10deg 20deg)' }} />
      <div className="halftone-strong pointer-events-none absolute inset-0" />
      <motion.div className="relative mx-auto mt-6 w-[250px]" initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
        <motion.div animate={{ x: [-3, 3, -3] }} transition={{ duration: 0.12, repeat: 10 }}>
          <CookerMascot className="w-full" />
        </motion.div>
      </motion.div>
      <div className="relative flex flex-col items-center text-center">
        <motion.h1 initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
          className="outline-text -rotate-[4deg] font-display text-[76px] leading-[0.95] text-haldi">SEETI!!</motion.h1>
        <span className="mt-1.5 text-xl font-extrabold">Caught you! <span className="font-deva font-normal">अटक गए!</span></span>
      </div>

      <div className="relative mt-5 flex flex-col gap-2 px-5">
        <span className="text-center text-[15px] font-extrabold">What happened?</span>
        <div className="flex gap-2">
          {REASONS.map((r) => (
            <button key={r.id} type="button" aria-pressed={slip.reason === r.id} onClick={() => { sfx.tap(); setSlipReason(r.id) }}
              className={`min-h-[52px] flex-1 rounded-[14px] border-[2.5px] border-kajal px-1.5 text-sm leading-tight font-extrabold text-kajal shadow-[0_4px_0_#231815] ${slip.reason === r.id ? 'bg-haldi' : 'bg-paper'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-5 mt-4 flex items-center gap-3.5 rounded-[18px] border-[3px] border-kajal bg-paper px-4 py-3.5 text-kajal card-shadow">
        <span className={`flex size-[52px] shrink-0 items-center justify-center rounded-full border-[3px] border-kajal ${gainer.bg}`}><TeamEmblem team={rival(turn.team)} size={32} /></span>
        <div>
          <div className="font-display text-xl leading-tight">{gainer.name.replace('Team ', '')} +1</div>
          <div className="text-sm font-bold">Stop {slip.rivalFrom} → {slip.rivalTo} · pair discarded, keep going</div>
          {slip.ghatBack && <div className="mt-1 text-sm font-extrabold text-sindoor">Ghat Section! {victim.name} slides back one stop.</div>}
        </div>
      </div>

      <div className="relative mt-auto flex gap-3 px-5 pt-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        <button type="button" onClick={galatSeeti}
          className="flex min-h-[62px] w-[136px] flex-col items-center justify-center rounded-[18px] border-[3px] border-kajal bg-kajal text-[15px] leading-tight font-extrabold text-kagaz">
          Wrong call?<span className="text-[13px] font-semibold">Undo{game.settings.twists.galatSeeti ? ` · ${victim.name.replace('Team ', '')} +1` : ''}</span>
        </button>
        <Btn big className="flex-1" onClick={closeOverlay}>Next pair <IconArrow /></Btn>
      </div>
    </Screen>
  )
}

// ---------- Toll Naka ----------

export function Toll() {
  const { game, closeOverlay } = useGame()
  const reveal = game.tolls[0]
  const card = cardById(reveal.cardId)
  const team = game.teams[reveal.team]
  const info = TEAM_INFO[reveal.team]
  const all = team.planted.slice(0, team.revealed).map(cardById)
  const meta = KIND_META[card.kind]
  return (
    <Screen className="bg-peacock text-kagaz" dots={false}>
      <div className="halftone-strong pointer-events-none absolute inset-0" />
      <motion.div className="relative" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><TollBooth /></motion.div>
      <div className="relative -mt-2 flex flex-col items-center text-center">
        <h1 className="outline-text font-display text-[34px] leading-none text-haldi [-webkit-text-stroke-width:2.5px]">Toll Naka #{reveal.toll}</h1>
        <span className="mt-1 text-base font-bold">{info.name} pays the toll</span>
      </div>

      <motion.div className="relative mx-auto mt-4 w-[272px]"
        initial={{ scale: 2.2, rotate: 18, opacity: 0 }} animate={{ scale: 1, rotate: -3, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 16 }}>
        <Stamp card={card} size="lg" />
        <div className="absolute -right-7 -bottom-5 flex size-[92px] rotate-[14deg] flex-col items-center justify-center rounded-full border-[3px] border-dashed border-kajal bg-sindoor/95 text-center text-paper">
          <span className="text-[11px] leading-tight font-extrabold">Dealt by</span>
          <span className="font-display text-sm leading-tight">Kismat</span>
        </div>
      </motion.div>

      <div className="relative mt-7 flex flex-col gap-2 px-5 text-center">
        <span className="text-base font-extrabold">From now until Goa, every {info.name.replace('Team ', '')} Describer follows:</span>
        <div className="flex flex-wrap justify-center gap-2">
          {all.map((c) => (
            <span key={c.id} className="rounded-full border-[2.5px] border-kajal px-3 py-0.5 text-sm font-extrabold" style={{ background: KIND_META[c.kind].color, color: KIND_META[c.kind].ink }}>{c.title}</span>
          ))}
        </div>
        <span className="text-[13px] font-semibold text-[#CFEAE7]">{meta.judgedBy}. The clock is paused.</span>
      </div>
      <div className="relative mt-auto px-5 pt-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        <Btn big className="w-full" onClick={closeOverlay}>Got it, let’s go!</Btn>
      </div>
    </Screen>
  )
}

// ---------- Chori (steal) ----------

export function Steal() {
  const { game, stealResult } = useGame()
  const turn = game.turn!
  const thief = TEAM_INFO[rival(turn.team)]
  return (
    <Screen className="bg-kajal text-kagaz" dots={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
        <span className="-rotate-3 rounded-lg border-[3px] border-paper bg-haldi px-3 py-1 font-display text-kajal">Time’s up!</span>
        <h1 className="outline-text font-display text-[54px] leading-none text-haldi [-webkit-text-stroke-color:#000]">CHORI<br />CHANCE</h1>
        <p className="text-lg font-bold">{thief.name} gets one guess at the last pair:</p>
        <div className="rounded-2xl border-[3px] border-paper bg-paper px-5 py-3 text-[30px] leading-tight font-extrabold text-kajal">{turn.pair.words.join(' + ')}</div>
        <p className="text-base font-semibold text-[#E6D9C2]">One guess, no clues. Did they get both words, in order?</p>
      </div>
      <div className="flex gap-3 px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
        <Btn big tone="paper" className="flex-1" silent onClick={() => stealResult(false)}>No</Btn>
        <Btn big className="flex-[1.4] whitespace-nowrap" silent onClick={() => stealResult(true)}>Stolen! +1</Btn>
      </div>
    </Screen>
  )
}

// ---------- Turn summary ----------

export function Summary() {
  const { game, nextTurn } = useGame()
  const turn = game.turn!
  const info = TEAM_INFO[turn.team]
  const totals = turnTotals(turn)
  const next = rival(turn.team)
  const nextName = playerName(game, describerFor(game.teams[next]))
  const MARK = {
    correct: { m: '✓', bg: 'bg-peacock text-kagaz' }, slip: { m: '!', bg: 'bg-sindoor text-kagaz' }, skip: { m: '»', bg: 'bg-[#D9CBB0]' },
    steal: { m: '$', bg: 'bg-haldi' }, stealMiss: { m: '×', bg: 'bg-[#D9CBB0]' },
  } as const
  const note = (e: (typeof turn.events)[number]) => {
    if (e.kind === 'correct') return `${info.name.replace('Team ', '')} +${e.points}`
    if (e.kind === 'slip') return { filler: 'Seeti · brain-fart', cardWord: 'Seeti · card word', pabandi: 'Seeti · Pabandi' }[e.reason ?? 'filler'] + (e.ghatBack ? ' · slid back' : '')
    if (e.kind === 'skip') return 'Skipped'
    if (e.kind === 'steal') return 'Stolen!'
    return 'Steal missed'
  }
  return (
    <Screen>
      <header className={`flex items-center gap-3.5 border-b-[3px] border-kajal px-5 pt-5 pb-4 ${info.bg} ${info.text}`}>
        <ChaiGlass level={0} size={44} />
        <div>
          <h1 className="font-display text-[26px] leading-tight">Time’s up!</h1>
          <span className="text-[15px] font-bold">{playerName(game, turn.describerId)}’s turn, {info.name}</span>
        </div>
      </header>
      <div className="zigzag h-3.5 border-b-[3px] border-kajal" />
      <section className="flex flex-col gap-3 px-5 py-4">
        <div className="flex gap-2.5">
          <ScoreBox team={turn.team} label={info.name.replace('Team ', '')} value={`+${totals.team}`} sub={totals.back ? `slid back ${totals.back}` : `now at stop ${game.teams[turn.team].position}`} />
          <ScoreBox team={next} label={`${TEAM_INFO[next].name.replace('Team ', '')} (seeti)`} value={`+${totals.rivals}`} sub={`now at stop ${game.teams[next].position}`} />
        </div>
        {turn.events.length === 0 && <p className="rounded-xl border-2 border-dashed border-kajal p-4 text-center font-semibold text-muted">Nothing happened this turn. Ekdum shaant.</p>}
        <ul className="flex flex-col gap-1.5">
          {turn.events.map((e, i) => (
            <li key={i} className="flex min-h-11 items-center gap-2.5 rounded-xl border-2 border-kajal bg-paper px-2.5 py-1">
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-kajal font-display text-[13px] ${MARK[e.kind].bg}`}>{MARK[e.kind].m}</span>
              <span className="flex-1 text-base leading-tight font-extrabold">{e.words.join(' ')}</span>
              <span className="text-right text-[13px] font-bold text-muted">{note(e)}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-auto px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <button type="button" onClick={() => { sfx.tap(); nextTurn() }}
          className="pop flex min-h-[62px] w-full flex-col items-center justify-center rounded-[18px] border-[3px] border-kajal bg-haldi">
          <span className="font-display text-lg leading-tight">Next: {TEAM_INFO[next].name}</span>
          <span className="text-[13px] font-bold">Describer: {nextName} · back to the board</span>
        </button>
      </div>
    </Screen>
  )
}

function ScoreBox({ team, label, value, sub }: { team: TeamId; label: string; value: string; sub: string }) {
  return (
    <div className={`flex-1 rounded-[14px] border-[3px] border-kajal px-3 py-2 shadow-[3px_4px_0_#231815] ${TEAM_INFO[team].bg} ${TEAM_INFO[team].text}`}>
      <div className="text-[13px] font-extrabold">{label}</div>
      <div className="font-display text-2xl leading-tight">{value}</div>
      <div className="text-[13px] font-bold">{sub}</div>
    </div>
  )
}

// ---------- Winner ----------

export function Winner() {
  const { game, rematch, newTeams, quit } = useGame()
  const w = game.winner!
  const info = TEAM_INFO[w]
  const a = awards(game)
  const names = game.teams[w].playerIds.map((id) => playerName(game, id)).join(' · ')
  const list = [
    a.ummKing && a.ummKing.slips > 0 && { stat: `${a.ummKing.slips}×`, title: 'Umm Champion', who: `${a.ummKing.name} · most seetis`, cls: 'bg-sindoor text-kagaz' },
    a.fastest && { stat: `${(a.fastest.bestMs! / 1000).toFixed(1)}s`, title: 'Lightning combo', who: `${a.fastest.name} · fastest pair`, cls: 'bg-peacock text-kagaz' },
    a.bestDescriber && a.bestDescriber.pairs > 0 && { stat: `+${a.bestDescriber.pairs}`, title: 'Best Describer', who: `${a.bestDescriber.name} · most combos`, cls: 'bg-haldi' },
  ].filter(Boolean) as { stat: string; title: string; who: string; cls: string }[]
  return (
    <Screen className="bg-haldi" dots={false}>
      <div className="rays" style={{ background: 'repeating-conic-gradient(#F5B820 0 10deg, #F7C744 10deg 20deg)' }} />
      <div className="halftone pointer-events-none absolute inset-0" />
      <motion.div className="relative" initial={{ y: -90 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}><Garland /></motion.div>
      <div className="relative flex flex-col items-center text-center">
        <span className="font-deva text-[22px]">गोवा पहुँच गए!</span>
        <motion.h1 initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
          className="outline-text font-display text-[44px] leading-[0.98] text-paper">WELCOME<br />TO GOA!</motion.h1>
      </div>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1, rotate: -1.5 }} transition={{ delay: 0.5 }}
        className={`relative mx-6 mt-5 flex items-center gap-3.5 rounded-[22px] border-[3px] border-kajal px-4 py-3.5 shadow-[5px_6px_0_#231815] ${info.bg} ${info.text}`}>
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full border-[3px] border-kajal bg-paper">
          {w === 'nimbu' ? <TeamEmblem team="nimbu" size={54} /> : <TeamEmblem team="mirchi" size={54} />}
        </span>
        <div className="min-w-0">
          <div className="font-display text-2xl leading-tight">{info.name} wins!</div>
          <div className="truncate text-sm font-bold">{names}</div>
          <div className="mt-1 text-sm font-extrabold">
            {TEAM_INFO[rival(w)].name.replace('Team ', '')} got stuck at stop {game.teams[rival(w)].position}
          </div>
        </div>
      </motion.div>
      <section aria-label="Awards" className="relative mt-5 flex flex-col gap-2.5 px-5">
        {list.map((x, i) => (
          <motion.div key={x.title} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 + i * 0.15 }}
            className="flex items-center gap-3 rounded-2xl border-[2.5px] border-kajal bg-paper px-3.5 py-2.5">
            <span className={`flex h-9 min-w-[56px] items-center justify-center rounded-lg border-2 border-kajal px-1.5 font-display text-[15px] ${x.cls}`}>{x.stat}</span>
            <div>
              <div className="text-base leading-tight font-extrabold">{x.title}</div>
              <div className="text-sm font-semibold text-muted">{x.who}</div>
            </div>
          </motion.div>
        ))}
      </section>
      <div className="relative mt-auto flex flex-col gap-3 px-5 pt-6 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          <Btn big tone="paper" className="w-[140px] !text-[15px] whitespace-nowrap" onClick={newTeams}>New teams</Btn>
          <Btn big tone="sindoor" className="flex-1 !text-xl" onClick={rematch}>Rematch!</Btn>
        </div>
        <button type="button" onClick={() => { sfx.tap(); quit() }} className="mx-auto min-h-11 font-bold underline">Back to home</button>
      </div>
    </Screen>
  )
}
