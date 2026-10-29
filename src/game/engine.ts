// Umm Mat Bol! rules engine. Pure functions: every action takes a Game and returns a new one.
// Time and randomness come in as arguments so the rules stay testable.

import { KAISA, KYA, FAMILY_UNSAFE, type PackId } from '../data/words'
import { PABANDI, SPEECH_KINDS, PHYSICAL_KINDS, type PabandiCard } from '../data/pabandi'
import { DEFAULT_FILLERS } from '../data/fillers'

export type TeamId = 'mirchi' | 'nimbu'
export const TEAM_IDS: TeamId[] = ['mirchi', 'nimbu']
export const rival = (t: TeamId): TeamId => (t === 'mirchi' ? 'nimbu' : 'mirchi')

export type Rng = () => number
export type SlipReason = 'filler' | 'cardWord' | 'pabandi'

export interface Player { id: string; name: string }

export interface Twists {
  ghat: boolean
  chori: boolean
  jugaad: boolean
  dhamaka: boolean
  galatSeeti: boolean
}

export interface Settings {
  turnSeconds: 30 | 45 | 60
  trackLength: 12 | 18
  pabandiPerTeam: 0 | 1 | 2 | 3
  packs: PackId[]
  familySafe: boolean
  twists: Twists
  fillers: string[]
}

export interface Team {
  id: TeamId
  playerIds: string[]
  position: number
  nextDescriber: number
  /** Pabandi card ids planted by the rivals, in toll order. */
  planted: string[]
  revealed: number
  jugaadLeft: number
  /** Card switched off by Jugaad for the current turn only. */
  jugaadOff: string | null
}

export interface Pair { words: string[]; dhamaka: boolean }

export interface TurnEvent {
  kind: 'correct' | 'slip' | 'skip' | 'steal' | 'stealMiss'
  words: string[]
  points: number
  reason?: SlipReason
  ghatBack?: boolean
}

export interface Turn {
  team: TeamId
  describerId: string
  pair: Pair
  events: TurnEvent[]
  remainingMs: number
  /** Timestamp when the clock last started; null while paused. */
  runningSince: number | null
  /** Clock reading when the current pair appeared, for the fastest-combo award. */
  pairShownAt: number
}

export interface Draft { picker: TeamId; offers: string[]; picks: string[]; redealt: boolean }

export interface TollReveal { team: TeamId; cardId: string; toll: number }

export interface PlayerStats { slips: number; pairs: number; bestMs: number | null }

export type Phase =
  | 'home' | 'rules' | 'players' | 'teams' | 'settings' | 'fillers' | 'draft'
  | 'board' | 'pass' | 'turn' | 'seeti' | 'toll' | 'steal' | 'summary' | 'winner'

export interface Game {
  phase: Phase
  players: Player[]
  settings: Settings
  teams: Record<TeamId, Team>
  currentTeam: TeamId
  round: number
  draft: Draft | null
  turn: Turn | null
  decks: { a: string[]; b: string[]; ai: number; bi: number }
  tolls: TollReveal[]
  /** Where play goes after the seeti or toll overlay closes. */
  overlayReturn: 'turn' | 'summary'
  lastSlip: { reason: SlipReason; ghatBack: boolean; rivalFrom: number; rivalTo: number } | null
  winner: TeamId | null
  stats: Record<string, PlayerStats>
  history: Omit<Game, 'history'>[]
}

export const DEFAULT_SETTINGS: Settings = {
  turnSeconds: 45,
  trackLength: 18,
  pabandiPerTeam: 3,
  packs: ['classic', 'desi'],
  familySafe: false,
  twists: { ghat: true, chori: true, jugaad: true, dhamaka: true, galatSeeti: false },
  fillers: DEFAULT_FILLERS,
}

const emptyTeam = (id: TeamId): Team => ({
  id, playerIds: [], position: 0, nextDescriber: 0, planted: [], revealed: 0, jugaadLeft: 1, jugaadOff: null,
})

export function newGame(): Game {
  return {
    phase: 'home',
    players: [],
    settings: DEFAULT_SETTINGS,
    teams: { mirchi: emptyTeam('mirchi'), nimbu: emptyTeam('nimbu') },
    currentTeam: 'mirchi',
    round: 1,
    draft: null,
    turn: null,
    decks: { a: [], b: [], ai: 0, bi: 0 },
    tolls: [],
    overlayReturn: 'turn',
    lastSlip: null,
    winner: null,
    stats: {},
    history: [],
  }
}

// ---------- Board geometry ----------

