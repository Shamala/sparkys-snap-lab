# Component request: Sparky's Snap Lab

**Requesting team:** Sparky's Snap Lab (follow-along snap circuit projects for children aged 5 and up)
**Date:** 2026-11-11
**Contact:** Shamala Mallya
**App repo:** `../Snap Circuits` (this folder). Screens to look at: Home (`#`), Meet the Pieces (`#parts`), a project (`#p/4`).
**Status 2026-11-11 (later):** R1 to R8, R10 and R11 were built by the library team and are now used by the app; only R9 (theme) is still open. The text below is the original request.
**Original status:** everything below is built inside the app today with plain CSS (`src/styles.css`). The app
would replace each one with the library version as it is released.

## 1. What we already use from the library

Vendored on 2026-11-11 from `ShaMallya Components` at commit `3eb5338` into `src/shamallya/components/`
(the same files the shadcn registry installs), with `@shamallya-ui/tokens` 0.6.0, Tailwind 3.4 and the mapping CSS.

| Library component | Where it is used in Snap Lab | Fit |
|---|---|---|
| Button (primary, outline) | Next / More (primary), Back and Play/Pause (outline), Meet the Pieces and Safety Rules (outline) | Good. We add `className="kid"` for a 64 px height and 1.2 rem text; see request R1 |
| IconButton | Mute/unmute Sparky (button), Meet the Pieces (link) in the Home header | Good. The mute control is really a toggle; see R2 |
| BackLink | "Back to Home" on every pushed screen | Good |
| PushedHeader | Project screen and Meet the Pieces screen: back link, title, "Step 2 of 6" as `meta` | Good. We put the mute IconButton in the `tick` slot, which is named for the cooked tick; see R3 |
| ScreenHeader | Home: title, eyebrow, trailing IconButton | Good |
| SectionHeading | "25 projects" above the project grid | Good, though the 15 px uppercase style reads small for this audience; a kid theme would fix that (R9) |
| Caption (prose) | Trademark and supervision notice at the bottom of Home | Good |
| announce / AnnounceProvider | Every step's sentence is announced to assistive technology as it changes | Good |

Not used, and why: TabBar (fixed three tabs with calendar/search icons), SettingSwitch (a 5-year-old needs the big
icon toggle, not a labelled switch), RegenerateSheet / NextWeekNotice / FrozenWeekBlock (fixed meal-planner copy),
GroupedListCard / ListRow / SlotCard / DayRow / WeekSwitcher / CookedTick / FilterChip / SearchField / ScheduleField
(planner-specific), DayAccordion (no accordions in the app).

## 2. What does not exist yet (the request)

Each row is one component or change. Bucket is our suggestion using the library's own buckets:
P = themed primitive, L = library composite, A = stays in the app.

| Id | Component | Bucket | What it is | States and accessibility | Tokens needed |
|---|---|---|---|---|---|
| R1 | Button size `kid` | P (change to Button) | A larger Button for small hands: 64 px minimum height, 1.2 rem label, the same variants | Same as Button. Target size is the point, not a new look | `size.control.kid` (64 px), `font.size.ui.kid` |
| R2 | IconToggle | P | An IconButton that is a real toggle: two icons, two labels, `aria-pressed`. Used for mute/unmute. Today IconButton bans `aria-pressed`, so the app swaps the label instead | Pressed / not pressed; label describes the action ("Mute Sparky"), icon changes with state; 56 px target | none new |
| R3 | PushedHeader `trailing` slot | L (change) | Rename or add a general `trailing` slot beside `tick`, so a header can carry one trailing control that is not a cooked tick | Same as today | none |
| R4 | SpeechBubble (dialog box) | L | A comic speech bubble: rounded box, 3 px ink border, hard drop shadow, optional tail pointing at a speaker on the left; variants `say` (large text), `party` (highlight fill), `info` (title plus body, used for "Meet the Lamp!") | Static text; a `role="status"`-free box (the consumer announces). Tail hidden when there is no speaker | `color.ink`, `radius.bubble` (22 px), `shadow.hard` (4 px 4 px 0), `font.size.ui.kid` |
| R5 | Mascot slot | L | A box that hosts an inline SVG character fetched by URL, sizes it (150 px desktop, 100 px phone), keeps it sticky beside the bubbles, and exposes a `--mouth` custom property (0 to 1) for lip-sync | `aria-hidden`; hidden entirely when the voice is off | `size.mascot`, `size.mascot.sm` |
| R6 | TileCard (project card) | L | A tappable tile: big emoji, number badge in the corner, title, a row of small status marks (level dots, star). Grid of these on Home | Link; 3 px press-down; focus ring; whole tile is the target | `radius.card`, `shadow.hard`, `color.badge` |
| R7 | GlossaryCard | L | Emoji, name, id, then three labelled lines (What? Why? How?). Colour bar on the left set per item | Static | `radius.card`, `space.inset.md` |
| R8 | SafetyNotice | L (Alert, neutral or warning) | A bulleted list in a soft red box, toggled by a button. The library's Alert composites carry fixed copy; this one takes children | Toggle via a Button with `aria-expanded`; list is a real `ul` | `color.status.warning.surface` |
| R9 | `sparky` brand theme | tokens (Token Forge) | A children's theme: warm canvas (`#fffbea`), ink `#023047`, primary `#ffb703` with hover `#fb8500`, success `#06d6a0`, info `#8ecae6`; rounded display face; larger `ui.reading`; contrast checked for both modes | n/a | `data-brand="sparky"` |
| R10 | BottomActionBar | L | A sticky bottom bar holding up to three equal-width Buttons with a gap; safe-area padding; slots may be empty without the others moving | Landmark `role="group"` with a label; keyboard order left to right | `space.gap.md`, safe-area insets |
| R11 | ProgressDots | L | A row of dots, one per step, filled up to the current step. Replaces "Step 2 of 6" for pre-readers (keep the text for AT) | `aria-hidden` dots plus visually hidden "Step 2 of 6" | `color.primary`, `size.dot` |

Stays in the app (bucket A): the snap board (`src/Board.jsx`), the piece animations (glow, spin, music),
the voice player and lip-sync (`src/voice.js`), the service loaders.

## 3. Priorities

1. R4 SpeechBubble and R5 Mascot slot: they are the heart of the app and today 60 lines of app CSS.
2. R1 Button size and R10 BottomActionBar: every project screen uses them.
3. R6 TileCard and R9 theme: the Home screen.
4. R2, R3, R7, R8, R11: small, any time.

## 4. Notes for the designer and testing agents

- Users are 5 and up, often pre-readers: every target 56 px or more (64 px for the three main buttons), one action per control, no hover-only states, no text under 1 rem.
- The app runs light-only today (`data-theme="light"` on the root) because the board colours are fixed. A dark pass is welcome once R9 exists.
- Plus Jakarta Sans is loaded from Google Fonts per the library setup. The app is an offline PWA, so the system fallback must look acceptable.
- The app stores nothing but a list of finished projects in `localStorage`; no analytics, no accounts.
