# Design: real kit piece pictures on the build board (fix.md item 21)

Status: design only. Nothing under src/ was touched.

## Recommendation: GO-PARTIAL

Draw the real pictures for the 14 strip-shaped pieces: W2 W3 W4 W5 WC S1 S2 D1 D2 M1 R1 R4 RP C4.
Keep the current emoji + colored rectangle for the 5 pieces whose pictures are not strip-shaped: B1, L1, SP, RV, Q2.
Reason: the board box is a thin horizontal strip (2.4:1 to 12:1). Strip pictures drop in with at most a little letterboxing. B1, L1, SP, RV and Q2 are portrait or near-square and would be squashed 2x to 4x, or would overflow into neighbouring cells. Pieces U1-U3 have no picture and stay as-is.

## What Board.jsx draws today

- GRID: 10 cols x 7 rows, unit 60. A post center is at 30 + i*60.
- Box = from first post center minus pad to last post center plus pad. pad is 22 (half piece width) for normal pieces and 11 for wires. `isWire` is `p.startsWith('W')`, so WC is also drawn as a thin wire box. This is probably unintended since WC is a music part; check with the content agent.
- Box width = (len-1)*60 + 2*pad. Box height = (tall-1)*60 + 2*pad. For `pc.v` w and h swap.
- Each piece = `<g class="piece [snap] [on-glow|on-spin|on-music]">` with a `<rect class="body" fill=part.color>`, emoji `<text>`, id label `<text>`, and an optional `🎵` note.
- Marks (+ and pin letters) are a separate pass drawn after all pieces. `plus` sits at the (x,y) post, or at the far end when `pc.flip`. Pin letters are at pc.x+px, pc.y+py.
- Glow is a CSS drop-shadow/brightness animation on `.body`. Spin rotates `.emoji`. Music bounces `.note`.

## Per-piece fit table

Image = public/parts PNG (all RGBA). Box = horizontal board box as above. "Fit-h" = image height if scaled to the box width, keeping aspect. "Stretch" = box aspect / image aspect (1.0 = perfect; far from 1 means distortion if forced to fill).

| Piece | Image px | Img aspect | Box (w x h) | Box aspect | Fit-h | Stretch | Verdict |
|---|---|---|---|---|---|---|---|
| W2 | 240x72 | 3.33 | 82x22 | 3.73 | 25 | 1.12 | fit by width, 3px taller than the box; OK |
| W3 | 360x68 | 5.29 | 142x22 | 6.45 | 27 | 1.22 | fit by width, OK |
| W4 | 360x47 | 7.66 | 202x22 | 9.18 | 26 | 1.20 | fit by width, OK |
| W5 | 360x40 | 9.00 | 262x22 | 11.91 | 29 | 1.32 | fit by width, OK (7px taller) |
| WC | 360x133 | 2.71 | 82x22 | 3.73 | 30 | 1.38 | fit by width, OK; 30px tall is a chunky "wire" |
| S1 | 360x101 | 3.56 | 104x44 | 2.36 | 29 | 0.66 | fit by width, 15px letterbox total |
| S2 | 360x91 | 3.96 | 104x44 | 2.36 | 26 | 0.60 | fit by width, letterbox |
| D1 | 360x98 | 3.67 | 104x44 | 2.36 | 28 | 0.64 | fit by width, letterbox |
| D2 | 360x88 | 4.09 | 104x44 | 2.36 | 25 | 0.58 | fit by width, letterbox |
| M1 | 360x99 | 3.64 | 104x44 | 2.36 | 29 | 0.65 | fit by width, letterbox |
| R1 | 360x108 | 3.33 | 104x44 | 2.36 | 31 | 0.71 | fit by width, letterbox |
| R4 | 360x101 | 3.56 | 104x44 | 2.36 | 29 | 0.66 | fit by width, letterbox |
| RP | 360x101 | 3.56 | 104x44 | 2.36 | 29 | 0.66 | fit by width, letterbox |
| C4 | 360x89 | 4.04 | 104x44 | 2.36 | 26 | 0.58 | fit by width, letterbox |
| L1 | 360x216 | 1.67 | 104x44 | 2.36 | 62 | 1.42 | SKIP: fit-by-width is 62 tall, overflows 18px; fit-by-height is 73 wide, tiny |
| SP | 360x359 | 1.00 | 104x44 | 2.36 | 104 | 2.36 | SKIP: square picture in a strip |
| RV | 360x219 | 1.64 | 164x44 | 3.73 | 100 | 2.27 | SKIP: 100 tall vs 44 box |
| B1 | 303x360 | 0.84 | 164x44 | 3.73 | 195 | 4.43 | SKIP: portrait picture (two batteries side by side), box is 3 wide x 1 tall |
| Q2 | 234x360 | 0.65 | 164x104 | 1.58 | 252 | 2.43 | SKIP: portrait; box is landscape 3x2 |

