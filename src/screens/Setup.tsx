import { useState } from 'react'
import { motion } from 'motion/react'
import { useGame } from '../game/store'
import { rival, type TeamId } from '../game/engine'
import { PACKS, type PackId } from '../data/words'
import { CORE_FILLERS, FILLER_LANGS } from '../data/fillers'
import { Btn, Chip, Footer, Header, Screen, Segmented, Toggle } from '../ui/kit'
import { Charm, TeamEmblem } from '../ui/art'
import { IconArrow, IconPlus, IconShuffle, IconX } from '../ui/icons'
import { sfx, unlockAudio } from '../audio/sfx'

export const TEAM_INFO: Record<TeamId, { name: string; tag: string; bg: string; text: string; sub: string }> = {
  mirchi: { name: 'Team Mirchi', tag: 'the spicy ones', bg: 'bg-sindoor', text: 'text-kagaz', sub: 'text-blush' },
  nimbu: { name: 'Team Nimbu', tag: 'the sour ones', bg: 'bg-nimbu', text: 'text-kajal', sub: 'text-[#2B3A10]' },
}

// ---------- Home ----------

export function Home() {
  const go = useGame((s) => s.go)
  return (
    <Screen className="bg-sindoor text-kagaz" dots={false}>
      <div className="halftone-strong pointer-events-none absolute inset-0" />
      <div className="truck-blocks relative h-[18px] border-b-[3px] border-kajal" />
      <div className="zigzag relative h-4 border-b-[3px] border-kajal" />
      <motion.div
        className="relative mx-auto -mt-px w-[105px] origin-top"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Charm className="h-[150px] w-[105px]" />
      </motion.div>

      <div className="relative flex flex-col items-center gap-1.5 px-6 text-center">
        <span className="font-deva text-2xl leading-none text-haldi">उम्म मत बोल!</span>
        <div className="relative mt-1 pt-2.5">
          <div className="absolute -inset-x-2.5 top-0 h-2.5 rounded border-[3px] border-kajal bg-haldi shadow-[3px_4px_0_#231815]" />
          <h1 className="outline-text font-display text-[60px] leading-[0.95] text-haldi">UMM MAT<br />BOL!</h1>
        </div>
        <p className="mt-3 text-[22px] font-bold leading-tight">Describe the combo.<br />Never say umm.</p>
        <p className="text-[15px] font-semibold text-blush">Bolo… par atko mat!</p>
        <div className="mt-2 flex gap-2">
          {['4–10 players', '2 teams', '1 phone'].map((t) => <Chip key={t} className="bg-kagaz text-kajal">{t}</Chip>)}
        </div>
      </div>

      <div className="relative mt-auto flex flex-col gap-3.5 px-6 pt-8 pb-6">
        <button type="button" onClick={() => { unlockAudio(); sfx.tap(); go('players') }}
          className="pop flex min-h-[72px] flex-col items-center justify-center rounded-[18px] border-[3px] border-kajal bg-haldi text-kajal">
          <span className="font-display text-xl leading-tight">Play in this room</span>
          <span className="text-[13px] font-bold">Host mode · one phone · no internet needed</span>
        </button>
        <button type="button" disabled
          className="relative flex min-h-16 cursor-not-allowed flex-col items-center justify-center rounded-[18px] border-[3px] border-kajal bg-kagaz text-kajal opacity-90 shadow-[0_6px_0_#231815]">
          <span className="font-display text-lg leading-tight">Play online</span>
          <span className="text-[13px] font-bold">AI referee · everyone on their own phone</span>
          <span className="absolute -top-3 right-3 rotate-[4deg] rounded-md border-2 border-kajal bg-peacock px-2 py-0.5 font-display text-[11px] text-kagaz">Coming soon</span>
        </button>
        <button type="button" onClick={() => { unlockAudio(); sfx.tap(); go('rules') }} className="mx-auto min-h-11 text-base font-bold underline underline-offset-4">
          How to play
        </button>
      </div>
      <div className="relative flex h-11 items-center justify-center gap-3.5 border-t-[3px] border-kajal bg-haldi text-kajal">
        <span className="font-display text-[15px]">Horn OK Please</span>
        <span className="size-2 rounded-full bg-sindoor" />
        <span className="font-display text-[15px]">Umm not OK</span>
      </div>
    </Screen>
  )
}

