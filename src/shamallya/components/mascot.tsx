import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

// SSL-R5 (intake/sparky-snap-lab-2026-11-11.md). Hosts the app's own SVG character: fetched by URL and inlined so the app's CSS
// can reach its parts. Lip-sync reads the --mouth custom property on the box. Decorative (aria-hidden); sticky beside the bubbles.
// The custom property is set through the DOM (the lint bans inline style objects), the same way the gallery applies run-time values.

export type MascotProps = {
  /** URL of the SVG, the app's own asset. Script elements are stripped before inlining. */
  src: string;
  /** Mouth openness, 0 (closed) to 1 (open), written as --mouth. */
  mouth?: number;
  /** Voice off: nothing is rendered. */
  hidden?: boolean;
  className?: string;
};

/** Parses as SVG, drops script and foreignObject, every on* attribute and javascript: links; "" when it is not valid SVG. */
function clean(text: string): string {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = doc.documentElement;
  if (doc.querySelector("parsererror") || root.localName !== "svg") return "";
  root.querySelectorAll("script,foreignObject").forEach((n) => n.remove());
  for (const n of [root, ...root.querySelectorAll("*")]) {
    for (const a of [...n.attributes]) {
      if (/^on/i.test(a.name) || (/(^|:)href$/i.test(a.name) && /^\s*javascript:/i.test(a.value))) n.removeAttribute(a.name);
    }
  }
  return new XMLSerializer().serializeToString(root);
}

export function Mascot({ src, mouth = 0, hidden = false, className }: MascotProps) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ctrl = new AbortController();
    fetch(src, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((text) => {
        el.innerHTML = clean(text);
      })
      .catch(() => {}); // a missing picture leaves an empty box; the app's voice and text do not depend on it
    return () => {
      ctrl.abort();
      el.innerHTML = "";
    };
  }, [src, hidden]);

  useEffect(() => {
    box.current?.style.setProperty("--mouth", String(Number.isFinite(mouth) ? Math.min(1, Math.max(0, mouth)) : 0));
  }, [mouth, hidden]);

  if (hidden) return null;
  return <div ref={box} aria-hidden="true" className={cn("sticky top-inset-md size-mascot-sm shrink-0 md:size-mascot [&>svg]:size-full", className)} />;
}
