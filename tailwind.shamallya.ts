// Tailwind additions for the ShaMallya components. Add as a preset after the tokens preset:
//   presets: [tokensPreset, shamallya]
// Component-specific compositions the tokens preset (0.5.0) does not generate: nested radii, compensated paddings,
// the inside focus ring, keyframes. Every value is a token variable; nothing here is a literal.
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";


const s = (name: string) => `var(--shamallya-semantic-${name})`;
const p = (name: string) => `var(--shamallya-primitive-${name})`;
const borderDelta = `(${s("size-border-width-heavy")} - ${s("size-border-width-default")})`;

export default {
  theme: {
    extend: {
      spacing: {
        // chip: padding shrinks by the border-width difference so selecting never changes the outer size
        "chip-x": s("space-inset-md"),
        "chip-x-selected": `calc(${s("space-inset-md")} - ${borderDelta})`,
        "chip-y": p("space-1"),
        "chip-y-selected": `calc(${p("space-1")} - ${borderDelta})`,
        // slot card (dominant): standard inset plus the 4 px step (Q-S9)
        "card-dominant": `calc(${s("space-inset-md")} + ${p("space-1")})`,
        // day row: today's heavier border is absorbed by padding so every variant has the same outer size
        "row-today": `calc(${s("space-inset-md")} - ${borderDelta})`,
        // switch thumb: equal outer gap at both ends, clear of the track border
        "thumb-inset": `calc((${s("size-switch-track-height")} - ${s("size-switch-thumb")}) / 2 - ${s("size-border-width-default")})`,
        // select end padding: caret width plus the 4 px step (D-4 ruling)
        "select-end": `calc(${s("size-icon-sm")} + ${p("space-1")})`,
        // Sparky's Snap Lab (SSL-R1, R5, R11): nearest existing steps until Token Forge ships the requested tokens.
        // shortcut: size.control.kid not in tokens yet, swap when Token Forge ships it
        "control-kid": p("space-16"),
        // shortcut: size.mascot not in tokens yet, swap when Token Forge ships it
        mascot: `calc(${p("space-24")} * 1.5)`,
        // shortcut: size.mascot.sm not in tokens yet, swap when Token Forge ships it
        "mascot-sm": p("space-24"),
        // shortcut: size.dot not in tokens yet, swap when Token Forge ships it
        dot: p("space-3"),
      },
      boxShadow: {
        // shortcut: shadow.hard not in tokens yet, swap when Token Forge ships it
        // shortcut: color.ink not in tokens yet, swap when Token Forge ships it
        hard: `${p("space-1")} ${p("space-1")} 0 ${s("color-text-default")}`,
      },
      borderRadius: {
        // shortcut: radius.bubble not in tokens yet, swap when Token Forge ships it
        bubble: p("radius-xl"),
        // nested radius rule: parent radius minus the parent's border width
        inner: `calc(${s("radius-control")} - ${s("size-border-width-heavy")})`,
        // slot row inside an open accordion panel: item radius - (border + panel padding); a negative result is invalid CSS and falls back to square
        // week switcher segment: frame radius - (frame border + inset)
        segment: `calc(${s("radius-control")} - ${s("size-border-width-default")} - ${p("space-1")})`,
        slot: `calc(${s("radius-control")} - ${s("size-border-width-heavy")} - ${s("space-inset-sm")})`,
        // first and last row of a grouped list card: card radius - card border width
        "card-inner": `calc(${s("radius-card")} - ${s("size-border-width-default")})`,
      },
      // inside ring for edge-attached targets (conventions 4.1): same width, no gap, drawn inward
      outlineOffset: { "ring-inside": `calc(-1 * ${s("size-focus-ring-width")})` },
      fontSize: {
        // dominant dish name (Q-S11): primitive 20 px step, no semantic token
        "dish-dominant": p("font-size-xl"),
        // shortcut: font.size.ui.kid not in tokens yet, swap when Token Forge ships it
        "ui-kid": p("font-size-xl"),
      },
      keyframes: {
        "panel-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "panel-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "panel-down": `panel-down ${s("motion-transition-base")} ${s("motion-easing-standard")}`,
        "panel-up": `panel-up ${s("motion-transition-base")} ${s("motion-easing-standard")}`,
      },
    },
  },
  plugins: [
    // Uppercase and tracking apply to Latin text only, selected by language (conventions 9).
    plugin(({ addVariant }) => addVariant("latin", "&:lang(en)")),
  ],
} satisfies Partial<Config>;
