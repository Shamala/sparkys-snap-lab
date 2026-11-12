import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// SSL-R4 (intake/sparky-snap-lab-2026-11-11.md). A comic speech bubble: ink border, hard shadow, optional tail on the left
// pointing at the mascot. No live-region role: the consumer announces the text (conventions 13).

export type SpeechBubbleProps = {
  /** say: one large line. party: highlight fill. info: a title above the body ("Meet the Lamp!"). */
  variant: "say" | "party" | "info";
  /** info only; not rendered when empty. */
  title?: string;
  /** Tail on the left. Leave it off when there is no speaker. */
  tail?: boolean;
  children: ReactNode;
  className?: string;
};

const variants: Record<SpeechBubbleProps["variant"], string> = {
  say: "bg-surface-raised text-text text-ui-kid font-medium",
  party: "bg-highlight-subtle text-highlight-text text-ui-kid font-medium",
  info: "bg-surface-raised text-text text-ui-reading",
};

export function SpeechBubble({ variant, title, tail = false, children, className }: SpeechBubbleProps) {
  return (
    <div className={cn("relative rounded-bubble border-bw-heavy border-text p-inset-md font-body [overflow-wrap:anywhere] leading-normal shadow-hard", variants[variant], className)}>
      {tail && (
        // a square turned 45°, hanging half outside the left edge; its own two borders draw the point, its fill covers the box border
        <span aria-hidden="true" className="absolute start-0 top-inset-md size-4 -translate-x-1/2 rotate-45 border-b-bw-heavy border-s-bw-heavy border-text bg-inherit" />
      )}
      {variant === "info" && title && <p className="text-ui-body font-heading-strong">{title}</p>}
      {children}
    </div>
  );
}
