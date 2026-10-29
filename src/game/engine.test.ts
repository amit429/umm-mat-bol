import { describe, expect, it } from 'vitest'
import {
  addPlayer, closeOverlay, correct, dealOffers, galatSeeti, lockDraft, newGame, nextTurn, skip, slip,
  splitTeams, startSetupPlay, startTurn, stealResult, timeUp, toggleDraftPick, undo, updateSettings,
  cardById, remainingMs, activePabandi, useJugaad, type Game, type Rng,
} from './engine'
import { SPEECH_KINDS, PHYSICAL_KINDS, PABANDI } from '../data/pabandi'

const seeded = (seed: number): Rng => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const NAMES = ['Riya', 'Arjun', 'Kabir', 'Meera', 'Zoya', 'Dev', 'Ananya', 'Rohan']

function setup(patch: Partial<Game['settings']> = {}, seed = 1): Game {
  const rng = seeded(seed)
  let g = newGame()
  NAMES.forEach((n, i) => { g = addPlayer(g, n, `p${i}`) })
  g = splitTeams(g, rng)
  g = updateSettings(g, patch)
  g = startSetupPlay(g, rng)
  while (g.phase === 'draft') {
    for (const id of g.draft!.offers.slice(0, g.settings.pabandiPerTeam)) g = toggleDraftPick(g, id)
    g = lockDraft(g, rng)
  }
  return g
}

const rng = seeded(42)

describe('setup', () => {
  it('adds at most 10 unique players', () => {
    let g = newGame()
    for (let i = 0; i < 12; i++) g = addPlayer(g, `P${i}`, `id${i}`)
    g = addPlayer(g, 'p0', 'dupe')
    expect(g.players).toHaveLength(10)
  })

  it('splits players into two balanced teams', () => {
    const g = setup()
    expect(g.teams.mirchi.playerIds).toHaveLength(4)
    expect(g.teams.nimbu.playerIds).toHaveLength(4)
  })

  it('plants 3 Pabandis on each team after both drafts', () => {
    const g = setup()
    expect(g.phase).toBe('board')
    expect(g.teams.mirchi.planted).toHaveLength(3)
    expect(g.teams.nimbu.planted).toHaveLength(3)
  })

  it('skips the draft when Pabandi count is 0', () => {
    const g = setup({ pabandiPerTeam: 0 })
    expect(g.phase).toBe('board')
    expect(g.teams.mirchi.planted).toHaveLength(0)
  })

  it('deals balanced offers: 2+ speech rules, at most 2 physical, at most 1 letter', () => {
    for (let s = 0; s < 200; s++) {
      const offers = dealOffers(seeded(s)).map(cardById)
      expect(offers).toHaveLength(6)
      expect(new Set(offers.map((c) => c.id)).size).toBe(6)
      expect(offers.filter((c) => SPEECH_KINDS.includes(c.kind)).length).toBeGreaterThanOrEqual(2)
      expect(offers.filter((c) => PHYSICAL_KINDS.includes(c.kind)).length).toBeLessThanOrEqual(2)
      expect(offers.filter((c) => c.kind === 'letter').length).toBeLessThanOrEqual(1)
    }
  })

  it('has unique Pabandi ids', () => {
    expect(new Set(PABANDI.map((c) => c.id)).size).toBe(PABANDI.length)
  })
})

