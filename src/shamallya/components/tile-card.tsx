import { type MouseEventHandler, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// SSL-R6 (intake/sparky-snap-lab-2026-11-11.md). A project tile: one link whose whole area is the target. Big emoji, number
// badge in the corner, title, a row of small status marks. Pressing moves the tile down onto its hard shadow (no transition).
// The badge comes first in the DOM, so the name reads "4 Lamp"; the explicit spaces keep it so without layout (jsdom), the flex layout drops them.

// inline (not absolute, not inline-block) clipped text, so it stays in the same text run as the part before it and the name reads "4, Lamp" with no space before the comma (as list-row.tsx)
const comma = "[clip-path:inset(50%)]";

export type TileCardProps = {
  href: string;
  /** Decorative; the title names the tile. */
  emoji: string;
  /** Shown in the corner badge, for example the project number. */
  number?: number | string;
  title: string;
  titleLang?: string;
  /** Small status marks (level dots, a star), supplied by the consumer. Hidden from assistive technology unless they carry text. */
  marks?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

export function TileCard({ href, emoji, number, title, titleLang, marks, onClick, className }: TileCardProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "relative flex min-h-control-kid flex-col items-center gap-stack-sm rounded-card border-bw-heavy border-text bg-surface-raised p-inset-md text-center font-body leading-normal text-text no-underline shadow-hard",
        // shortcut: 4 px (the space.1 step) press-down, not the requested 3 px; the lint allows no literal length
        "active:translate-y-1 active:shadow-none",
        "focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-ring focus-visible:outline-focus-ring",
        className,
      )}
    >
      {number !== undefined && (
        <span className="absolute end-inset-sm top-inset-sm inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-primary px-1 text-ui-floor font-label text-primary-on">
          <span>
            {number}
            <span className={comma}>,</span>
          </span>
        </span>
      )}{" "}
      <span aria-hidden="true" className="text-ui-numeral">
        {emoji}
      </span>
      <span lang={titleLang} className="text-ui-body font-heading-strong [overflow-wrap:anywhere]">
        {title}
        {marks && <span className={comma}>,</span>}
      </span>{" "}
      {marks && <span className="flex items-center gap-gap-sm">{marks}</span>}
    </a>
  );
}
