import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/shamallya/components/button'
import { IconToggle } from '@/shamallya/components/icon-toggle'
import { PushedHeader } from '@/shamallya/components/pushed-header'
import { ScreenHeader } from '@/shamallya/components/screen-header'
import { SectionHeading } from '@/shamallya/components/section-heading'
import { Caption } from '@/shamallya/components/caption'
import { SpeechBubble } from '@/shamallya/components/speech-bubble'
import { Mascot } from '@/shamallya/components/mascot'
import { BottomActionBar } from '@/shamallya/components/bottom-action-bar'
import { TileCard } from '@/shamallya/components/tile-card'
import { GlossaryCard } from '@/shamallya/components/glossary-card'
import { SafetyNotice } from '@/shamallya/components/safety-notice'
import { ProgressDots } from '@/shamallya/components/progress-dots'
import { AnnounceProvider, useAnnounce } from '@/shamallya/components/announce'
import Board from './Board.jsx'
import { CONTENT_URL, SPARKY_URL, PARTS_URL } from './services.js'
import { say, stop, clipName, partSpeech, useMouth } from './voice.js'

const ls = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

function useHash() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const f = () => setHash(location.hash)
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return hash
}

// Projects and parts come from the content service at runtime, so editing a project deploys
// without an app release.
function useContent() {
  const [content, setContent] = useState(null)
  useEffect(() => {
    Promise.all(['projects', 'parts'].map((n) => fetch(`${CONTENT_URL}/${n}.json`).then((r) => r.json())))
      .then(([projects, parts]) => setContent({ projects, parts }))
      .catch(() => setContent({ error: true }))
  }, [])
  return content
}

let audio
function click() {
  try {
    audio ||= new AudioContext()
    const o = audio.createOscillator(), g = audio.createGain()
    o.frequency.value = 660; g.gain.value = 0.15
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12)
    o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + 0.12)
  } catch {}
}

function bark() {
  try {
    audio ||= new AudioContext()
    for (const t of [0, 0.16]) {
      const o = audio.createOscillator(), g = audio.createGain(), at = audio.currentTime + t
      o.type = 'triangle'; o.frequency.setValueAtTime(420, at); o.frequency.exponentialRampToValueAtTime(220, at + 0.1)
      g.gain.setValueAtTime(0.12, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.12)
      o.connect(g).connect(audio.destination); o.start(at); o.stop(at + 0.13)
    }
  } catch {}
}

// Project difficulty from how many pieces it uses (wires do not count).
const TAGS = ['Starter', 'Explorer', 'Builder', 'Inventor']
const level = (p) => {
  const n = p.steps.flatMap((s) => s.add || []).filter((c) => !c.p.startsWith('W')).length
  return TAGS[n <= 3 ? 0 : n <= 7 ? 1 : n <= 14 ? 2 : 3]
}

