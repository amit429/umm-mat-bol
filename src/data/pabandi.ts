// Pabandi cards: house rules a team secretly plants on its rivals.
// Each one unlocks at a Toll Naka and stays for the rest of the game.

export type PabandiKind = 'word' | 'letter' | 'voice' | 'body' | 'after' | 'limit' | 'guessers'

export interface PabandiCard {
  id: string
  kind: PabandiKind
  /** Big text on the stamp. */
  title: string
  /** The rule, in one plain sentence. */
  rule: string
}

export const KIND_META: Record<PabandiKind, { label: string; color: string; ink: string; judgedBy: string }> = {
  word: { label: 'Banned word', color: '#231815', ink: '#F7ECD5', judgedBy: 'Seeti team listens' },
  letter: { label: 'Banned letter', color: '#0E6C6A', ink: '#F7ECD5', judgedBy: 'Seeti team listens' },
  voice: { label: 'Talk like', color: '#7B3FA0', ink: '#F7ECD5', judgedBy: 'Seeti team judges' },
  body: { label: 'While talking', color: '#E0457B', ink: '#231815', judgedBy: 'Seeti team watches' },
  after: { label: 'After every correct guess', color: '#F5B820', ink: '#231815', judgedBy: 'Seeti team watches' },
  limit: { label: 'Clue rule', color: '#C8242B', ink: '#F7ECD5', judgedBy: 'Seeti team listens' },
  guessers: { label: 'For the guessers', color: '#8DBA2E', ink: '#231815', judgedBy: 'Seeti team watches' },
}

const word = (id: string, w: string, extra = ''): PabandiCard => ({
  id: `w-${id}`, kind: 'word', title: w, rule: `You can't say "${w}"${extra}. Slip = seeti.`,
})
const letter = (l: string): PabandiCard => ({
  id: `l-${l}`, kind: 'letter', title: l, rule: `No words starting with "${l}". Not even "${l}…umm".`,
})

