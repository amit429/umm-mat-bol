import { useState } from 'react'
import { motion } from 'motion/react'
import { useGame } from '../game/store'
import { CORE_FILLERS } from '../data/fillers'
import { isMuted, setMuted, sfx } from '../audio/sfx'
import { IconMute, IconSound, IconX } from '../ui/icons'

export function Menu({ onClose }: { onClose: () => void }) {
  const { game, rematch, quit } = useGame()
  const [muted, setM] = useState(isMuted())
  const [confirm, setConfirm] = useState<'restart' | 'quit' | null>(null)
  const fillers = [...CORE_FILLERS, ...game.settings.fillers]

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-kajal/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label="Game menu"
        className="w-full max-w-[480px] rounded-t-[28px] border-[3px] border-b-0 border-kajal bg-kagaz px-5 pt-4 pb-[max(24px,env(safe-area-inset-bottom))]"
        initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Game paused</h2>
          <button type="button" aria-label="Close menu" onClick={() => { sfx.tap(); onClose() }}
            className="flex size-11 items-center justify-center rounded-xl border-[3px] border-kajal bg-paper"><IconX /></button>
        </div>

        <button type="button" onClick={() => { const m = !muted; setMuted(m); setM(m); if (!m) sfx.sahi() }}
          className="mt-4 flex min-h-14 w-full items-center gap-3 rounded-2xl border-[2.5px] border-kajal bg-paper px-4 text-left text-base font-extrabold">
          {muted ? <IconMute /> : <IconSound />} Sound {muted ? 'off' : 'on'}
          <span className="ml-auto text-sm font-semibold text-muted">Tap to {muted ? 'turn on' : 'mute'}</span>
        </button>

        <div className="mt-3 rounded-2xl border-[2.5px] border-kajal bg-paper p-3.5">
          <div className="text-sm font-extrabold">Brain-fart words this game ({fillers.length})</div>
          <div className="mt-1.5 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
            {fillers.map((w) => <span key={w} className="rounded-full bg-kajal px-2.5 py-0.5 text-[13px] font-bold text-kagaz">{w}</span>)}
          </div>
        </div>

        {confirm ? (
          <div className="mt-3 rounded-2xl border-[3px] border-kajal bg-blush p-3.5">
            <p className="font-extrabold">{confirm === 'restart' ? 'Restart with the same teams? Scores reset.' : 'Quit to home? This game ends.'}</p>
            <div className="mt-2.5 flex gap-2.5">
              <button type="button" onClick={() => setConfirm(null)} className="min-h-12 flex-1 rounded-xl border-[2.5px] border-kajal bg-paper font-extrabold">Cancel</button>
              <button type="button" onClick={() => { sfx.tap(); onClose(); if (confirm === 'restart') rematch(); else quit() }}
                className="min-h-12 flex-1 rounded-xl border-[2.5px] border-kajal bg-sindoor font-extrabold text-kagaz">Yes, {confirm}</button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex gap-2.5">
            <button type="button" onClick={() => setConfirm('restart')} className="min-h-12 flex-1 rounded-xl border-[2.5px] border-kajal bg-paper font-extrabold">Restart game</button>
            <button type="button" onClick={() => setConfirm('quit')} className="min-h-12 flex-1 rounded-xl border-[2.5px] border-kajal bg-paper font-extrabold">Quit to home</button>
          </div>
        )}
        <button type="button" onClick={() => { sfx.tap(); onClose() }}
          className="pop mt-4 flex min-h-[56px] w-full items-center justify-center rounded-[18px] border-[3px] border-kajal bg-haldi font-display text-lg">Back to the game</button>
      </motion.div>
    </motion.div>
  )
}