// ---------- How to play ----------

const RULES: { title: string; body: string }[] = [
  { title: 'Split into two teams', body: 'Team Mirchi vs Team Nimbu. Teams take turns; one player describes, the rest of the team guesses.' },
  { title: 'Get two secret words', body: 'The Describer sees a describing word and a thing, like Nervous + Samosa. Get your team to say both words, in order.' },
  { title: 'Race the chai timer', body: 'You have 45 seconds. Every combo your team gets moves you one stop closer to Goa. Then grab the next pair.' },
  { title: 'Never brain-fart', body: 'It’s not just umm. Uhh, err, hmm and every filler on your group’s list (like, basically, matlab, mhanje…) is a slip. So is saying any part of a card word.' },
  { title: 'SEETI!', body: 'The other team listens. Catch a slip, shout SEETI, and the other team moves one stop forward instead.' },
  { title: 'Pay at the Toll Nakas', body: 'Each team is secretly dealt three Pabandi cards (house rules), like “stand on one leg” or “talk like a news anchor”. Reach a Toll Naka and your next one unlocks, for the rest of the game.' },
  { title: 'Survive the Ghat Section', body: 'On the last three stops before Goa, a slip also slides you back one stop.' },
  { title: 'First to Goa wins', body: 'The first team past the last stop wins. Goa pahunch gaye!' },
]

