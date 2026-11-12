import { cn } from "@/lib/cn";

// SSL-R11 (intake/sparky-snap-lab-2026-11-11.md). One dot per step, filled up to the current step, for pre-readers.
// The dots are hidden from assistive technology; a visually hidden "Step N of M" carries the meaning.

export type ProgressDotsProps = {
  /** 1-based. */
  current: number;
  total: number;
  className?: string;
};

export function ProgressDots({ current, total, className }: ProgressDotsProps) {
  return (
    <div className={cn("flex items-center justify-start gap-x-gap-sm gap-y-gap-sm py-1 leading-none", className)}>
      <span className="sr-only">{`Step ${current} of ${total}`}</span>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn("size-dot shrink-0 rounded-pill border-bw-default", i < current ? "border-primary bg-primary forced-color-adjust-none forced-colors:bg-[Highlight]" : "border-border-strong bg-surface-raised")}
        />
      ))}
    </div>
  );
}