export const finishLine = (s: Settings) => s.trackLength + 1
export const tollStops = (s: Settings): number[] => (s.trackLength === 18 ? [5, 10, 15] : [3, 6, 9])
export const inGhat = (s: Settings, pos: number) => s.twists.ghat && pos >= s.trackLength - 2 && pos <= s.trackLength

// ---------- Helpers ----------

export function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export const cardById = (id: string): PabandiCard => {
  const card = PABANDI.find((c) => c.id === id)
  if (!card) throw new Error(`Unknown Pabandi card ${id}`)
  return card
}

export const playerName = (g: Game, id: string) => g.players.find((p) => p.id === id)?.name ?? '?'

export function remainingMs(turn: Turn, now: number): number {
  const ran = turn.runningSince === null ? 0 : now - turn.runningSince
  return Math.max(0, turn.remainingMs - ran)
}

/** Pabandis currently in force on a team (revealed, minus any switched off by Jugaad). */
export const activePabandi = (team: Team): PabandiCard[] =>
  team.planted.slice(0, team.revealed).filter((id) => id !== team.jugaadOff).map(cardById)

export const describerFor = (team: Team): string => team.playerIds[team.nextDescriber % team.playerIds.length]

function snapshot(g: Game): Game {
  const { history, ...rest } = g
  return { ...g, history: [...history.slice(-29), rest] }
}

function pause(turn: Turn, now: number): Turn {
  if (turn.runningSince === null) return turn
  return { ...turn, remainingMs: remainingMs(turn, now), runningSince: null }
}

function play(turn: Turn, now: number): Turn {
  return turn.runningSince === null ? { ...turn, runningSince: now } : turn
}

const bumpStat = (g: Game, id: string, patch: (s: PlayerStats) => PlayerStats): Game => ({
  ...g,
  stats: { ...g.stats, [id]: patch(g.stats[id] ?? { slips: 0, pairs: 0, bestMs: null }) },
})

// ---------- Setup ----------

export const goTo = (g: Game, phase: Phase): Game => ({ ...g, phase })

export function addPlayer(g: Game, name: string, id: string): Game {
  const clean = name.trim().replace(/\s+/g, ' ').slice(0, 16)
  if (!clean || g.players.length >= 10) return g
  if (g.players.some((p) => p.name.toLowerCase() === clean.toLowerCase())) return g
  return { ...g, players: [...g.players, { id, name: clean }] }
}

export const removePlayer = (g: Game, id: string): Game => ({ ...g, players: g.players.filter((p) => p.id !== id) })

export function splitTeams(g: Game, rng: Rng): Game {
  const ids = shuffle(g.players.map((p) => p.id), rng)
  return {
    ...g,
    teams: {
      mirchi: { ...g.teams.mirchi, playerIds: ids.filter((_, i) => i % 2 === 0) },
      nimbu: { ...g.teams.nimbu, playerIds: ids.filter((_, i) => i % 2 === 1) },
    },
  }
}

export function movePlayer(g: Game, id: string): Game {
  const from: TeamId = g.teams.mirchi.playerIds.includes(id) ? 'mirchi' : 'nimbu'
  const to = rival(from)
  if (g.teams[from].playerIds.length <= 2) return g
  return {
    ...g,
    teams: {
      ...g.teams,
      [from]: { ...g.teams[from], playerIds: g.teams[from].playerIds.filter((p) => p !== id) },
      [to]: { ...g.teams[to], playerIds: [...g.teams[to].playerIds, id] },
    } as Record<TeamId, Team>,
  }
}

export const updateSettings = (g: Game, patch: Partial<Settings>): Game => ({ ...g, settings: { ...g.settings, ...patch } })

// ---------- Decks ----------

export function buildDecks(s: Settings, rng: Rng): Game['decks'] {
  const pick = (src: Record<PackId, string[]>) => {
    const words = new Set(s.packs.flatMap((p) => src[p]))
    if (s.familySafe) FAMILY_UNSAFE.forEach((w) => words.delete(w))
    return shuffle([...words], rng)
  }
  return { a: pick(KAISA), b: pick(KYA), ai: 0, bi: 0 }
}

const clash = (x: string, y: string) => {
  const a = x.toLowerCase(), b = y.toLowerCase()
  return a.includes(b) || b.includes(a)
}

