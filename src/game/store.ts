import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as E from './engine'
import { sfx } from '../audio/sfx'

const rng: E.Rng = Math.random
const now = () => Date.now()

// In a noisy room people double-tap. Ignore a second scoring tap within 400 ms.
let lastScoreTap = 0
const debounced = (fn: () => void) => () => {
  const t = Date.now()
  if (t - lastScoreTap < 400) return
  lastScoreTap = t
  fn()
}
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

interface Store {
  game: E.Game
  set: (fn: (g: E.Game) => E.Game) => void
  go: (phase: E.Phase) => void
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  splitTeams: () => void
  movePlayer: (id: string) => void
  updateSettings: (patch: Partial<E.Settings>) => void
  startSetupPlay: () => void
  beginTurn: () => void
  useJugaad: (cardId: string | null) => void
  startTurn: () => void
  correct: () => void
  skip: () => void
  slip: () => void
  setSlipReason: (r: E.SlipReason) => void
  closeOverlay: () => void
  galatSeeti: () => void
  undo: () => void
  timeUp: () => void
  stealResult: (stolen: boolean) => void
  nextTurn: () => void
  pause: () => void
  resume: () => void
  rematch: () => void
  newTeams: () => void
  quit: () => void
}

/** Play the right sound for whatever just happened. */
function soundFor(prev: E.Game, next: E.Game) {
  if (next.phase === 'winner' && prev.phase !== 'winner') return sfx.win()
  if (next.phase === 'toll' && prev.phase !== 'toll') return sfx.toll()
  if (next.phase === 'toll' && next.tolls.length < prev.tolls.length) return sfx.toll()
}

export const useGame = create<Store>()(
  persist(
    (setState, get) => {
      const apply = (fn: (g: E.Game) => E.Game) => {
        const prev = get().game
        const next = fn(prev)
        if (next !== prev) {
          setState({ game: next })
          soundFor(prev, next)
        }
      }
      return {
        game: E.newGame(),
        set: apply,
        go: (phase) => apply((g) => E.goTo(g, phase)),
        addPlayer: (name) => apply((g) => E.addPlayer(g, name, uid())),
        removePlayer: (id) => apply((g) => E.removePlayer(g, id)),
        splitTeams: () => apply((g) => E.splitTeams(g, rng)),
        movePlayer: (id) => apply((g) => E.movePlayer(g, id)),
        updateSettings: (patch) => apply((g) => E.updateSettings(g, patch)),
        startSetupPlay: () => apply((g) => E.startSetupPlay(g, rng)),
        beginTurn: () => apply(E.beginTurn),
        useJugaad: (cardId) => apply((g) => E.useJugaad(g, cardId)),
        startTurn: () => { sfx.go(); apply((g) => E.startTurn(g, now(), rng)) },
        correct: debounced(() => {
          const before = get().game
          apply((g) => E.correct(g, now(), rng))
          if (get().game.phase === 'turn' && get().game !== before) sfx.sahi()
        }),
        skip: debounced(() => { sfx.skip(); apply((g) => E.skip(g, now(), rng)) }),
        slip: debounced(() => { sfx.seeti(); apply((g) => E.slip(g, now(), 'filler', rng)) }),
        setSlipReason: (r) => apply((g) => E.setSlipReason(g, r)),
        closeOverlay: () => apply((g) => E.closeOverlay(g, now())),
        galatSeeti: () => { sfx.undo(); apply((g) => E.galatSeeti(g, now())) },
        undo: () => { sfx.undo(); apply(E.undo) },
        timeUp: () => { sfx.timeUp(); apply((g) => E.timeUp(g, now())) },
        stealResult: (stolen) => { if (stolen) sfx.seeti(); else sfx.tap(); apply((g) => E.stealResult(g, now(), stolen)) },
        nextTurn: () => apply(E.nextTurn),
        pause: () => apply((g) => g.turn && g.turn.runningSince !== null
          ? { ...g, turn: { ...g.turn, remainingMs: E.remainingMs(g.turn, now()), runningSince: null } }
          : g),
        resume: () => apply((g) => g.turn && g.turn.runningSince === null && g.phase === 'turn'
          ? { ...g, turn: { ...g.turn, runningSince: now() } }
          : g),
        rematch: () => apply((g) => E.rematch(g, rng)),
        newTeams: () => apply((g) => ({ ...E.splitTeams(g, rng), phase: 'teams', winner: null, turn: null })),
        quit: () => apply((g) => ({ ...E.newGame(), players: g.players, settings: g.settings })),
      }
    },
    {
      name: 'umm-mat-bol-game',
      version: 1,
      partialize: (s) => ({ game: { ...s.game, history: [] } }),
      // A reload mid-turn comes back with the clock paused.
      merge: (persisted, current) => {
        if (import.meta.env.DEV) (window as unknown as { umb: unknown }).umb = { get: () => useGame.getState(), engine: E }
        const saved = (persisted as { game?: E.Game & { draft?: unknown } } | undefined)?.game
        if (!saved) return current
        // Games saved before the random Pabandi deal may be parked on the old draft screen.
        const { draft: _old, ...g } = saved
        if ((g.phase as string) === 'draft') return { ...current, game: { ...E.newGame(), players: g.players, settings: g.settings, teams: g.teams, phase: 'fillers' } }
        const turn = g.turn && g.turn.runningSince !== null
          ? { ...g.turn, remainingMs: E.remainingMs(g.turn, Date.now()), runningSince: null }
          : g.turn
        return { ...current, game: { ...g, turn } }
      },
    },
  ),
)
