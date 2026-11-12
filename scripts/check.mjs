// Sanity check for the content service. Run with: npm test
import assert from 'node:assert/strict'
import PARTS from '../services/content/parts.json' with { type: 'json' }
import PROJECTS from '../services/content/projects.json' with { type: 'json' }
import { GRID } from '../src/grid.js'

assert.equal(PROJECTS.length, 25, 'expected 25 projects')
assert.equal(new Set(PROJECTS.map((p) => p.id)).size, 25, 'project ids must be unique')
for (const p of PROJECTS) {
  assert.ok(p.title && p.emoji && [1, 2, 3].includes(p.level), `project ${p.id} needs title, emoji, level 1-3`)
  assert.ok(p.steps.at(-1).go, `project ${p.id}: last step must be { go: true }`)
  for (const [n, s] of p.steps.entries()) {
    assert.ok(s.say, `project ${p.id} step ${n + 1}: missing say`)
    for (const pc of s.add || []) {
      const part = PARTS[pc.p]
      assert.ok(part, `project ${p.id} step ${n + 1}: unknown part ${pc.p}`)
      const w = pc.v ? part.tall || 1 : part.len, h = pc.v ? part.len : part.tall || 1
      assert.ok(pc.x >= 0 && pc.y >= 0 && pc.x + w <= GRID.cols && pc.y + h <= GRID.rows,
        `project ${p.id} step ${n + 1}: ${pc.p} at (${pc.x},${pc.y}) is off the board`)
    }
  }
}
for (const [k, p] of Object.entries(PARTS)) assert.ok(p.what && p.why && p.how && p.len, `part ${k} needs what/why/how/len`)
console.log(`OK: ${PROJECTS.length} projects, ${Object.keys(PARTS).length} parts`)
