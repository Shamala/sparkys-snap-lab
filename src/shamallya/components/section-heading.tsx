import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// KMP-C5 (specs/KMP-C5-section-heading.md). A real heading in the 15 px uppercase label style (Q-H1 working position).
// Uppercase and tracking apply to Latin text by language only; the accessible name stays sentence case.

export type SectionHeadingProps = {
  /** Sentence-case text. For mixed scripts wrap each run in its own lang-marked span. Not rendered when empty. */
  children: ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  lang?: string;
  /** One control aligned to the end and to the first line, for example a DisclosureButton. */
  trailing?: ReactNode;
  className?: string;
};

export function SectionHeading({ children, level = 2, lang, trailing, className }: SectionHeadingProps) {
  if (children === null || children === undefined || children === false || (typeof children === "string" && children.trim() === "")) return null;
  const H = `h${level}` as const;
  return (
    <div className={cn("mb-stack-sm mt-stack-lg flex flex-wrap items-start justify-between gap-x-gap-md gap-y-stack-sm", className)}>
      <H
        lang={lang}
        className="min-w-min flex-1 basis-0 font-body text-ui-floor font-label leading-normal text-text-muted [overflow-wrap:anywhere] latin:uppercase latin:tracking-label"
      >
        {children}
      </H>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
