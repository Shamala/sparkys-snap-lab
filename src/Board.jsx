import { GRID } from './grid.js'

const { cols, rows, unit } = GRID
const c = (i) => unit / 2 + i * unit // post index -> pixel center
const isWire = (pc) => pc.p.startsWith('W')

// Draws the snap board. pieces = everything placed so far, fresh = pieces placed this step
// (they bounce in), live = true on the last step (lamps glow, fans spin, speakers sing).
// Wires are drawn thin and last so the pieces under them stay visible.
export default function Board({ pieces, fresh, live, parts }) {
  const last = fresh[fresh.length - 1]
  const ordered = [...pieces.filter((p) => !isWire(p)), ...pieces.filter(isWire)]
  return (
    <svg className="board" viewBox={`0 0 ${cols * unit} ${rows * unit}`} role="img" aria-label="Snap board">
      {Array.from({ length: cols * rows }, (_, i) => (
        <circle key={i} cx={c(i % cols)} cy={c(Math.floor(i / cols))} r="7" className="post" />
      ))}
      {ordered.map((pc, i) => <Piece key={i} pc={pc} part={parts[pc.p]} fresh={fresh.includes(pc)} live={live} />)}
      {ordered.map((pc, i) => <Marks key={i} pc={pc} part={parts[pc.p]} />)}
      {last && !live && (
        <text className="hand" x="0" y="0" style={{ transform: `translate(${c(last.x) + 30}px, ${c(last.y) + 40}px)` }}>👆</text>
      )}
    </svg>
  )
}

function box(pc, part) {
  const w = pc.v ? (part.tall || 1) : part.len
  const h = pc.v ? part.len : (part.tall || 1)
  const pad = isWire(pc) ? 11 : 22 // half the piece width
  return { part, w, h, x1: c(pc.x) - pad, y1: c(pc.y) - pad, x2: c(pc.x + w - 1) + pad, y2: c(pc.y + h - 1) + pad }
}

function Piece({ pc, part, fresh, live }) {
  const { x1, y1, x2, y2 } = box(pc, part)
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2
  const big = part.tall > 1
  const on = live && part.on
  return (
    <g className={`piece ${fresh ? 'snap' : ''} ${on ? 'on-' + part.on : ''}`} style={{ '--glow': part.onColor || '#fff' }}>
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx="14" fill={part.color} className="body" />
      {isWire(pc)
        ? <text x={cx} y={cy + 5} className="label">{part.id}</text>
        : <>
            <text x={cx} y={cy - (big ? 4 : 6)} className={`emoji ${big ? 'big' : ''}`}>{part.emoji}</text>
            <text x={cx} y={cy + (big ? 20 : 15)} className="label">{part.id}</text>
          </>}
      {on === 'music' && <text x={x2 + 4} y={y1 + 10} className="note">🎵</text>}
    </g>
  )
}

// + signs and chip pin letters, drawn above everything so wires never hide them.
function Marks({ pc, part }) {
  const { w, h } = box(pc, part)
  const plusAt = pc.flip ? [pc.x + w - 1, pc.y + h - 1] : [pc.x, pc.y]
  return (
    <g className="marks">
      {part.plus && <text x={c(plusAt[0])} y={c(plusAt[1]) + 5} className="plus">+</text>}
      {part.pins && Object.entries(part.pins).map(([name, [px, py]]) => (
        <text key={name} x={c(pc.x + px)} y={c(pc.y + py) + 5} className="pin">{name}</text>
      ))}
    </g>
  )
}