describe('a turn', () => {
  it('correct moves the team +1 and shows a new pair', () => {
    let g = startTurn(setup({ twists: { ghat: true, chori: true, jugaad: true, dhamaka: false, galatSeeti: false } }), 0, rng)
    const first = g.turn!.pair.words.join(' ')
    g = correct(g, 1000, rng)
    expect(g.teams.mirchi.position).toBe(1)
    expect(g.turn!.pair.words.join(' ')).not.toBe(first)
  })

  it('pairs never contain one word inside another', () => {
    let g = startTurn(setup(), 0, rng)
    for (let i = 0; i < 300; i++) {
      const [a, ...rest] = g.turn!.pair.words.map((w) => w.toLowerCase())
      for (const b of rest) expect(a.includes(b) || b.includes(a)).toBe(false)
      g = skip(g, 0, rng)
    }
  })

  it('slip moves the rivals +1, pauses the clock and shows the seeti', () => {
    let g = startTurn(setup(), 0, rng)
    g = slip(g, 5000, 'filler', rng)
    expect(g.phase).toBe('seeti')
    expect(g.teams.nimbu.position).toBe(1)
    expect(g.turn!.runningSince).toBeNull()
    expect(remainingMs(g.turn!, 99999)).toBe(40000)
    g = closeOverlay(g, 10000)
    expect(g.phase).toBe('turn')
    expect(remainingMs(g.turn!, 11000)).toBe(39000)
  })

  it('Ghat Section: a slip on stops 16-18 also pushes the Describer back 1', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, mirchi: { ...g.teams.mirchi, position: 17 } } }
    g = startTurn(g, 0, rng)
    g = slip(g, 1000, 'filler', rng)
    expect(g.teams.mirchi.position).toBe(16)
    expect(g.lastSlip!.ghatBack).toBe(true)
  })

  it('no Ghat push-back when the twist is off', () => {
    let g = setup({ twists: { ghat: false, chori: true, jugaad: true, dhamaka: true, galatSeeti: false } })
    g = { ...g, teams: { ...g.teams, mirchi: { ...g.teams.mirchi, position: 17 } } }
    g = slip(startTurn(g, 0, rng), 1000, 'filler', rng)
    expect(g.teams.mirchi.position).toBe(17)
  })

  it('reaching a toll reveals the next Pabandi and pauses the clock', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, mirchi: { ...g.teams.mirchi, position: 4 } } }
    g = startTurn(g, 0, rng)
    while (g.turn!.pair.dhamaka) g = skip(g, 0, rng)
    g = correct(g, 2000, rng)
    expect(g.phase).toBe('toll')
    expect(g.teams.mirchi.revealed).toBe(1)
    expect(g.tolls[0].cardId).toBe(g.teams.mirchi.planted[0])
    expect(activePabandi(g.teams.mirchi)).toHaveLength(1)
    g = closeOverlay(g, 5000)
    expect(g.phase).toBe('turn')
  })

  it('a +2 Dhamaka that jumps over a toll still reveals its Pabandi', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, mirchi: { ...g.teams.mirchi, position: 4 } } }
    g = startTurn(g, 0, rng)
    g = { ...g, turn: { ...g.turn!, pair: { words: ['Shy', 'Royal', 'Mango'], dhamaka: true } } }
    g = correct(g, 1000, rng)
    expect(g.teams.mirchi.position).toBe(6)
    expect(g.phase).toBe('toll')
    expect(g.teams.mirchi.revealed).toBe(1)
  })

  it('sliding back in the Ghat and returning does not reveal a toll twice', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, mirchi: { ...g.teams.mirchi, position: 15, revealed: 3 } } }
    g = startTurn(g, 0, rng)
    while (g.turn!.pair.dhamaka) g = skip(g, 0, rng)
    g = correct(g, 1000, rng)
    expect(g.phase).toBe('turn')
    expect(g.tolls).toHaveLength(0)
  })

  it('a rival slip onto their toll reveals their card after the seeti', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, nimbu: { ...g.teams.nimbu, position: 9 } } }
    g = slip(startTurn(g, 0, rng), 1000, 'cardWord', rng)
    expect(g.phase).toBe('seeti')
    expect(g.teams.nimbu.revealed).toBe(2)
    g = closeOverlay(g, 2000)
    expect(g.phase).toBe('toll')
    expect(g.tolls[0].team).toBe('nimbu')
  })

  it('first to the finish wins at once, even on the rivals’ turn', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, nimbu: { ...g.teams.nimbu, position: 18 } } }
    g = slip(startTurn(g, 0, rng), 1000, 'filler', rng)
    expect(g.phase).toBe('winner')
    expect(g.winner).toBe('nimbu')
  })

  it('undo reverses the last call but keeps the clock', () => {
    let g = startTurn(setup(), 0, rng)
    const pair = g.turn!.pair.words.join()
    g = correct(g, 3000, rng)
    g = undo(g)
    expect(g.teams.mirchi.position).toBe(0)
    expect(g.turn!.pair.words.join()).toBe(pair)
    expect(g.turn!.runningSince).toBe(0)
  })

  it('Galat Seeti: overruling restores the score and rewards the Describer team when on', () => {
    const on = { ghat: true, chori: true, jugaad: true, dhamaka: true, galatSeeti: true }
    let g = slip(startTurn(setup({ twists: on }), 0, rng), 1000, 'filler', rng)
    g = galatSeeti(g, 2000)
    expect(g.phase).toBe('turn')
    expect(g.teams.nimbu.position).toBe(0)
    expect(g.teams.mirchi.position).toBe(1)
  })

  it('Chori: time up goes to the steal, a steal gives the rivals +1', () => {
    let g = timeUp(startTurn(setup(), 0, rng), 45000)
    expect(g.phase).toBe('steal')
    g = stealResult(g, 46000, true)
    expect(g.phase).toBe('summary')
    expect(g.teams.nimbu.position).toBe(1)
  })

  it('without Chori, time up goes straight to the summary', () => {
    const off = { ghat: true, chori: false, jugaad: true, dhamaka: true, galatSeeti: false }
    expect(timeUp(startTurn(setup({ twists: off }), 0, rng), 45000).phase).toBe('summary')
  })

  it('Dhamaka pairs have three words and score +2', () => {
    let g = startTurn(setup(), 0, seeded(3))
    const r = seeded(9)
    let guard = 0
    while (!g.turn!.pair.dhamaka && guard++ < 500) g = skip(g, 0, r)
    expect(g.turn!.pair.words).toHaveLength(3)
    g = correct(g, 1000, r)
    expect(g.teams.mirchi.position).toBe(2)
  })

  it('next turn swaps teams and rotates the Describer', () => {
    let g = setup()
    const first = g.teams.mirchi.playerIds[0]
    g = startTurn(g, 0, rng)
    expect(g.turn!.describerId).toBe(first)
    g = nextTurn(timeUp({ ...g, settings: { ...g.settings, twists: { ...g.settings.twists, chori: false } } }, 45000))
    expect(g.currentTeam).toBe('nimbu')
    expect(g.teams.mirchi.nextDescriber).toBe(1)
  })

  it('Jugaad switches one revealed Pabandi off for a turn, once', () => {
    let g = setup()
    g = { ...g, teams: { ...g.teams, mirchi: { ...g.teams.mirchi, revealed: 2 } } }
    const card = g.teams.mirchi.planted[0]
    g = useJugaad(g, card)
    expect(activePabandi(g.teams.mirchi).map((c) => c.id)).not.toContain(card)
    expect(g.teams.mirchi.jugaadLeft).toBe(0)
    g = useJugaad(g, null)
    expect(g.teams.mirchi.jugaadLeft).toBe(1)
  })
})
