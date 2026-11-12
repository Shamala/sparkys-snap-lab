import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// SSL-R7 (intake/sparky-snap-lab-2026-11-11.md). Emoji, name, id, then what, why and how as one paragraph. The colour bar on
// the left takes a class, not a value: the lint bans inline style, so `barColor` became `barClassName`.

export type GlossaryCardProps = {
  /** Decorative. */
  emoji: string;
  /** Picture of the piece; when given it replaces the emoji. */
  imgSrc?: string;
  name: string;
  nameLang?: string;
  /** The piece's id, for example "S1". */
  id: string;
  what: ReactNode;
  why: ReactNode;
  how: ReactNode;
  /** Background class of the bar, for example "bg-tag-blue-border". Default border.strong. */
  barClassName?: string;
  className?: string;
};

export function GlossaryCard({ emoji, imgSrc, name, nameLang, id, what, why, how, barClassName, className }: GlossaryCardProps) {
  return (
    <article className={cn("flex overflow-hidden rounded-card border-bw-default border-border-card bg-surface-raised font-body leading-normal text-text", className)}>
      <div aria-hidden="true" className={cn("w-2 shrink-0", barClassName ?? "bg-border-strong")} />
      <div className="min-w-0 flex-1 p-inset-md">
        <p className="text-ui-body font-heading-strong [overflow-wrap:anywhere]">
          {imgSrc
            ? <img src={imgSrc} alt="" loading="lazy" className="me-gap-sm inline-block h-12 w-16 object-contain align-middle" />
            : <span aria-hidden="true">{emoji}</span>}{" "}<span lang={nameLang}>{name}</span> <span className="font-regular text-text-muted">{id}</span>
        </p>
        <p className="mt-stack-sm text-ui-reading [overflow-wrap:anywhere]">{what} {why} {how}</p>
      </div>
    </article>
  );
}