export function Rules() {
  const go = useGame((s) => s.go)
  const hasPlayers = useGame((s) => s.game.players.length > 0)
  return (
    <Screen>
      <Header title="How to play" sub="Five minutes to learn. A lifetime of umms." onBack={() => go('home')} />
      <ol className="flex flex-col gap-3 px-5 py-5">
        {RULES.map((r, i) => (
          <li key={r.title} className="flex gap-3 rounded-2xl border-[2.5px] border-kajal bg-paper p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-kajal bg-haldi font-display">{i + 1}</span>
            <div>
              <h2 className="text-[17px] leading-tight font-extrabold">{r.title}</h2>
              <p className="mt-0.5 text-[15px] leading-snug font-semibold text-muted">{r.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mx-5 mb-4 rounded-2xl border-[2.5px] border-dashed border-kajal bg-blush p-3.5 text-[15px] font-semibold">
        <b>Masala twists</b> (switch them on or off in settings): steal a pair when time runs out (Chori), switch off a Pabandi once (Jugaad), rare three-word Dhamaka cards worth +2, and a reward for wrong seetis (Galat Seeti).
      </div>
      <Footer>
        <Btn big onClick={() => go(hasPlayers ? 'players' : 'players')}>Let’s play <IconArrow /></Btn>
      </Footer>
    </Screen>
  )
}

// ---------- Players ----------

const SWATCHES = [['#C8242B', '#F7ECD5'], ['#0E6C6A', '#F7ECD5'], ['#F5B820', '#231815'], ['#E0457B', '#231815'], ['#8DBA2E', '#231815']]

export function Players() {
  const { game, go, addPlayer, removePlayer, splitTeams } = useGame()
  const [name, setName] = useState('')
  const n = game.players.length
  const submit = () => {
    if (!name.trim()) return
    sfx.tap()
    addPlayer(name)
    setName('')
  }
  return (
    <Screen>
      <Header title="Who’s playing?" sub="Add everyone in the room · 4 to 10 players" step="Step 1 of 4" onBack={() => go('home')} />
      <section className="flex flex-col gap-4 px-5 py-5">
        <form className="flex flex-col gap-1.5" onSubmit={(e) => { e.preventDefault(); submit() }}>
          <label htmlFor="pname" className="text-sm font-bold">Player name</label>
          <div className="flex gap-2.5">
            <input id="pname" value={name} onChange={(e) => setName(e.target.value)} maxLength={16} autoComplete="off"
              disabled={n >= 10} placeholder={n >= 10 ? 'Room is full!' : 'e.g. Pinky'}
              className="h-[52px] min-w-0 flex-1 rounded-[14px] border-[3px] border-kajal bg-paper px-4 text-lg font-semibold placeholder:text-[#8B7B70]" />
            <button type="submit" aria-label="Add player" disabled={!name.trim() || n >= 10}
              className="pop flex size-[52px] items-center justify-center rounded-[14px] border-[3px] border-kajal bg-peacock text-kagaz disabled:opacity-50">
              <IconPlus size={24} />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between">
          <span className="font-display">{n} / 10 players</span>
          {n >= 8 && <Chip className="bg-haldi">Full gang!</Chip>}
          {n > 0 && n < 4 && <span className="text-sm font-bold text-muted">Need {4 - n} more</span>}
        </div>

        <ul className="grid grid-cols-2 gap-2.5">
          {game.players.map((p, i) => (
            <motion.li key={p.id} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex h-[52px] items-center gap-2.5 rounded-[14px] border-[2.5px] border-kajal bg-paper pr-1 pl-2 shadow-[3px_3px_0_#231815]">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full border-2 border-kajal font-display text-[15px]"
                style={{ background: SWATCHES[i % 5][0], color: SWATCHES[i % 5][1] }}>{p.name[0].toUpperCase()}</span>
              <span className="min-w-0 flex-1 truncate text-base font-bold">{p.name}</span>
              <button type="button" aria-label={`Remove ${p.name}`} onClick={() => { sfx.tap(); removePlayer(p.id) }}
                className="-ml-1 flex h-10 w-8 shrink-0 items-center justify-center text-muted"><IconX size={15} /></button>
            </motion.li>
          ))}
        </ul>
        {n === 0 && <p className="rounded-xl border-2 border-dashed border-kajal p-4 text-center font-semibold text-muted">Type a name and tap + to add the first player.</p>}
      </section>
      <Footer>
        <p className="rounded-xl border-2 border-dashed border-kajal bg-blush px-3.5 py-2.5 text-sm font-semibold">
          Tip: 8–10 is the sweet spot. Odd number? One team just gets an extra turn as Describer.
        </p>
        <Btn big disabled={n < 4} onClick={() => { splitTeams(); go('teams') }}>Make teams <IconArrow /></Btn>
      </Footer>
    </Screen>
  )
}

// ---------- Teams ----------

function TeamCard({ id }: { id: TeamId }) {
  const { game, movePlayer } = useGame()
  const team = game.teams[id]
  const info = TEAM_INFO[id]
  return (
    <div className={`rounded-[20px] border-[3px] border-kajal p-4 card-shadow ${info.bg} ${info.text}`}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-12 items-center justify-center rounded-full border-[3px] border-kajal bg-kagaz"><TeamEmblem team={id} /></span>
        <div className="flex-1">
          <div className="font-display text-[22px] leading-none">{info.name}</div>
          <div className={`text-[15px] font-semibold ${info.sub}`}>{info.tag}</div>
        </div>
        <span className="text-sm font-bold">{team.playerIds.length} players</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {team.playerIds.map((pid, i) => {
          const p = game.players.find((x) => x.id === pid)!
          return (
            <motion.li key={pid} layout>
              <button type="button" onClick={() => { sfx.tap(); movePlayer(pid) }} aria-label={`Move ${p.name} to ${TEAM_INFO[rival(id)].name}`}
                className="flex min-h-9 items-center gap-1.5 rounded-full border-2 border-kajal bg-kagaz py-1 pr-3 pl-1 text-base font-bold text-kajal">
                <span className="flex size-6 items-center justify-center rounded-full bg-kajal font-display text-xs text-haldi">{i + 1}</span>
                {p.name}
              </button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

export function Teams() {
  const { go, splitTeams } = useGame()
  return (
    <Screen>
      <Header title="Pick your sides" sub="Tap a name to move it · numbers show who describes first" step="Step 2 of 4" onBack={() => go('players')} />
      <section className="flex flex-col px-5 pt-5">
        <TeamCard id="mirchi" />
        <div className="relative z-10 flex h-8 items-center justify-center">
          <span className="flex size-14 -rotate-[8deg] items-center justify-center rounded-full border-[3px] border-kajal bg-haldi font-display text-xl shadow-[3px_3px_0_#231815]">VS</span>
        </div>
        <TeamCard id="nimbu" />
      </section>
      <Footer>
        <div className="flex gap-3">
          <Btn big tone="paper" className="w-[140px] gap-2 !px-3 !text-base" onClick={splitTeams}><IconShuffle /> Shuffle</Btn>
          <Btn big className="flex-1 whitespace-nowrap !text-base" onClick={() => go('settings')}>Lock teams <IconArrow /></Btn>
        </div>
      </Footer>
    </Screen>
  )
}

// ---------- Settings ----------

const TWISTS: { key: keyof ReturnType<typeof useGame.getState>['game']['settings']['twists']; label: string; sub: string }[] = [
  { key: 'ghat', label: 'Ghat Section', sub: 'Last 3 stops: a slip also slides you back one stop' },
  { key: 'chori', label: 'Chori (steal)', sub: 'Time up mid-pair? The other team gets one guess to steal +1' },
  { key: 'jugaad', label: 'Jugaad token', sub: 'Once a game, switch off one of your Pabandis for a turn' },
  { key: 'dhamaka', label: 'Dhamaka cards', sub: 'Rare three-word combos worth +2' },
  { key: 'galatSeeti', label: 'Galat Seeti', sub: 'Wrong seeti? The Describer’s team gets +1' },
]

export function Settings() {
  const { game, go, updateSettings } = useGame()
  const s = game.settings
  const togglePack = (id: PackId) => {
    const packs = s.packs.includes(id) ? s.packs.filter((p) => p !== id) : [...s.packs, id]
    if (packs.length) updateSettings({ packs })
  }
  return (
    <Screen>
      <Header title="Game settings" sub="The defaults work great for 8–10 players" step="Step 3 of 4" onBack={() => go('teams')} />
      <section className="flex flex-col gap-4 px-5 py-5">
        <Field label="Chai timer" hint="seconds per turn">
          <Segmented label="Chai timer" value={s.turnSeconds} onChange={(v) => updateSettings({ turnSeconds: v })}
            options={[{ value: 30, label: '30s' }, { value: 45, label: '45s' }, { value: 60, label: '60s' }]} />
        </Field>
        <Field label="Road to Goa" hint="number of stops">
          <Segmented label="Road length" value={s.trackLength} onChange={(v) => updateSettings({ trackLength: v })}
            options={[{ value: 12, label: 'Quick · 12' }, { value: 18, label: 'Full · 18' }]} />
        </Field>
        <Field label="Pabandi cards" hint="per team, dealt at random">
          <Segmented label="Pabandi cards per team" value={s.pabandiPerTeam} onChange={(v) => updateSettings({ pabandiPerTeam: v })}
            options={[0, 1, 2, 3].map((v) => ({ value: v as 0 | 1 | 2 | 3, label: String(v) }))} />
        </Field>

        <Field label="Word packs" hint="pick one or more">
          <div className="grid grid-cols-3 gap-2">
            {PACKS.map((p) => {
              const on = s.packs.includes(p.id)
              return (
                <button key={p.id} type="button" aria-pressed={on} onClick={() => { sfx.tap(); togglePack(p.id) }}
                  className={`flex min-h-[72px] flex-col items-start rounded-[14px] border-[2.5px] border-kajal px-2.5 py-2 text-left shadow-[3px_3px_0_#231815] ${on ? 'bg-peacock text-kagaz' : 'bg-paper'}`}>
                  <span className="text-[15px] leading-tight font-extrabold">{p.name}</span>
                  <span className="text-xs leading-tight font-semibold">{p.example}</span>
                </button>
              )
            })}
          </div>
          <Row label="Family-safe" sub="Drops the few cheeky words, for kids and elders">
            <Toggle label="Family-safe" on={s.familySafe} onChange={(v) => updateSettings({ familySafe: v })} />
          </Row>
        </Field>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-[17px]">Masala twists</span>
            <Chip className="bg-rani">NEW</Chip>
          </div>
          {TWISTS.map((t) => (
            <Row key={t.key} label={t.label} sub={t.sub}>
              <Toggle label={t.label} on={s.twists[t.key]} onChange={(v) => updateSettings({ twists: { ...s.twists, [t.key]: v } })} />
            </Row>
          ))}
        </div>
      </section>
      <Footer>
        <Btn big onClick={() => go('fillers')}>Next: brain-fart words <IconArrow /></Btn>
      </Footer>
    </Screen>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-base font-extrabold">{label}</span>
        {hint && <span className="text-[13px] font-semibold text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Row({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border-[2.5px] border-kajal bg-paper px-3 py-2.5">
      <div className="flex-1">
        <div className="text-base leading-tight font-extrabold">{label}</div>
        <div className="text-[13px] leading-snug font-semibold text-muted">{sub}</div>
      </div>
      {children}
    </div>
  )
}

// ---------- Brain-fart words ----------

export function Fillers() {
  const { game, go, updateSettings, startSetupPlay } = useGame()
  const fillers = game.settings.fillers
  const [custom, setCustom] = useState('')
  const toggle = (w: string) => {
    sfx.tap()
    updateSettings({ fillers: fillers.includes(w) ? fillers.filter((f) => f !== w) : [...fillers, w] })
  }
  const setLang = (words: string[], on: boolean) => {
    sfx.tap()
    const rest = fillers.filter((f) => !words.includes(f))
    updateSettings({ fillers: on ? [...rest, ...words] : rest })
  }
  const known = new Set(FILLER_LANGS.flatMap((l) => l.words))
  const customs = fillers.filter((f) => !known.has(f))
  const addCustom = () => {
    const w = custom.trim().toLowerCase().slice(0, 24)
    if (w && !fillers.includes(w) && !CORE_FILLERS.includes(w)) { sfx.tap(); updateSettings({ fillers: [...fillers, w] }) }
    setCustom('')
  }
  const total = CORE_FILLERS.length + fillers.length
  return (
    <Screen>
      <Header title="Brain-fart words" sub="Not just umm! Agree on the filler words that count as a slip." step="Step 4 of 4" onBack={() => go('settings')} />
      <section className="flex flex-col gap-4 px-5 py-5">
        <div className="rounded-2xl border-[3px] border-kajal bg-kajal p-3.5 text-kagaz">
          <div className="text-sm font-extrabold tracking-wider text-haldi uppercase">Always a seeti</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {CORE_FILLERS.map((w) => <span key={w} className="rounded-full bg-sindoor px-3 py-0.5 text-[15px] font-extrabold">{w}</span>)}
          </div>
          <p className="mt-2 text-[13px] font-semibold text-[#E6D9C2]">Plus any part of a word on the cards. Tap words below to ban them too (dark = banned), and count the same filler in any language your gang speaks.</p>
        </div>

        {FILLER_LANGS.map((lang) => {
          const allOn = lang.words.every((w) => fillers.includes(w))
          return (
            <div key={lang.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[17px] font-extrabold">{lang.name} <span className="font-semibold text-muted">{lang.id !== 'en' && lang.script}</span></span>
                <button type="button" onClick={() => setLang(lang.words, !allOn)} className="min-h-9 rounded-lg px-2 text-sm font-bold text-peacock underline underline-offset-2">
                  {allOn ? 'Clear all' : 'Select all'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {lang.words.map((w) => {
                  const on = fillers.includes(w)
                  return (
                    <button key={w} type="button" aria-pressed={on} onClick={() => toggle(w)}
                      className={`min-h-10 rounded-full border-[2.5px] border-kajal px-3.5 text-[15px] font-bold ${on ? 'bg-kajal text-haldi' : 'bg-paper text-kajal'}`}>
                      {w}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        <form className="flex flex-col gap-1.5" onSubmit={(e) => { e.preventDefault(); addCustom() }}>
          <label htmlFor="custom" className="text-[17px] font-extrabold">Add your own</label>
          <p className="-mt-1 text-[13px] font-semibold text-muted">Gujarati, Tamil, Bengali, office jargon… anything your gang overuses.</p>
          <div className="flex gap-2.5">
            <input id="custom" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. basically bro"
              className="h-12 min-w-0 flex-1 rounded-[14px] border-[3px] border-kajal bg-paper px-4 text-base font-semibold" />
            <button type="submit" aria-label="Add word" disabled={!custom.trim()}
              className="pop flex size-12 items-center justify-center rounded-[14px] border-[3px] border-kajal bg-peacock text-kagaz disabled:opacity-50"><IconPlus /></button>
          </div>
          {customs.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {customs.map((w) => (
                <button key={w} type="button" onClick={() => toggle(w)} aria-label={`Remove ${w}`}
                  className="min-h-10 rounded-full border-[2.5px] border-kajal bg-rani px-3.5 text-[15px] font-bold">✕ {w}</button>
              ))}
            </div>
          )}
        </form>
      </section>
      <Footer>
        <span className="text-center text-sm font-extrabold">{total} words will trigger the seeti</span>
        <Btn big onClick={startSetupPlay}>
          Start the game <IconArrow />
        </Btn>
      </Footer>
    </Screen>
  )
}