export default function App() {
  const hash = useHash()
  const content = useContent()
  useEffect(() => stop, [hash])
  if (!content) return <main className="home"><p>Loading…</p></main>
  if (content.error) return <main className="home"><p>Could not load the projects. Check your connection and try again.</p></main>
  const m = hash.match(/^#p\/(\d+)(\/go)?$/)
  const project = m && content.projects.find((p) => p.id === +m[1])
  return (
    <AnnounceProvider>
      {project && m[2] ? <Project key={project.id} project={project} parts={content.parts} />
        : project ? <Needs project={project} parts={content.parts} />
        : hash === '#parts' ? <Parts parts={content.parts} />
        : <Home projects={content.projects} />}
    </AnnounceProvider>
  )
}

const LEGAL = 'Not affiliated with or endorsed by Elenco Electronics, Inc. Snap Circuits is a registered trademark of Elenco Electronics, Inc. Grown-up supervision required. Use at your own risk.'

function Home({ projects }) {
  const done = ls.get('done', [])
  return (
    <>
      <div className="brand">
        <img src={`${SPARKY_URL}/sparky-bandana.svg`} alt="" width="72" height="72" />
        <ScreenHeader title="Sparky's Snap Lab" eyebrow="Snap circuit projects for kids" />
      </div>
      <main className="home with-footer">
        <div className="row">
          <Button variant="outline" href="#parts">Meet the Pieces</Button>
          <SafetyNotice label="Safety Rules">
            <ul>
              <li>Ask a grown-up to help.</li>
              <li>Never join the battery + and − with only wires. It gets hot!</li>
              <li>Keep fingers, hair and faces away from the spinning fan.</li>
              <li>Turn the switch OFF when you are done.</li>
            </ul>
          </SafetyNotice>
        </div>
        <SectionHeading>{projects.length} projects</SectionHeading>
        <div className="cards">
          {projects.map((p) => (
            <TileCard key={p.id} href={`#p/${p.id}`} emoji={p.emoji} title={p.title}
              marks={<><span className="tag">{level(p)}</span>{done.includes(p.id) && <span aria-label="Done">⭐</span>}</>} />
          ))}
        </div>
      </main>
      <footer className="legal"><Caption variant="prose">{LEGAL}</Caption></footer>
    </>
  )
}

// Pictures of the real kit pieces (public/parts). Pieces without one (music, alarm and space chips) keep their emoji.
const HAS_IMG = new Set('W2 W3 W4 W5 B1 S1 S2 L1 D1 D2 M1 SP WC R1 R4 RV RP C4 Q2'.split(' '))

const card = (p) => <GlossaryCard key={p.id} emoji={p.emoji} imgSrc={HAS_IMG.has(p.id) ? `${PARTS_URL}/${p.id}.png` : undefined} name={p.name} id={p.id} what={p.what} why={p.why} how={p.how} />

function Parts({ parts }) {
  return (
    <>
      <PushedHeader back={{ origin: 'Home', href: '#' }} title="Meet the Pieces" meta="What each piece is, why it is used and how to use it" />
      <main className="home list">{Object.values(parts).map(card)}</main>
    </>
  )
}

function useVoice() {
  const [voice, setVoice] = useState(() => ls.get('voice', true))
  const toggle = () => { ls.set('voice', !voice); setVoice(!voice); if (voice) stop() }
  return [voice, toggle]
}

const muteToggle = (voice, toggle) => (
  <IconToggle pressed={!voice} onPressedChange={toggle} icon={<Volume2 />} pressedIcon={<VolumeX />}
    label="Mute Sparky" pressedLabel="Unmute Sparky" />
)

// "Things you need": every piece the project uses, with how many. Tap a piece and Sparky explains it.
function Needs({ project, parts }) {
  const [voice, toggle] = useVoice()
  const [picked, setPicked] = useState(null)
  const [talking, setTalking] = useState(false)
  const count = {}
  for (const s of project.steps) for (const pc of s.add || []) count[pc.p] = (count[pc.p] || 0) + 1
  const keys = Object.keys(count).sort((a, b) => (a[0] === 'W') - (b[0] === 'W'))
  const part = picked && parts[picked]
  const speech = part && { name: clipName(picked), text: partSpeech(part) }
  const play = () => { setTalking(true); say([speech], voice, () => setTalking(false)) }
  const pause = () => { stop(); setTalking(false) }
  // Sparky stops when another piece is picked, when the user taps anything else, and on leaving the page.
  useEffect(() => { stop(); setTalking(false) }, [picked])
  useEffect(() => stop, [])
  useEffect(() => {
    if (!talking) return
    const off = (e) => { if (!e.target.closest?.('[data-speak]')) pause() }
    document.addEventListener('click', off, true)
    return () => document.removeEventListener('click', off, true)
  }, [talking])
  return (
    <>
      <PushedHeader back={{ origin: 'Home', href: '#' }} title={`${project.emoji} ${project.title}`} meta="Things you need"
        trailing={muteToggle(voice, toggle)} />
      <main className="home needs-page">
        <ul className="needs">
          {keys.map((k) => (
            <li key={k}>
              <button type="button" className="need" aria-pressed={picked === k} onClick={() => setPicked(picked === k ? null : k)}>
                {HAS_IMG.has(k)
                  ? <img className="piece-img" src={`${PARTS_URL}/${k}.png`} alt="" loading="lazy" />
                  : <span className="big-emoji" aria-hidden="true">{parts[k].emoji}</span>}
                <span>{parts[k].name}</span>
                <b>× {count[k]}</b>
              </button>
            </li>
          ))}
        </ul>
        <section className="stage">
          <Sparky hidden={!voice} />
          <div className="dialogs">
            <SpeechBubble variant="info" tail={voice}>
              {part ? (
                <>
                  <b>{part.emoji} {part.name}</b>
                  <br />{part.what} {part.why} {part.how}
                  {voice && (
                    <div data-speak className="mt-2">
                      {talking
                        ? <Button variant="outline" leadingIcon={<Pause />} onClick={pause}>Pause</Button>
                        : <Button variant="primary" leadingIcon={<Play />} onClick={play}>Play</Button>}
                    </div>
                  )}
                </>
              ) : 'Tap a piece and I will tell you all about it!'}
            </SpeechBubble>
            {count.B1 && <Caption variant="prose">The battery holder needs 2 AA batteries inside.</Caption>}
            <Button variant="primary" size="kid" fullWidth href={`#p/${project.id}/go`} className="start">Let's build!</Button>
          </div>
        </section>
      </main>
    </>
  )
}

// Sparky. Tap him: he hops, spins or wiggles, barks and says a little word.
const MOVES = [
  [{ transform: 'translateY(0)' }, { transform: 'translateY(-24px)' }, { transform: 'translateY(0)' }],
  [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }],
  [{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(0)' }],
]
const WORDS = ['Woof!', 'Arf arf!', 'Yip yip!', 'Wag wag!', 'Hi friend!', "Let's snap!"]

function Sparky({ hidden, celebrate }) {
  const el = useRef(null)
  const [word, setWord] = useState(null)
  const mouth = useMouth()
  if (hidden) return null
  const poke = () => {
    el.current?.animate(MOVES[Math.floor(Math.random() * MOVES.length)], { duration: 700, easing: 'ease-in-out' })
    bark()
    setWord({ n: Date.now(), t: WORDS[Math.floor(Math.random() * WORDS.length)] })
  }
  return (
    <button type="button" className="sparky-btn" aria-label="Pet Sparky" onClick={poke}>
      <span ref={el} className={`sparky-body${celebrate ? ' hop' : ''}`}>
        <Mascot className="mascot" src={`${SPARKY_URL}/sparky-bandana.svg`} mouth={mouth} />
      </span>
      {word && <span key={word.n} className="burst" aria-hidden="true">{word.t}</span>}
    </button>
  )
}

// Confetti that falls once when the last step shows. Decorative; hidden for prefers-reduced-motion in CSS.
const Celebrate = () => (
  <div className="celebrate" aria-hidden="true">
    {Array.from({ length: 16 }, (_, n) => <i key={n} />)}
  </div>
)

function Project({ project, parts }) {
  const steps = project.steps
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const [voice, toggleVoice] = useVoice()
  const announce = useAnnounce()
  const step = steps[i]
  const last = i === steps.length - 1
  const pieces = useMemo(() => steps.slice(0, i + 1).flatMap((s) => s.add || []), [steps, i])
  const first = useRef(true)
  const playRef = useRef(play); playRef.current = play
  const next = () => setI((n) => Math.min(n + 1, steps.length - 1))

  useEffect(() => {
    if (first.current) { first.current = false } else click()
    announce(step.say)
    if (last) ls.set('done', [...new Set([...ls.get('done', []), project.id])])
  }, [i]) // eslint-disable-line

  // Sparky speaks only while Play is on. Pause cuts him off; Back and Next by hand are silent.
  useEffect(() => {
    if (!play) return stop()
    if (!voice) { // muted: Play just advances on a timer
      const t = setInterval(() => (last ? setPlay(false) : next()), 4500)
      return () => clearInterval(t)
    }
    say([{ name: clipName(project, i), text: step.say }], true,
      () => (last ? setPlay(false) : setTimeout(() => playRef.current && next(), 800)))
  }, [i, play, voice]) // eslint-disable-line

  const goto = (n) => { setPlay(false); setI(n) }

  return (
    <>
      <PushedHeader back={{ origin: 'Things you need', href: `#p/${project.id}` }} title={`${project.emoji} ${project.title}`}
        meta={<ProgressDots current={i + 1} total={steps.length} className="mt-1 flex-wrap" />}
        trailing={muteToggle(voice, toggleVoice)} />
      <main className="project">
        {last && <Celebrate />}
        <Board pieces={pieces} fresh={step.add || []} live={last} parts={parts} />
        <section className="stage">
          <Sparky hidden={!voice} celebrate={last} />
          <div className="dialogs">
            <SpeechBubble variant={last ? 'party' : 'say'} tail={voice}>{step.say}</SpeechBubble>
            {last && <p className="yay">🎉 You did it! ⭐</p>}
          </div>
        </section>
      </main>
      <BottomActionBar label="Project steps"
        start={i > 0 && <Button variant="outline" size="kid" leadingIcon={<ArrowLeft />} onClick={() => goto(i - 1)}>Back</Button>}
        center={!last && <Button variant="outline" size="kid" leadingIcon={play ? <Pause /> : <Play />} onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</Button>}
        end={last ? <Button variant="primary" size="kid" href="#">More!</Button> : <Button variant="primary" size="kid" onClick={() => goto(i + 1)}>Next</Button>} />
    </>
  )
}
