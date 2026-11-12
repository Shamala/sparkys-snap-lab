import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// KMP-C32 (specs/KMP-C32-icon-button.md). Link when it navigates, button when it acts. Same visuals.
// The accessible name is a required prop; there is no visible text, badge, dot or tooltip.

type Shared = {
  /** Accessible name. Required: an icon alone is not a name. */
  label: string;
  /** A Lucide icon element, for example <SlidersHorizontal />. Drawn at size.icon-lg and hidden from assistive technology. */
  icon: ReactNode;
  className?: string;
};
type Forbidden = { disabled?: never; "aria-disabled"?: never; "aria-pressed"?: never; children?: never };

export type IconButtonProps = Shared & Forbidden & (
  | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Shared | keyof Forbidden | "type" | "aria-label">)
  | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Shared | keyof Forbidden | "aria-label">)
);

const classes = cn(
  "inline-flex size-icon-target shrink-0 items-center justify-center rounded-control border-bw-default border-transparent",
  "bg-surface-raised text-text transition-colors duration-fast ease-standard",
  "hover:bg-surface-sunken active:border-border-strong active:bg-surface-sunken",
  "focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-ring focus-visible:outline-focus-ring",
);

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(function IconButton(props, ref) {
  const { label, icon, className, href, disabled: _d, "aria-disabled": _a, "aria-pressed": _p, children: _c, ...rest } =
    props as IconButtonProps & Record<"disabled" | "aria-disabled" | "aria-pressed" | "children", unknown>;
  const glyph = (
    <span aria-hidden="true" className="inline-flex size-icon-lg [&>svg]:size-full">
      {icon}
    </span>
  );
  if (href !== undefined) {
    return (
      <a ref={ref as never} href={href} aria-label={label} className={cn(classes, className)} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {glyph}
      </a>
    );
  }
  return (
    <button ref={ref as never} type="button" aria-label={label} className={cn(classes, className)} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {glyph}
    </button>
  );
});
