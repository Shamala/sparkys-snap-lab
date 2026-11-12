import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

// KMP-C20 primary, KMP-C21 outline, KMP-C18 ghost / disclosure, quiet (specs/KMP-C20-21-18-button.md).
// Follows the shadcn/ui Button pattern (Slot root, variants) written by hand: the shadcn CLI was not run, so no upstream version is recorded.
// There is no disabled, loading, destructive, secondary or size option: an unavailable action is not rendered.

type Variant = "primary" | "outline" | "ghost" | "quiet";

type IconSlots =
  | { variant: "primary" | "outline"; leadingIcon?: ReactNode; trailingIcon?: never }
  | { variant: "ghost"; trailingIcon?: ReactNode; leadingIcon?: never }
  | { variant: "quiet"; leadingIcon?: never; trailingIcon?: ReactNode; /** Underline at rest: for a quiet control on the canvas, such as a section heading's trailing control. */ underlined?: boolean };

type Shared = {
  fullWidth?: boolean;
  /** SSL-R1: "kid" raises the floor to 64 px and the label to the kid size for small hands. Same variants. */
  size?: "kid";
  className?: string;
};
type Forbidden = { disabled?: never; "aria-disabled"?: never };

type ButtonRoot = Shared & Forbidden & { children: ReactNode; href?: undefined; asChild?: false } &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "aria-disabled" | "type" | "className" | "children">;
type LinkRoot = Shared & Forbidden & { children: ReactNode; href: string; asChild?: false } &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "aria-disabled" | "className" | "children">;
/** Styles the single child (for example a router link). Icons are not added in this mode. */
type SlotRoot = Shared & Forbidden & { asChild: true; children: ReactElement; href?: undefined } &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "aria-disabled" | "className" | "children">;

export type ButtonProps = IconSlots & (ButtonRoot | LinkRoot | SlotRoot);

const base = cn(
  "inline-flex items-center justify-center gap-gap-sm rounded-button border-bw-default",
  "px-inset-md py-3 text-center font-body font-button leading-normal [overflow-wrap:anywhere]",
  "transition-colors duration-fast ease-standard",
  "focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-ring focus-visible:outline-focus-ring",
);

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-primary text-primary-on hover:bg-primary-hover active:bg-primary-active",
  // D-2: primary.hover and .active are fill tokens, never text or border colour. Hover underlines; pressed uses text.default.
  outline: "border-bw-strong border-primary-text bg-surface-raised text-primary-text hover:underline active:border-text active:text-text active:underline",
  ghost: "border-transparent bg-transparent text-primary-text hover:underline active:text-text active:underline",
  quiet: "border-transparent bg-transparent text-text-muted hover:text-text hover:underline active:border-border-strong active:text-text active:underline",
};

const Icon = ({ children }: { children: ReactNode }) => (
  <span aria-hidden="true" className="inline-flex size-icon-sm shrink-0 [&>svg]:size-full">
    {children}
  </span>
);

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, ref) {
  // Runtime backstop for the type-level ban: a forced `disabled` never reaches the DOM.
  const { variant, underlined, fullWidth, size, className, children, leadingIcon, trailingIcon, asChild, href, disabled: _d, "aria-disabled": _a, ...rest } =
    props as ButtonProps & Record<"disabled" | "aria-disabled", unknown> & { underlined?: boolean };
  const classes = cn(base, variants[variant], // exactly one of these, never both: a base no-underline would beat underline in the stylesheet
    variant === "quiet" && underlined ? "underline" : "no-underline",
    size === "kid" ? "min-h-control-kid text-ui-kid" : "min-h-control text-ui-reading",
    fullWidth && "w-full", className);

  if (asChild) {
    return (
      <Slot ref={ref as never} className={classes} {...rest}>
        {children}
      </Slot>
    );
  }
  const content = (
    <>
      {leadingIcon && <Icon>{leadingIcon}</Icon>}
      {children}
      {trailingIcon && <Icon>{trailingIcon}</Icon>}
    </>
  );
  if (href !== undefined) {
    return (
      <a ref={ref as never} href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref as never} type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
});

export type DisclosureButtonProps = {
  /** Controlled by the consumer: the button reports a click, the consumer flips the state. */
  expanded: boolean;
  /** The true total, supplied by the consumer. Never computed here. */
  count: number;
  /** Collapsed wording; default "Show all N". */
  collapsedLabel?: string;
  /** "quiet" (underlined at rest) when the control sits on the canvas, for example in a section heading. */
  variant?: "ghost" | "quiet";
  /** Expanded wording; default "Show fewer" (Q-B4, planner to confirm). */
  expandedLabel?: string;
  /** id of the region this button reveals. */
  controls?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  fullWidth?: boolean;
  className?: string;
  "aria-describedby"?: string;
};

/** KMP-C18: ghost button with a chevron. Label, chevron direction and aria-expanded change together. */
export function DisclosureButton({ expanded, count, collapsedLabel, expandedLabel = "Show fewer", controls, variant = "ghost", ...rest }: DisclosureButtonProps) {
  return (
    <Button
      {...(variant === "quiet" ? { variant: "quiet" as const, underlined: true } : { variant: "ghost" as const })}
      aria-expanded={expanded}
      aria-controls={controls}
      trailingIcon={<ChevronDown className={cn("transition-transform duration-fast ease-standard", expanded && "rotate-180")} />}
      {...rest}
    >
      {expanded ? expandedLabel : (collapsedLabel ?? `Show all ${count}`)}
    </Button>
  );
}
