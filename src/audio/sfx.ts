// Every sound is synthesized with the Web Audio API: no files, works offline.

let ctx: AudioContext | null = null
let muted = false

try { muted = localStorage.getItem('umb-muted') === '1' } catch { /* storage blocked */ }

export const isMuted = () => muted
export function setMuted(m: boolean) {
  muted = m
  try { localStorage.setItem('umb-muted', m ? '1' : '0') } catch { /* storage blocked */ }
}

function audio(): AudioContext | null {
  if (muted) return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** Call from the first tap so iOS lets us play sound later. */
export function unlockAudio() { audio() }

interface ToneOpts {
  type?: OscillatorType
  freq: number
  to?: number
  start?: number
  dur: number
  gain?: number
  attack?: number
}

function tone(ac: AudioContext, out: AudioNode, o: ToneOpts) {
  const t0 = ac.currentTime + (o.start ?? 0)
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(o.freq, t0)
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur)
  const peak = o.gain ?? 0.3
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + (o.attack ?? 0.01))
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur)
  osc.connect(g).connect(out)
  osc.start(t0)
  osc.stop(t0 + o.dur + 0.05)
}

function noise(ac: AudioContext, dur: number): AudioBufferSourceNode {
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buf
  return src
}

function master(ac: AudioContext, level = 0.8) {
  const g = ac.createGain()
  g.gain.value = level
  g.connect(ac.destination)
  return g
}

