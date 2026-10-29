// Brain-fart words. The group picks its list before the game:
// any of these out of the Describer's mouth = SEETI.

export type LangId = 'en' | 'hi' | 'mr'

export interface FillerLang {
  id: LangId
  name: string
  script: string
  words: string[]
}

/** Always on, in every language. */
export const CORE_FILLERS = ['umm', 'uhh', 'err', 'ahh', 'hmm']

export const FILLER_LANGS: FillerLang[] = [
  {
    id: 'en',
    name: 'English',
    script: 'English',
    words: ['like', 'you know', 'I mean', 'basically', 'actually', 'literally', 'so…', 'well…', 'kind of', 'sort of', 'okay so', 'wait', 'what’s it called', 'thingy', 'whatever'],
  },
  {
    id: 'hi',
    name: 'Hindi',
    script: 'हिंदी',
    words: ['matlab', 'woh', 'woh kya hai', 'kya bolte hain', 'haan toh', 'accha', 'yaani', 'arre', 'bas', 'toh', 'jaise', 'kya naam hai', 'dekho', 'samjho', 'na'],
  },
  {
    id: 'mr',
    name: 'Marathi',
    script: 'मराठी',
    words: ['mhanje', 'te', 'kay mhantat', 'ata', 'bagh', 'ho na', 'ani', 'are', 'tasa', 'bara', 'mag', 'kay naav', 'aho', 'ase', 'na'],
  },
]

/** A sensible default: the core sounds plus the most common English and Hindi fillers. */
export const DEFAULT_FILLERS = ['like', 'basically', 'actually', 'you know', 'matlab', 'woh', 'kya bolte hain', 'mhanje', 'kay mhantat']