function drawPair(g: Game, rng: Rng): Game {
  let { a, b, ai, bi } = g.decks
  const nextA = () => {
    if (ai >= a.length) { a = shuffle(a, rng); ai = 0 }
    return a[ai++]
  }
  const nextB = () => {
    if (bi >= b.length) { b = shuffle(b, rng); bi = 0 }
    return b[bi++]
  }
  const dhamaka = g.settings.twists.dhamaka && rng() < 1 / 12
  const first = nextA()
  let second = dhamaka ? nextA() : ''
  while (dhamaka && clash(first, second)) second = nextA()
  let thing = nextB()
  while (clash(first, thing) || (second && clash(second, thing))) thing = nextB()
  const words = dhamaka ? [first, second, thing] : [first, thing]
  const turn = g.turn ? { ...g.turn, pair: { words, dhamaka } } : g.turn
  return { ...g, decks: { a, b, ai, bi }, turn }
}

// ---------- Pabandi draft ----------

export function dealOffers(rng: Rng, count = 6): string[] {
  const pool = shuffle(PABANDI, rng)
  const speech = pool.filter((c) => SPEECH_KINDS.includes(c.kind))
  const firstLetter = speech.find((c) => c.kind === 'letter')
  const picked: PabandiCard[] = speech.filter((c) => c.kind !== 'letter' || c === firstLetter).slice(0, 2)
  for (const c of pool) {
    if (picked.length >= count) break
    if (picked.includes(c)) continue
    const physical = picked.filter((p) => PHYSICAL_KINDS.includes(p.kind)).length
    if (PHYSICAL_KINDS.includes(c.kind) && physical >= 2) continue
    if (c.kind === 'letter' && picked.some((p) => p.kind === 'letter')) continue
    if (c.kind === 'voice' && picked.filter((p) => p.kind === 'voice').length >= 2) continue
    picked.push(c)
  }
  return shuffle(picked, rng).map((c) => c.id)
}

export function startSetupPlay(g: Game, rng: Rng): Game {
  const teams = {
    mirchi: { ...g.teams.mirchi, position: 0, planted: [], revealed: 0, nextDescriber: 0, jugaadLeft: g.settings.twists.jugaad ? 1 : 0, jugaadOff: null },
    nimbu: { ...g.teams.nimbu, position: 0, planted: [], revealed: 0, nextDescriber: 0, jugaadLeft: g.settings.twists.jugaad ? 1 : 0, jugaadOff: null },
  }
  const base: Game = {
    ...g, teams, round: 1, currentTeam: 'mirchi', turn: null, tolls: [], winner: null, stats: {}, history: [], lastSlip: null,
    decks: buildDecks(g.settings, rng),
  }
  if (g.settings.pabandiPerTeam === 0) return { ...base, phase: 'board', draft: null }
  return { ...base, phase: 'draft', draft: { picker: 'mirchi', offers: dealOffers(rng), picks: [], redealt: false } }
}

/** Each team may swap its six offers for a fresh hand once. */
export function redealDraft(g: Game, rng: Rng): Game {
  if (!g.draft || g.draft.redealt) return g
  return { ...g, draft: { ...g.draft, offers: dealOffers(rng), picks: [], redealt: true } }
}

export function toggleDraftPick(g: Game, cardId: string): Game {
  if (!g.draft) return g
  const { picks } = g.draft
  const max = g.settings.pabandiPerTeam
  const next = picks.includes(cardId) ? picks.filter((p) => p !== cardId) : picks.length < max ? [...picks, cardId] : picks
  return { ...g, draft: { ...g.draft, picks: next } }
}

export function lockDraft(g: Game, rng: Rng): Game {
  if (!g.draft || g.draft.picks.length !== g.settings.pabandiPerTeam) return g
  const target = rival(g.draft.picker)
  const teams = { ...g.teams, [target]: { ...g.teams[target], planted: g.draft.picks } } as Record<TeamId, Team>
  if (g.draft.picker === 'mirchi') {
    return { ...g, teams, draft: { picker: 'nimbu', offers: dealOffers(rng), picks: [], redealt: false } }
  }
  return { ...g, teams, draft: null, phase: 'board' }
}

// ---------- Moves, tolls, winning ----------

function moveTeam(g: Game, id: TeamId, delta: number): Game {
  const team = g.teams[id]
  const position = Math.max(0, Math.min(finishLine(g.settings), team.position + delta))
  let next: Game = { ...g, teams: { ...g.teams, [id]: { ...team, position } } as Record<TeamId, Team> }
  if (position >= finishLine(g.settings)) return { ...next, winner: id }
  if (delta <= 0) return next
  // A +2 Dhamaka can jump over a toll; every toll passed still collects its Pabandi.
  tollStops(g.settings).forEach((stop, i) => {
    const passed = stop > team.position && stop <= position
    if (passed && i < team.planted.length && next.teams[id].revealed <= i) {
      next = {
        ...next,
        teams: { ...next.teams, [id]: { ...next.teams[id], revealed: i + 1 } } as Record<TeamId, Team>,
        tolls: [...next.tolls, { team: id, cardId: team.planted[i], toll: i + 1 }],
      }
    }
  })
  return next
}