export const PABANDI: PabandiCard[] = [
  // Banned words: small words you use without noticing.
  word('the', 'THE'),
  word('it', 'IT'),
  word('is', 'IS', ' (or "are")'),
  word('you', 'YOU'),
  word('and', 'AND'),
  word('like', 'LIKE'),
  word('thing', 'THING', ' (or "something")'),
  word('this', 'THIS', ' (or "that")'),
  word('not', 'NO', ' (or "not")'),
  word('what', 'WHAT'),
  word('very', 'VERY'),
  word('can', 'CAN'),
  word('have', 'HAVE', ' (or "has")'),
  word('one', 'ONE'),
  word('person', 'PERSON', ' (or "guy")'),
  word('big', 'BIG', ' (or "small")'),
  word('good', 'GOOD', ' (or "bad")'),
  word('when', 'WHEN', ' (or "where")'),
  { id: 'w-numbers', kind: 'word', title: 'NO NUMBERS', rule: 'No numbers at all. Not one, not a dozen, not "double".' },
  { id: 'w-colours', kind: 'word', title: 'NO COLOURS', rule: 'No colour words. Red, green, golden: all seeti.' },
  { id: 'w-names', kind: 'word', title: 'NO NAMES', rule: 'No names of people, films, brands or places.' },
  { id: 'w-food', kind: 'word', title: 'NO FOOD', rule: 'You can’t name any food or drink. Yes, chai counts.' },
  { id: 'w-animals', kind: 'word', title: 'NO ANIMALS', rule: 'You can’t name any animal, bird or insect.' },
  { id: 'w-english', kind: 'word', title: 'NO ENGLISH', rule: 'Clue only in Hindi, Marathi or your mother tongue.' },
  { id: 'w-hindi', kind: 'word', title: 'ENGLISH ONLY', rule: 'Pure English only. One desi word = seeti.' },

  // Banned letters.
  letter('S'), letter('T'), letter('A'), letter('M'), letter('P'), letter('B'), letter('C'), letter('W'),
  { id: 'l-ing', kind: 'letter', title: 'NO -ING', rule: 'No words ending in "-ing". Running, eating, describing: seeti.' },
  { id: 'l-short', kind: 'letter', title: 'SHORT WORDS', rule: 'Every word must be 6 letters or fewer.' },

  // Talk like…
  { id: 'v-anchor', kind: 'voice', title: 'News anchor', rule: 'Shout every clue like breaking news on a prime-time debate.' },
  { id: 'v-commentator', kind: 'voice', title: 'Cricket commentator', rule: 'Describe like the last over of a World Cup final.' },
  { id: 'v-villain', kind: 'voice', title: 'Filmy villain', rule: 'Slow, evil, dramatic. End every sentence with an evil laugh.' },
  { id: 'v-robot', kind: 'voice', title: 'Robot', rule: 'Flat robot voice. No emotion. Beep between sentences.' },
  { id: 'v-whisper', kind: 'voice', title: 'Whisper', rule: 'Whisper everything. Talk normally = seeti.' },
  { id: 'v-opera', kind: 'voice', title: 'Opera singer', rule: 'Sing every clue like an opera. Big vibrato.' },
  { id: 'v-gps', kind: 'voice', title: 'GPS voice', rule: 'Talk like Google Maps: "In 200 metres, think of something round."' },
  { id: 'v-dad', kind: 'voice', title: 'Dad’s voice note', rule: 'Talk like your dad’s WhatsApp voice note. Too loud, too close.' },
  { id: 'v-principal', kind: 'voice', title: 'Strict principal', rule: 'Every clue is a scolding. "Who told you to guess like that?"' },
  { id: 'v-rj', kind: 'voice', title: 'Radio jockey', rule: 'Super-energetic morning RJ. Every clue gets a jingle.' },
  { id: 'v-british', kind: 'voice', title: 'Posh British', rule: 'Fake posh British accent. Very proper. Terribly sorry.' },
  { id: 'v-laddoo', kind: 'voice', title: 'Mouth full', rule: 'Talk like your mouth is full of laddoo. Cheeks puffed.' },
  { id: 'v-horror', kind: 'voice', title: 'Horror narrator', rule: 'Slow, scary, spooky. Every clue is a ghost story.' },
  { id: 'v-auctioneer', kind: 'voice', title: 'Auctioneer', rule: 'Talk as fast as possible, like selling at an auction.' },
  { id: 'v-slowmo', kind: 'voice', title: 'Slow motion', rule: 'Speak in slooow mooootion. Every. Single. Word.' },
  { id: 'v-baby', kind: 'voice', title: 'Baby talk', rule: 'Talk like a toddler. Cute voice, simple words.' },
  { id: 'v-ad', kind: 'voice', title: 'TV ad', rule: 'Every clue is a TV ad. "Kya aap bhi…?" energy.' },
  { id: 'v-groom', kind: 'voice', title: 'Nervous groom', rule: 'Shaky voice, sweating, like giving a speech at your own sangeet.' },
  { id: 'v-yoga', kind: 'voice', title: 'Yoga teacher', rule: 'Calm and breathy. Breathe in… breathe out… between clues.' },
  { id: 'v-tour', kind: 'voice', title: 'Tour guide', rule: 'Every clue starts with "Ladies and gentlemen, on your left…"' },

  // While talking (body).
  { id: 'b-lean', kind: 'body', title: 'Lean sideways', rule: 'Lean sideways as far as you can while you talk.' },
  { id: 'b-leg', kind: 'body', title: 'One leg', rule: 'Stand on one leg. Foot down = seeti.' },
  { id: 'b-hands', kind: 'body', title: 'Hands behind back', rule: 'Hands stay behind your back. No gestures at all.' },
  { id: 'b-nose', kind: 'body', title: 'Hold your nose', rule: 'Pinch your nose shut while describing.' },
  { id: 'b-eyes', kind: 'body', title: 'Eyes shut', rule: 'Keep your eyes closed the whole turn.' },
  { id: 'b-floor', kind: 'body', title: 'Sit on the floor', rule: 'Describe while sitting cross-legged on the floor.' },
  { id: 'b-chai', kind: 'body', title: 'Pinky up', rule: 'Hold an imaginary chai cup, pinky up, the whole time.' },
  { id: 'b-arms', kind: 'body', title: 'Arms up', rule: 'Both arms up in the air, like your team just won.' },
  { id: 'b-ears', kind: 'body', title: 'Kaan pakdo', rule: 'Hold your ears like you are saying sorry to a teacher.' },
  { id: 'b-straight', kind: 'body', title: 'Straight face', rule: 'No smiling, no laughing. Even a grin = seeti.' },
  { id: 'b-march', kind: 'body', title: 'March', rule: 'March on the spot like a parade while you describe.' },
  { id: 'b-away', kind: 'body', title: 'Back turned', rule: 'Turn your back to your team while describing.' },
  { id: 'b-naagin', kind: 'body', title: 'Naagin hands', rule: 'Keep your hands in the naagin-dance pose.' },
  { id: 'b-statue', kind: 'body', title: 'Statue', rule: 'Freeze like a statue. Only your mouth moves.' },
  { id: 'b-tiptoe', kind: 'body', title: 'Tiptoe', rule: 'Stay on your tiptoes. Heels down = seeti.' },
  { id: 'b-squat', kind: 'body', title: 'Half squat', rule: 'Hold a half squat, like an invisible chair.' },
  { id: 'b-salute', kind: 'body', title: 'Salute', rule: 'Keep one hand in a salute the whole turn.' },
  { id: 'b-tongue', kind: 'body', title: 'Tongue out', rule: 'Tongue touching your lower lip while you talk.' },

  // After every correct guess.
  { id: 'a-seat', kind: 'after', title: 'Swap seats', rule: 'Swap seats with a teammate after every correct guess.' },
  { id: 'a-clap', kind: 'after', title: 'Clap feet', rule: 'Clap your feet together after every correct guess.' },
  { id: 'a-pose', kind: 'after', title: 'Bollywood pose', rule: 'Strike an arms-wide Bollywood pose after every correct guess.' },
  { id: 'a-jaiho', kind: 'after', title: 'Jai Ho!', rule: 'Shout "Jai Ho!" after every correct guess.' },
  { id: 'a-bhangra', kind: 'after', title: 'Bhangra', rule: 'Two seconds of bhangra shoulders after every correct guess.' },
  { id: 'a-spin', kind: 'after', title: 'Spin', rule: 'Spin around once after every correct guess.' },
  { id: 'a-floor', kind: 'after', title: 'Touch the floor', rule: 'Touch the floor after every correct guess.' },
  { id: 'a-award', kind: 'after', title: 'Award speech', rule: 'Say "Thank you, thank you, I’d like to thank my mother" after every correct guess.' },
  { id: 'a-slurp', kind: 'after', title: 'Chai slurp', rule: 'Pretend to sip chai with a loud slurp after every correct guess.' },
  { id: 'a-bow', kind: 'after', title: 'Magician bow', rule: 'Take a deep magician’s bow after every correct guess.' },
  { id: 'a-hair', kind: 'after', title: 'Hair flip', rule: 'Do a dramatic shampoo-ad hair flip after every correct guess.' },
  { id: 'a-honk', kind: 'after', title: 'Truck horn', rule: 'Honk "Pom pom!" like a truck after every correct guess.' },
  { id: 'a-hifive', kind: 'after', title: 'High-five rivals', rule: 'High-five someone on the rival team after every correct guess.' },
  { id: 'a-rooster', kind: 'after', title: 'Rooster', rule: 'Crow like a rooster after every correct guess.' },
  { id: 'a-selfie', kind: 'after', title: 'Selfie face', rule: 'Pull a pouty selfie face with a V sign after every correct guess.' },

  // Clue rules.
  { id: 'c-three', kind: 'limit', title: '3 words max', rule: 'Every sentence is three words or fewer.' },
  { id: 'c-questions', kind: 'limit', title: 'Only questions', rule: 'Every clue must be a question. "Is it round? Do you eat it?"' },
  { id: 'c-ji', kind: 'limit', title: 'Add "ji"', rule: 'End every sentence with "ji". Forget once = seeti.' },
  { id: 'c-bro', kind: 'limit', title: 'Add "bro"', rule: 'End every sentence with "bro".' },
  { id: 'c-breaking', kind: 'limit', title: 'Breaking news', rule: 'Start every clue with "Breaking news:".' },
  { id: 'c-reverse', kind: 'limit', title: 'B first', rule: 'Clue word B first, then word A. Team still answers A then B.' },
  { id: 'c-opposite', kind: 'limit', title: 'Opposites', rule: 'Describe only with opposites. "Not cold, not small…"' },
  { id: 'c-nopoint', kind: 'limit', title: 'No pointing', rule: 'No pointing at anything or anyone in the room.' },
  { id: 'c-rhyme', kind: 'limit', title: 'No rhymes', rule: 'No "rhymes with" or "sounds like" clues.' },
  { id: 'c-food', kind: 'limit', title: 'Food in every clue', rule: 'Every clue must mention some food. Good luck.' },
  { id: 'c-pause', kind: 'limit', title: 'Count to 2', rule: 'Silently count to two before every clue. Rushing = seeti.' },
  { id: 'c-song', kind: 'limit', title: 'Hum first', rule: 'Hum two seconds of any Bollywood song before each new pair.' },

  // For the guessers.
  { id: 'g-hand', kind: 'guessers', title: 'Raise hands', rule: 'Guessers must raise a hand before every guess.' },
  { id: 'g-whisper', kind: 'guessers', title: 'Whisper guesses', rule: 'Guessers can only whisper their guesses.' },
  { id: 'g-isit', kind: 'guessers', title: '"Is it…?"', rule: 'Every guess must start with "Is it…?"' },
  { id: 'g-sing', kind: 'guessers', title: 'Sing guesses', rule: 'Guessers must sing every guess.' },
  { id: 'g-hands', kind: 'guessers', title: 'Sit on hands', rule: 'Guessers sit on their hands the whole turn.' },
  { id: 'g-captain', kind: 'guessers', title: 'Captain only', rule: 'Only one guesser (the oldest) may say the final answer.' },
  { id: 'g-stand', kind: 'guessers', title: 'Stand to guess', rule: 'Guessers must stand up to guess, then sit back down.' },
]

/** Kinds the seeti team can judge by listening alone. */
export const SPEECH_KINDS: PabandiKind[] = ['word', 'letter', 'limit']
/** Kinds that need people to watch. */
export const PHYSICAL_KINDS: PabandiKind[] = ['body', 'after', 'guessers']
