// Sparky's voice: plays pre-rendered clips from the voice service and drives his mouth from the
// clip's lip-sync track (useMouth, 0..1). Falls back to the browser's own speech voice
// when a clip is missing (e.g. a brand-new project), with a simple flap for the mouth.
import { useSyncExternalStore } from 'react'
import { VOICE_URL } from './services.js'
export { clipName } from './clipName.js'

let lips // { step: ms per level, clips: { name: '0012456320...' } }
fetch(`${VOICE_URL}/lips.json`).then((r) => r.json()).then((j) => { lips = j }).catch(() => {})

// Mouth openness 0..1, read by the Mascot through useMouth().
let level = 0
const subs = new Set()
const mouth = (v) => { level = v; subs.forEach((f) => f()) }
export const useMouth = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => level)
const talking = (on) => document.body.classList.toggle('talking', on)

let player, timer, flap
export function stop() {
  player?.pause()
  player = null
  clearInterval(timer)
  clearInterval(flap)
  window.speechSynthesis?.cancel()
  mouth(0)
  talking(false)
}

// Plays each {name, text} in turn, then calls done().
export function say(clips, on, done) {
  stop()
  if (!on) return
  if (!clips.length) return done?.()
  const [{ name, text }, ...rest] = clips
  talking(true)
  const me = (player = new Audio(`${VOICE_URL}/${name}.m4a`))
  const track = lips?.clips[name]
  // A timer at the track's own resolution (40 ms); the SVG's transition smooths between levels.
  const tick = () => {
    const level = +track[Math.floor((me.currentTime * 1000) / lips.step)] || 0
    mouth(level ? 0.3 + (0.55 * level) / 9 : 0) // speaking frames open between 30% and 85%, never wide
  }
  me.onplay = () => { if (track) timer = setInterval(tick, lips.step) }
  me.onended = () => say(rest, on, done)
  me.onerror = () => {
    if (!('speechSynthesis' in window)) return stop()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9; u.pitch = 1.2
    flap = setInterval(() => mouth(0.2 + Math.random() * 0.7), 110)
    u.onend = () => say(rest, on, done)
    speechSynthesis.speak(u)
  }
  // Browsers block sound until the first tap on a freshly loaded page: retry on that tap.
  me.play().catch(() => addEventListener('pointerdown', () => { if (player === me) me.play().catch(() => {}) }, { once: true }))
}