Notes:
- Fix: never stretch (`preserveAspectRatio="xMidYMid meet"` or explicit width/height from aspect). Distortion of the diode, switch and resistor symbols would look wrong.
- Strip pieces are about 25-31 px tall at fit-by-width, against a 44 px body. Pieces get about 0.6 of today's height, but the picture is far more readable than an emoji. The visible kit eyelets (the round snap rings) sit about 8% in from each end of the picture, but board posts sit 21% in (22/104). The eyelets will be about 14 px off the post centers for 2-snap pieces. Wires end exactly on post centers, so a wire can look slightly off the eyelet. Two ways to handle it:
  - A (recommended, simple): fit to box width, accept the offset.
  - B (exact): measure each picture's eyelet centers once (script, add `eye: [fracL, fracR]` to parts.json) and scale/position so eyelets land on posts. Pieces become smaller (D1 about 73x20 for a 2-snap) with the body visible around them. Only do B if A looks wrong in testing.

## Body rect under the image

Keep the `<rect class="body">` so glow, color and the snap animation keep working. For imaged pieces size the rect to the image rect (box width x fit-h, centered on the piece center), same rx, instead of the full 44 px box. That removes colored bands above and below the picture. Keep the fill = part.color as a base so any transparent PNG corners show a part-colored pill rather than the board.

## Vertical pieces and flip

- Draw the image in the horizontal frame (Lpx x fit-h) centered on the box center (cx, cy), inside a nested group: `<g transform="rotate(R cx cy)">`. Use the SVG attribute, not CSS, so it does not fight the `.piece.snap` CSS animation.
- `pc.v` -> R = 90 (clockwise). The left end of the picture goes to the top, which matches Board's unflipped plus position (pc.x, pc.y), i.e. the top post.
- `pc.flip` -> add 180. So R = (v ? 90 : 0) + (flip ? 180 : 0). Flip is a 180 degree rotation, same as turning the physical part around; mirroring would flip the diode and is wrong.
- The vertical box dims already swap in `box()`. Pass the horizontal length L = (len-1)*60 + 2*pad into the image width, never the vertical box width. In project 1, `W3 v:true` (x:5,y:1) and `B1 flip:true` are the examples; vertical wires W3/W2 are all `v` and need no flip.
- The kit pictures contain their own "+" (D1 has it bottom-left; B1 has "+"/"-" on the left; C4 likely too). The "+" in the picture must be on the same end as Board's plus mark. Verify each of D1 D2 C4 (the three imaged `plus:true` pieces) visually in the build; if a picture's + is on the opposite end, add `imgFlip: true` in parts.json for that part and XOR it with pc.flip.

## Effects (glow / spin / music)