export const sfx = {
  /** Soft pop for ordinary taps. */
  tap() {
    const ac = audio(); if (!ac) return
    tone(ac, master(ac, 0.5), { type: 'triangle', freq: 660, to: 990, dur: 0.07, gain: 0.25 })
  },

  /** Temple-bell "ding-ding" for a correct combo. */
  sahi() {
    const ac = audio(); if (!ac) return
    const out = master(ac)
    for (const [f, s] of [[1046, 0], [1318, 0.11]] as const) {
      tone(ac, out, { freq: f, start: s, dur: 0.9, gain: 0.32, attack: 0.005 })
      tone(ac, out, { freq: f * 2.76, start: s, dur: 0.35, gain: 0.08, attack: 0.005 })
    }
  },

  /** Pressure-cooker whistle: hissing steam plus a wobbling, rising shriek. */
  seeti() {
    const ac = audio(); if (!ac) return
    const out = master(ac, 0.9)
    const t0 = ac.currentTime
    const dur = 1.5

    const hiss = noise(ac, dur)
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.8
    const hg = ac.createGain()
    hg.gain.setValueAtTime(0.0001, t0)
    hg.gain.exponentialRampToValueAtTime(0.35, t0 + 0.25)
    hg.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    hiss.connect(bp).connect(hg).connect(out)
    hiss.start(t0)

    const whistle = ac.createOscillator()
    whistle.type = 'sine'
    whistle.frequency.setValueAtTime(1500, t0)
    whistle.frequency.exponentialRampToValueAtTime(2600, t0 + 0.4)
    whistle.frequency.setValueAtTime(2600, t0 + 1.1)
    whistle.frequency.exponentialRampToValueAtTime(2100, t0 + dur)
    const lfo = ac.createOscillator()
    const lfoGain = ac.createGain()
    lfo.frequency.value = 9; lfoGain.gain.value = 70
    lfo.connect(lfoGain).connect(whistle.frequency)
    const wg = ac.createGain()
    wg.gain.setValueAtTime(0.0001, t0)
    wg.gain.exponentialRampToValueAtTime(0.28, t0 + 0.3)
    wg.gain.setValueAtTime(0.28, t0 + 1.1)
    wg.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    whistle.connect(wg).connect(out)
    whistle.start(t0); lfo.start(t0)
    whistle.stop(t0 + dur + 0.05); lfo.stop(t0 + dur + 0.05)

    if (navigator.vibrate) navigator.vibrate([120, 60, 220])
  },

  /** Whoosh for a skipped pair. */
  skip() {
    const ac = audio(); if (!ac) return
    const out = master(ac, 0.6)
    const t0 = ac.currentTime
    const src = noise(ac, 0.35)
    const f = ac.createBiquadFilter()
    f.type = 'bandpass'; f.Q.value = 2
    f.frequency.setValueAtTime(400, t0)
    f.frequency.exponentialRampToValueAtTime(4000, t0 + 0.3)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.08)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35)
    src.connect(f).connect(g).connect(out)
    src.start(t0)
  },

  /** Wood-block tick for the last seconds; higher for the final three. */
  tick(urgent = false) {
    const ac = audio(); if (!ac) return
    tone(ac, master(ac, 0.6), { type: 'square', freq: urgent ? 1400 : 950, dur: 0.05, gain: 0.12, attack: 0.002 })
  },

  /** Truck horn "Horn OK Please" when the chai timer runs out. */
  timeUp() {
    const ac = audio(); if (!ac) return
    const out = master(ac, 0.7)
    const lp = ac.createBiquadFilter()
    lp.type = 'lowpass'; lp.frequency.value = 1800
    lp.connect(out)
    for (const [s, d] of [[0, 0.28], [0.36, 0.55]] as const) {
      tone(ac, lp, { type: 'sawtooth', freq: 349, start: s, dur: d, gain: 0.22, attack: 0.02 })
      tone(ac, lp, { type: 'sawtooth', freq: 440, start: s, dur: d, gain: 0.18, attack: 0.02 })
    }
  },

  /** Drum roll, then a rubber-stamp thud for a Toll Naka reveal. */
  toll() {
    const ac = audio(); if (!ac) return
    const out = master(ac, 0.8)
    for (let i = 0; i < 14; i++) {
      const t = i * 0.05
      const src = noise(ac, 0.05)
      const g = ac.createGain()
      const f = ac.createBiquadFilter()
      f.type = 'highpass'; f.frequency.value = 900
      g.gain.setValueAtTime(0.05 + i * 0.015, ac.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + 0.05)
      src.connect(f).connect(g).connect(out)
      src.start(ac.currentTime + t)
    }
    tone(ac, out, { freq: 160, to: 45, start: 0.75, dur: 0.35, gain: 0.7, attack: 0.003 })
    const thud = noise(ac, 0.12)
    const tg = ac.createGain()
    tg.gain.setValueAtTime(0.4, ac.currentTime + 0.75)
    tg.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.87)
    thud.connect(tg).connect(out)
    thud.start(ac.currentTime + 0.75)
  },

  /** Rising "pa-pa-pa-paa" fanfare with dhol hits for the winner. */
  win() {
    const ac = audio(); if (!ac) return
    const out = master(ac, 0.7)
    const notes = [523, 659, 784, 1046, 784, 1046, 1318]
    notes.forEach((f, i) => {
      const long = i === notes.length - 1
      tone(ac, out, { type: 'triangle', freq: f, start: i * 0.13, dur: long ? 1.1 : 0.16, gain: 0.3 })
      tone(ac, out, { type: 'sine', freq: f / 2, start: i * 0.13, dur: long ? 1.1 : 0.16, gain: 0.12 })
    })
    for (let i = 0; i < 6; i++) tone(ac, out, { freq: 110, to: 50, start: i * 0.26, dur: 0.22, gain: 0.6, attack: 0.003 })
  },

  /** Tiny rewind for undo. */
  undo() {
    const ac = audio(); if (!ac) return
    tone(ac, master(ac, 0.5), { type: 'triangle', freq: 900, to: 400, dur: 0.18, gain: 0.25 })
  },

  /** Three rising beeps before the clock starts. */
  go() {
    const ac = audio(); if (!ac) return
    const out = master(ac, 0.6)
    tone(ac, out, { type: 'square', freq: 660, start: 0, dur: 0.1, gain: 0.12 })
    tone(ac, out, { type: 'square', freq: 660, start: 0.18, dur: 0.1, gain: 0.12 })
    tone(ac, out, { type: 'square', freq: 990, start: 0.36, dur: 0.22, gain: 0.14 })
  },
}
