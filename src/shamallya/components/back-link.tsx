import { ChevronLeft } from "lucide-react";
import { Button } from "./button";

// KMP-C4 (specs/KMP-C4-back-link.md). A link with ghost Button visuals. The visible label is the origin; the
// accessible name is "Back to {origin}" (hidden prefix) so the visible label is contained in the name.
// Place it on a raised surface only: primary.text is under 7:1 on the canvas.

export type BackLinkProps = {
  /** Where the screen was opened from: "Today", "Week", "Search" or a dish name. Shown verbatim, never truncated. */
  origin: string;
  /** Language of the origin text. */
  originLang?: string;
  href: string;
  /** Hidden prefix of the accessible name; a space follows it. */
  prefix?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function BackLink({ origin, originLang, href, prefix = "Back to", onClick }: BackLinkProps) {
  return (
    <Button variant="ghost" asChild>
      <a href={href} onClick={onClick}>
        <span aria-hidden="true" className="inline-flex size-icon-sm shrink-0">
          <ChevronLeft className="size-full" />
        </span>
        <span>
          {/* inline hidden text (not absolute), so the name reads "Back to Today" with one space */}
          <span className="inline-block size-px overflow-hidden whitespace-pre [clip-path:inset(50%)]">{prefix}</span>
          {" "}
          <span lang={originLang}>{origin}</span>
        </span>
      </a>
    </Button>
  );
}
