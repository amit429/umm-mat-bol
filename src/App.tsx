import { useEffect } from 'react'
import { useGame } from './game/store'
import { Draft, Fillers, Home, Players, Rules, Settings, Teams } from './screens/Setup'
import { Board, Pass, Seeti, Steal, Summary, Toll, Turn, Winner } from './screens/Play'
import { unlockAudio } from './audio/sfx'

export default function App() {
  const phase = useGame((s) => s.game.phase)

  // Browsers only allow sound after a user gesture; unlock on the first tap anywhere.
  useEffect(() => {
    const unlock = () => unlockAudio()
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [phase])

  switch (phase) {
    case 'home': return <Home />
    case 'rules': return <Rules />
    case 'players': return <Players />
    case 'teams': return <Teams />
    case 'settings': return <Settings />
    case 'fillers': return <Fillers />
    case 'draft': return <Draft />
    case 'board': return <Board />
    case 'pass': return <Pass />
    case 'turn': return <Turn />
    case 'seeti': return <Seeti />
    case 'toll': return <Toll />
    case 'steal': return <Steal />
    case 'summary': return <Summary />
    case 'winner': return <Winner />
  }
}
