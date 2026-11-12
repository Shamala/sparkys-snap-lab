import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// SSL-R2 (intake/sparky-snap-lab-2026-11-11.md). A real toggle button (aria-pressed) with IconButton's visuals at the control
// height (56 px in comfortable density). Icon and label change with the state; the fill change plus the glyph change carry the
// state without colour alone. IconButton itself keeps its no-aria-pressed rule; this is a separate component.

export type IconToggleProps = {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  /** Lucide icon shown when not pressed. */
  icon: ReactNode;
  /** Lucide icon shown when pressed. */
  pressedIcon: ReactNode;
  /** Accessible name when not pressed: the action, for example "Mute Sparky". */
  label: string;
  /** Accessible name when pressed, for example "Unmute Sparky". */
  pressedLabel: string;
  className?: string;
};

export function IconToggle({ pressed, onPressedChange, icon, pressedIcon, label, pressedLabel, className }: IconToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={pressed ? pressedLabel : label}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex size-control shrink-0 items-center justify-center rounded-control border-bw-default border-transparent",
        "bg-surface-raised text-text transition-colors duration-fast ease-standard",
        "hover:bg-surface-sunken active:border-border-strong active:bg-surface-sunken aria-pressed:border-border-strong aria-pressed:bg-surface-sunken",
        "focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-ring focus-visible:outline-focus-ring",
        className,
      )}
    >
      <span aria-hidden="true" className="inline-flex size-icon-lg [&>svg]:size-full">
        {pressed ? pressedIcon : icon}
      </span>
    </button>
  );
}