- Glow (D1, D2; L1 skipped): move the `.on-glow` animation from `.body` to the whole piece group: `.on-glow .body, .on-glow .pimg { animation: glow ... }`. Since the image is opaque, the halo comes from the drop-shadow on the image's alpha shape, using `--glow`. Keep brightness(1.3). Because the body rect is the same size as the image rect, the colored under-layer still tints the edges.
- Alternative if the glow looks weak on a red picture: add a `<rect class="tint" fill=var(--glow) opacity=".35">` over the image only while live, pulsing opacity .15 -> .5.
- Spin (M1): do NOT animate the picture (the whole motor would spin). Keep M1's picture static and, while `live`, draw the existing `🌀` emoji (or a small 3-blade SVG fan) over the motor's circle, with the existing `.on-spin .emoji` rotation. Place it at the center of the image. When not live, draw nothing extra (the real picture's fan shows). Check where the motor circle is in M1.png and offset the fan if not centered.
- Music: SP is skipped, WC is imaged (a wire-like piece). The `🎵` note is positioned from box corners (x2+4, y1+10) and is independent of the image; leave it as is. For vertical pieces it still uses the unrotated corners; unchanged behavior.
- Snap-in: `.piece.snap` scales the whole `<g>`; works unchanged as long as the image is inside the same group.

## Layering (+ marks and pin letters)

Unchanged: `Marks` is a separate group drawn after all pieces, so + marks and pin letters stay above images and above wires. The red-outlined `+` is still wanted for kids even though the picture also has a small one. If it looks like a double plus, drop `plus` marks for imaged pieces only (add `showPlus` logic: `part.plus && !hasImg(part)`). Decide after seeing it; my default is KEEP the red mark for D1/D2/C4 because the picture's + is thin.
Q2 and U1-U3 pins stay (they stay on emoji bodies).
Labels: the id label text (e.g. "D1", "2") overlaps the picture, so hide the label and emoji for imaged pieces. Wires: the label number can go too, because length is visible. If the user wants labels, put them in a small `<text>` just under the strip.

## Fallback for pieces without an image

- Source of truth: add `img: true` (or `img: "/parts/D1.png"`) per part in services/content/parts.json, or in Board.jsx use a const `IMG = new Set([...14 ids])`. The set approach needs no content change and works with the content checker; recommended.
- Render: `const useImg = IMG.has(pc.p) && !failed`. If not, render the current emoji/rect code exactly as today.
- Load failure: SVG `<image>` has onError in React; keep a small `useState(false)` in Piece (`failed`) and flip to the emoji fallback in onError. 404s should not leave a blank piece.
- B1/L1/SP/RV/Q2/U1-U3 go through the current code path, so they are never blank.

## Accessibility

- The `<svg>` already has `role="img" aria-label="Snap board"`; with role=img children are presentational, so `alt` on inner `<image>` does nothing for screen readers. Set `aria-hidden="true"` on each `<image>`.
- Improve the svg label to describe the build: `aria-label={"Snap board with " + names.join(", ")}` where names = parts[pc.p].name for placed pieces. Sparky's step text ("say") already speaks the instruction.
- Add `<title>{part.name}</title>` inside each piece group so a mouse hover shows the part name (sighted adults helping).
- Colors: do not rely on body color alone to tell parts apart (it is gone for imaged parts anyway); pictures carry the symbols.
- The Needs page already uses `<img class="piece-img" alt="">` in App.jsx:174; with the part name printed next to it, empty alt is right.

## Performance

- 19 PNGs, 9-31 KB each (about 380 KB total, 360 px max width). A board shows at most about 20 images, with duplicates (many wires) sharing one cached file. No sprite sheet needed.
- Use `<image href="/parts/X.png" decoding="async">`. The browser decodes each distinct file once.
- Images display at 82-262 viewBox units, i.e. at most about 1x of 360 px on a 600 px board; fine on retina (slightly soft on 2x at the largest wires; acceptable).
- Optional: `<link rel="preload" as="image">` is not worth it. Optionally warm the cache by creating `new Image()` for all 14 ids when a project opens, so pieces do not pop in during the bounce animation. Cheap and recommended.
- The glow animation applies `filter` to up to a few images at once; fine.

## SVG sketch (LED, horizontal, unflipped, live)

```jsx
// inside Piece(), for imaged strips
const L = x2 - x1                 // horizontal length in viewBox units
const ar = IMG_ASPECT[pc.p]       // w/h of the png, from a small const table
const ih = L / ar                 // fit-h from the table above
const rot = (pc.v ? 90 : 0) + (pc.flip ? 180 : 0)
// horizontal-frame box centered on (cx, cy); for pc.v use long side = max(x2-x1, y2-y1)
const long = pc.v ? y2 - y1 : x2 - x1
...
<g className={`piece ${fresh ? 'snap' : ''} ${on ? 'on-' + part.on : ''}`} style={{ '--glow': part.onColor || '#fff' }}>
  <title>{part.name}</title>
  <g transform={`rotate(${rot} ${cx} ${cy})`}>
    <rect className="body" x={cx - long / 2} y={cy - ih / 2} width={long} height={ih} rx="10" fill={part.color} />
    <image className="pimg" href={`/parts/${pc.p}.png`} aria-hidden="true" decoding="async"
           x={cx - long / 2} y={cy - ih / 2} width={long} height={ih}
           preserveAspectRatio="xMidYMid meet" onError={() => setFailed(true)} />
  </g>
  {on === 'spin' && <text x={cx} y={cy + 7} className="emoji">🌀</text>}
  {on === 'music' && <text x={x2 + 4} y={y1 + 10} className="note">🎵</text>}
</g>
```

Rotation around (cx, cy) works because the box center is the same for the horizontal and vertical frame.

## Implementation steps for a developer

1. Create `IMG_ASPECT` (19 entries, from the table: id -> w/h) and `IMG = Set(W2 W3 W4 W5 WC S1 S2 D1 D2 M1 R1 R4 RP C4)`, in Board.jsx or a new src/partImages.js. Optionally add a check in the data checker that every id in IMG has a file in public/parts.
2. In `Piece`, branch on `IMG.has(pc.p) && !failed`; add `useState` (convert Piece to a component with hooks, already is a component). Use the sketch for the image path; keep the existing code for everything else.
3. Compute `long` from `box()`: horizontal -> x2-x1, vertical -> y2-y1. `ih = long / aspect`. Center on (cx, cy). Rotate as R above.
4. CSS: change `.on-glow .body` to `.on-glow .body, .on-glow .pimg`. Spin only rotates `.emoji` (M1 overlay fan). Add nothing else for music.
5. Hide the id label and emoji for imaged pieces. Keep Marks untouched; decide on the duplicate + after a visual pass.
6. Verify visually in projects using each piece (vertical wires in project 1, flipped B1 stays emoji, flipped D1/C4 in the LED and capacitor projects, M1 live spin, WC live). Check D1/D2/C4: picture + end vs red + mark end for flip and v. Check that WC looks right as a thin wire box; if not, treat it as a non-wire (box 104x44) only for imaging, or ask the content owner whether WC is meant to be thin.
7. Optional: eyelet alignment option B (measure eyelets, add `eye` fractions) if the 14 px offset bothers on screenshots.
8. Preload the 14 images when a project opens. Run `npm run build` and the content checker.

## Risks / open questions

- Mixed look: kit pictures next to emoji boxes (battery, lamp, speaker, pot, transistor) will look inconsistent. Cheapest consistency fix: also give those 5 a "picture card" style later (bigger box with a picture, e.g. B1 as a 2x2 area), which needs grid/box changes and changes to every project's layout, so it is out of scope here. If the user wants full consistency, the alternative is to make B1/L1/SP/RV/Q2 boxes larger in `box()` and re-check all projects with services data checker for overlaps. That is a separate task.
- The battery is the most important piece to show right (+/- polarity); it stays emoji + red + mark in this plan.
- Not verified: the visible + side and eyelet positions of images other than D1 and B1 (only D1, B1 were viewed; the rest are from file sizes only).