/** After a move: winner beats everything, then toll reveals, else stay in play. */
function settle(g: Game, now: number, back: 'turn' | 'summary'): Game {
  if (g.winner) {
    return { ...g, phase: 'winner', turn: g.turn ? pause(g.turn, now) : null, tolls: [] }
  }
  if (g.tolls.length > 0) {
    return { ...g, phase: 'toll', overlayReturn: back, turn: g.turn ? pause(g.turn, now) : null }
  }
  return g
}

// ---------- A turn ----------

export const beginTurn = (g: Game): Game => ({ ...g, phase: 'pass' })

export function useJugaad(g: Game, cardId: string | null): Game {
  const team = g.teams[g.currentTeam]
  if (team.jugaadLeft < 1 && team.jugaadOff === null) return g
  const refund = team.jugaadOff !== null ? 1 : 0
  const spend = cardId ? 1 : 0
  return {
    ...g,
    teams: { ...g.teams, [team.id]: { ...team, jugaadOff: cardId, jugaadLeft: team.jugaadLeft + refund - spend } } as Record<TeamId, Team>,
  }
}

export function startTurn(g: Game, now: number, rng: Rng): Game {
  const team = g.teams[g.currentTeam]
  const ms = g.settings.turnSeconds * 1000
  const turn: Turn = {
    team: team.id, describerId: describerFor(team), pair: { words: [], dhamaka: false }, events: [],
    remainingMs: ms, runningSince: now, pairShownAt: ms,
  }
  return drawPair({ ...g, phase: 'turn', turn, history: [], lastSlip: null }, rng)
}

export function correct(g: Game, now: number, rng: Rng): Game {
  if (!g.turn || g.phase !== 'turn') return g
  const t = g.turn
  const left = remainingMs(t, now)
  const points = t.pair.dhamaka ? 2 : 1
  let next = snapshot(g)
  next = bumpStat(next, t.describerId, (s) => {
    const took = t.pairShownAt - left
    return { ...s, pairs: s.pairs + 1, bestMs: s.bestMs === null ? took : Math.min(s.bestMs, took) }
  })
  next = { ...next, turn: { ...t, events: [...t.events, { kind: 'correct', words: t.pair.words, points }], pairShownAt: left } }
  next = moveTeam(next, t.team, points)
  next = drawPair(next, rng)
  return settle(next, now, 'turn')
}

export function skip(g: Game, now: number, rng: Rng): Game {
  if (!g.turn || g.phase !== 'turn') return g
  const t = g.turn
  let next = snapshot(g)
  next = { ...next, turn: { ...t, events: [...t.events, { kind: 'skip', words: t.pair.words, points: 0 }], pairShownAt: remainingMs(t, now) } }
  return drawPair(next, rng)
}

export function slip(g: Game, now: number, reason: SlipReason, rng: Rng): Game {
  if (!g.turn || g.phase !== 'turn') return g
  const t = g.turn
  const other = rival(t.team)
  const ghatBack = inGhat(g.settings, g.teams[t.team].position)
  const rivalFrom = g.teams[other].position
  let next = snapshot(g)
  next = bumpStat(next, t.describerId, (s) => ({ ...s, slips: s.slips + 1 }))
  next = { ...next, turn: { ...pause(t, now), events: [...t.events, { kind: 'slip', words: t.pair.words, points: 1, reason, ghatBack }] } }
  next = moveTeam(next, other, 1)
  if (ghatBack) next = moveTeam(next, t.team, -1)
  next = drawPair(next, rng)
  next = { ...next, lastSlip: { reason, ghatBack, rivalFrom, rivalTo: next.teams[other].position } }
  if (next.winner) return settle(next, now, 'turn')
  return { ...next, phase: 'seeti' }
}

/** Host changes the reason shown on the seeti screen (for the stats and summary). */
export function setSlipReason(g: Game, reason: SlipReason): Game {
  if (!g.turn || !g.lastSlip) return g
  const events = g.turn.events.slice()
  const last = events[events.length - 1]
  if (last?.kind === 'slip') events[events.length - 1] = { ...last, reason }
  return { ...g, lastSlip: { ...g.lastSlip, reason }, turn: { ...g.turn, events } }
}

