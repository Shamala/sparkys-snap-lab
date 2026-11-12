import { useId, useState, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/cn";

// SSL-R8 (intake/sparky-snap-lab-2026-11-11.md). An outline Button with aria-expanded toggles a warning-surface box that holds
// the consumer's list (a real ul). The box stays in the DOM (hidden) so aria-controls always resolves.

export type SafetyNoticeProps = {
  /** Button label, for example "Safety rules". */
  label: string;
  /** The rules, as a ul. */
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function SafetyNotice({ label, children, defaultOpen = false, className }: SafetyNoticeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={cn("flex flex-col items-start gap-stack-sm font-body leading-normal", className)}>
      <Button variant="outline" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {label}
      </Button>
      <div
        id={id}
        hidden={!open}
        className="w-full rounded-card border-bw-default border-red-600 bg-red-50 p-inset-md text-ui-reading text-red-800 [&_ul]:list-disc [&_ul]:ps-inset-md"
      >
        <p className="mb-stack-sm flex items-center gap-gap-sm font-semibold"><TriangleAlert aria-hidden="true" className="size-icon-sm text-red-600" />Warning</p>
        {children}
      </div>
    </div>
  );
}
