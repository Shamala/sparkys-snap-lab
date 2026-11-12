import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// SSL-R10 (intake/sparky-snap-lab-2026-11-11.md). Sticky bottom bar with three equal columns (start, center, end). An empty
// column keeps its width so the others never move. Keyboard order is DOM order, left to right.
// Bottom padding adds the platform inset (conventions 15); the app must opt in to viewport-fit cover.

export type BottomActionBarProps = {
  /** Name of the group landmark, for example "Project steps". */
  label: string;
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
  className?: string;
};

export function BottomActionBar({ label, start, center, end, className }: BottomActionBarProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("sticky bottom-0 z-sticky grid grid-cols-3 gap-gap-md border-t-bw-default border-border bg-surface-raised px-inset-md pt-inset-md pb-[calc(env(safe-area-inset-bottom)+var(--shamallya-semantic-space-inset-md))] font-body leading-normal", className)}
    >
      {[start, center, end].map((slot, i) => (
        <div key={i} className="min-w-0 [&>*]:w-full">
          {slot}
        </div>
      ))}
    </div>
  );
}
