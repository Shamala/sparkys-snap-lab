// Builds the voice service (services/voice): one clip per sentence Sparky says, rendered with
// Kokoro-82M (a small neural text-to-speech model) so phones never download the model, plus
// lips.json, a lip-sync track per clip read from the clip's own loudness. Run with: npm run voice
// Needs ffmpeg on the PATH. Only missing clips are rendered; lips.json is rebuilt every time.
// The first run downloads the ~90 MB model once into the npm cache.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import PROJECTS from '../services/content/projects.json' with { type: 'json' }
import PARTS from '../services/content/parts.json' with { type: 'json' }
import { clipName, partSpeech } from '../src/clipName.js'

const OUT = 'services/voice'
const LOUD = 'loudnorm=I=-20.5:TP=-3:LRA=11' // calm speech loudness: -16 was a little loud for kids
mkdirSync(OUT, { recursive: true })

const jobs = []
for (const p of PROJECTS) p.steps.forEach((s, i) => jobs.push([clipName(p, i), s.say]))
for (const [key, part] of Object.entries(PARTS)) jobs.push([clipName(key), partSpeech(part)]) // Things you need: Sparky explains a piece
const todo = jobs.filter(([name]) => !existsSync(`${OUT}/${name}.m4a`))
console.log(`${todo.length} clips to render (${jobs.length - todo.length} already done)`)
if (process.argv[2] === '--limit') todo.length = Math.min(todo.length, +process.argv[3])

if (todo.length) {
  const { KokoroTTS } = await import('kokoro-js')
  const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'q8' })
  for (const [name, text] of todo) {
    // Sparky reads "+" and "−" as words; kids hear "plus" and "minus".
    const spoken = text.replace(/\+/g, ' plus ').replace(/−/g, ' minus ').replace(/\.\.\./g, ',')
    const audio = await tts.generate(spoken, { voice: 'af_heart', speed: 0.95 })
    const wav = `${OUT}/${name}.wav`
    await audio.save(wav)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', LOUD, '-c:a', 'aac', '-b:a', '40k', '-ac', '1', `${OUT}/${name}.m4a`])
    rmSync(wav)
    console.log('✓', name, '-', text.slice(0, 50))
  }
}

// Lip-sync track: mouth openness 0-9 every STEP ms, from the loudness of the speech itself.
// Vowels are loud (mouth open), consonants and pauses quiet (mouth closed). ~1 byte per 40 ms.
const STEP = 40, RATE = 8000, WIN = (RATE * STEP) / 1000
const clips = {}
for (const f of readdirSync(OUT).filter((f) => f.endsWith('.m4a')).sort()) {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', `${OUT}/${f}`, '-f', 's16le', '-ac', '1', '-ar', String(RATE), '-'], { maxBuffer: 1 << 26 })
  const samples = new Int16Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.length - (pcm.length % 2)))
  const rms = []
  for (let i = 0; i + WIN <= samples.length; i += WIN) {
    let s = 0
    for (let j = 0; j < WIN; j++) { const v = samples[i + j] / 32768; s += v * v }
    rms.push(Math.sqrt(s / WIN))
  }
  const peak = Math.max(...rms) || 1
  // square root so quieter speech still registers as an open mouth
  clips[f.slice(0, -4)] = rms.map((r) => { const l = Math.round(9 * Math.min(1, Math.sqrt(r / peak) * 1.1)); return l < 2 ? 0 : l }).join('')
}
writeFileSync(`${OUT}/lips.json`, JSON.stringify({ step: STEP, clips }))
console.log(`lips.json: ${Object.keys(clips).length} tracks`)
