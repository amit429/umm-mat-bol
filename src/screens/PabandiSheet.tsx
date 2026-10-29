import { useState } from 'react'
import { motion } from 'motion/react'
import { useGame } from '../game/store'
import { cardById, tollStops, type TeamId } from '../game/engine'
import { Stamp } from '../ui/kit'
import { TeamEmblem } from '../ui/art'
import { IconLock, IconX } from '../ui/icons'
import { sfx } from '../audio/sfx'
import { TEAM_INFO } from './Setup'

/** Every Pabandi a team has unlocked, with full rules, plus the ones still waiting at Toll Nakas. */
export function TeamPabandiList({ team: id }: { team: TeamId }) {
  const game = useGame((s) => s.game)
  const team = game.teams[id]
  const stops = tollStops(game.settings)
  const revealed = team.planted.slice(0, team.revealed).map(cardById)
  const locked = team.planted.slice(team.revealed).map((_, i) => team.revealed + i)

  if (team.planted.length === 0) {
    return <p className="rounded-xl border-2 border-dashed border-kajal p-4 text-center font-semibold text-muted">No Pabandi cards this game.</p>
  }
  return (
    <div className="flex flex-col gap-3">
      {revealed.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-kajal bg-paper p-3 text-center text-[15px] font-semibold">
          Nothing unlocked yet. Reach a Toll Naka to find out.
        </p>
      )}
      {revealed.map((c, i) => (
        <div key={c.id} className="relative">
          <Stamp card={c} size="wide" className={team.jugaadOff === c.id ? 'opacity-50' : ''} />
          <span className="absolute -top-2 -left-1 -rotate-6 rounded-md border-2 border-kajal bg-haldi px-1.5 font-display text-[11px]">Toll {i + 1}</span>
          {team.jugaadOff === c.id && (
            <span className="absolute -top-2 -right-1 rotate-3 rounded-md border-2 border-kajal bg-kajal px-1.5 text-xs font-extrabold text-kagaz">Off this turn · Jugaad</span>
          )}
        </div>
      ))}
      {locked.map((i) => (
        <div key={i} className="flex min-h-14 items-center gap-3 rounded-xl border-[2.5px] border-dashed border-kajal bg-paper/70 px-3.5 text-[15px] font-bold text-muted">
          <IconLock size={20} />
          <span>Toll {i + 1} · unlocks at stop {stops[i]}</span>
        </div>
      ))}
    </div>
  )
}

/** Bottom sheet with a tab per team. */
export function PabandiSheet({ initial, onClose }: { initial: TeamId; onClose: () => void }) {
  const game = useGame((s) => s.game)
  const [tab, setTab] = useState<TeamId>(initial)
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-kajal/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label="Pabandi cards in play"
        className="flex max-h-[88dvh] w-full max-w-[480px] flex-col rounded-t-[28px] border-[3px] border-b-0 border-kajal bg-kagaz"
        initial={{ y: 500 }} animate={{ y: 0 }} exit={{ y: 500 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="font-display text-xl">Pabandi in play</h2>
          <button type="button" aria-label="Close" onClick={() => { sfx.tap(); onClose() }}
            className="flex size-11 items-center justify-center rounded-xl border-[3px] border-kajal bg-paper"><IconX /></button>
        </div>
        <div role="tablist" aria-label="Team" className="mx-5 mt-3 flex gap-1 rounded-[14px] border-[2.5px] border-kajal bg-paper p-1">
          {(['mirchi', 'nimbu'] as TeamId[]).map((t) => {
            const on = tab === t
            const n = game.teams[t].revealed
            return (
              <button key={t} type="button" role="tab" aria-selected={on} onClick={() => { sfx.tap(); setTab(t) }}
                className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-base font-extrabold ${on ? `${TEAM_INFO[t].bg} ${TEAM_INFO[t].text}` : ''}`}>
                <TeamEmblem team={t} size={22} /> {TEAM_INFO[t].name.replace('Team ', '')} · {n}
              </button>
            )
          })}
        </div>
        <p className="px-5 pt-2 text-[13px] font-semibold text-muted">Every {TEAM_INFO[tab].name.replace('Team ', '')} Describer must follow these, on top of no fillers and no card words.</p>
        <div className="overflow-y-auto px-5 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <TeamPabandiList team={tab} />
        </div>
      </motion.div>
    </motion.div>
  )
}