/** Close the seeti or toll overlay. */
export function closeOverlay(g: Game, now: number): Game {
  if (g.phase === 'toll') {
    const tolls = g.tolls.slice(1)
    if (tolls.length > 0) return { ...g, tolls }
    if (g.overlayReturn === 'summary') return { ...g, tolls, phase: 'summary' }
    return { ...g, tolls, phase: 'turn', turn: g.turn ? { ...play(g.turn, now), pairShownAt: remainingMs(g.turn, now) } : null }
  }
  if (g.phase === 'seeti') {
    if (g.tolls.length > 0) return { ...g, phase: 'toll', overlayReturn: 'turn' }
    return { ...g, phase: 'turn', turn: g.turn ? { ...play(g.turn, now), pairShownAt: g.turn.remainingMs } : null }
  }
  return g
}

/** Host overrules a seeti: undo the slip, and with the Galat Seeti twist the Describer's team gets +1. */
export function galatSeeti(g: Game, now: number): Game {
  if (g.phase !== 'seeti' || g.history.length === 0) return g
  const before = undo(g)
  const t = before.turn!
  let next: Game = { ...before, phase: 'turn', turn: { ...pause(t, now) }, lastSlip: null }
  if (g.settings.twists.galatSeeti) next = moveTeam(next, t.team, 1)
  const settled = settle(next, now, 'turn')
  if (settled.phase !== 'turn') return settled
  return { ...settled, turn: play(settled.turn!, now) }
}

export function undo(g: Game): Game {
  const prev = g.history[g.history.length - 1]
  if (!prev) return g
  const restored: Game = { ...prev, history: g.history.slice(0, -1) } as Game
  // Keep the clock where it is: undo fixes the score, not the time.
  if (restored.turn && g.turn) restored.turn = { ...restored.turn, remainingMs: g.turn.remainingMs, runningSince: g.turn.runningSince }
  return { ...restored, phase: g.phase === 'seeti' ? 'seeti' : 'turn' }
}

export function timeUp(g: Game, now: number): Game {
  if (!g.turn || g.phase !== 'turn') return g
  const turn = { ...pause(g.turn, now), remainingMs: 0 }
  if (g.settings.twists.chori && turn.pair.words.length > 0) return { ...g, turn, phase: 'steal' }
  return { ...g, turn, phase: 'summary' }
}

export function stealResult(g: Game, now: number, stolen: boolean): Game {
  if (!g.turn || g.phase !== 'steal') return g
  const t = g.turn
  let next: Game = { ...g, turn: { ...t, events: [...t.events, { kind: stolen ? 'steal' : 'stealMiss', words: t.pair.words, points: stolen ? 1 : 0 }] } }
  if (stolen) next = moveTeam(next, rival(t.team), 1)
  next = { ...next, phase: 'summary' }
  return settle(next, now, 'summary')
}

export function nextTurn(g: Game): Game {
  if (!g.turn) return g
  const played = g.turn.team
  const team = g.teams[played]
  const teams = {
    ...g.teams,
    [played]: { ...team, nextDescriber: (team.nextDescriber + 1) % Math.max(1, team.playerIds.length), jugaadOff: null },
  } as Record<TeamId, Team>
  const currentTeam = rival(played)
  return { ...g, teams, currentTeam, round: currentTeam === 'mirchi' ? g.round + 1 : g.round, turn: null, history: [], phase: 'board' }
}

export const rematch = (g: Game, rng: Rng): Game => startSetupPlay({ ...g, winner: null }, rng)

// ---------- Summaries ----------

export function turnTotals(turn: Turn) {
  let team = 0, rivals = 0, back = 0
  for (const e of turn.events) {
    if (e.kind === 'correct') team += e.points
    if (e.kind === 'slip') { rivals += 1; if (e.ghatBack) back += 1 }
    if (e.kind === 'steal') rivals += 1
  }
  return { team, rivals, back }
}

export function awards(g: Game) {
  const entries = Object.entries(g.stats).map(([id, s]) => ({ id, name: playerName(g, id), ...s }))
  const by = <K extends 'slips' | 'pairs'>(k: K) => entries.slice().sort((x, y) => y[k] - x[k])[0]
  const fastest = entries.filter((e) => e.bestMs !== null).sort((x, y) => x.bestMs! - y.bestMs!)[0]
  return { ummKing: by('slips'), bestDescriber: by('pairs'), fastest }
}
