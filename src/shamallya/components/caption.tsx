import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// KMP-C6 (specs/KMP-C6-caption.md). One paragraph of muted text in four variants. Not interactive, not a live region.
// An under-action caption must be the description of the button above it: pass its id as that button's aria-describedby.

export type CaptionProps = {
  variant: "under-action" | "group-note" | "coverage" | "prose";
  children: ReactNode;
  /** Supplied or generated; other components reference it. */
  id?: string;
  lang?: string;
  className?: string;
};

const variants = {
  "under-action": "text-center text-ui-floor",
  "group-note": "text-start text-ui-floor",
  coverage: "text-start text-ui-floor",
  prose: "text-start text-ui-reading",
} as const;

const isEmpty = (c: ReactNode) => c === null || c === undefined || c === false || (typeof c === "string" && c.trim() === "");

export function Caption({ variant, children, id, lang, className }: CaptionProps) {
  const auto = useId();
  if (isEmpty(children)) return null; // a caption with nothing to say does not exist
  return (
    <p id={id ?? auto} lang={lang} className={cn("font-body font-regular leading-normal text-text-muted [overflow-wrap:anywhere]", variants[variant], className)}>
      {children}
    </p>
  );
}
