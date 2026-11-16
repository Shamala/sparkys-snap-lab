import { forwardRef, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { SPARKY_URL } from "@/services";
import type { BackLinkProps } from "./back-link";

// KMP-C3 (specs/KMP-C3-pushed-header.md). Back link, the screen's h1, optional meta line, optional cooked tick (KMP-C11, a slot).
// The h1 is the focus target after navigation: it takes programmatic focus (tabindex -1), so pass a ref and focus it.
// Top padding is the token padding plus the platform top inset (conventions 15); the app must opt in to viewport-fit cover.

export type PushedHeaderProps = {
  back: BackLinkProps;
  title: string;
  titleLang?: string;
  /** Hide Sparky beside the title (the project page already shows him). */
  noSparky?: boolean;
  /** Role, Kannada name, page. Not rendered when empty. */
  meta?: ReactNode;
} & (
  | {
      /** Only on the four Dish screens; absent on Add to a meal and Settings. */
      tick?: ReactNode;
      trailing?: never;
    }
  | {
      tick?: never;
      /** SSL-R3: one trailing control that is not a cooked tick (for example a mute toggle). Same place as `tick`; not both. */
      trailing?: ReactNode;
    }
);

export const PushedHeader = forwardRef<HTMLHeadingElement, PushedHeaderProps>(function PushedHeader({ back, title, titleLang, noSparky, meta, tick, trailing }, ref) {
  const end = trailing ?? tick;
  return (
    <header className="border-b-bw-default border-border bg-surface-raised px-inset-md pb-inset-md pt-[calc(env(safe-area-inset-top)+var(--shamallya-semantic-space-inset-md))] text-center font-body leading-normal">
      {/* one bar: back arrow left, Sparky beside the title in the middle, trailing control right */}
      <div className="relative">
        <a href={back.href} onClick={back.onClick} aria-label={`${back.prefix ?? "Back to"} ${back.origin}`} className="back-arrow">
          <ChevronLeft aria-hidden="true" className="size-icon-sm" />
        </a>
        <div className="min-w-0">
          <div className="title-row">
            {!noSparky && <img src={`${SPARKY_URL}/sparky-bandana.svg`} alt="" width="28" height="28" />}
            <h1
              ref={ref}
              tabIndex={-1}
              lang={titleLang}
              className="text-ui-title font-heading-strong text-text [outline-style:none] [overflow-wrap:anywhere]"
            >
              {title}
            </h1>
          </div>
          {meta && <div className="text-ui-floor font-regular text-text-muted">{meta}</div>}
        </div>
        {end && <div className="absolute end-0 top-0">{end}</div>}
      </div>
    </header>
  );
});
