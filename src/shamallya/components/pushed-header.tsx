import { forwardRef, type ReactNode } from "react";
import { BackLink, type BackLinkProps } from "./back-link";

// KMP-C3 (specs/KMP-C3-pushed-header.md). Back link, the screen's h1, optional meta line, optional cooked tick (KMP-C11, a slot).
// The h1 is the focus target after navigation: it takes programmatic focus (tabindex -1), so pass a ref and focus it.
// Top padding is the token padding plus the platform top inset (conventions 15); the app must opt in to viewport-fit cover.

export type PushedHeaderProps = {
  back: BackLinkProps;
  title: string;
  titleLang?: string;
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

export const PushedHeader = forwardRef<HTMLHeadingElement, PushedHeaderProps>(function PushedHeader({ back, title, titleLang, meta, tick, trailing }, ref) {
  const end = trailing ?? tick;
  return (
    <header className="border-b-bw-default border-border bg-surface-raised px-inset-md pb-inset-md pt-[calc(env(safe-area-inset-top)+var(--shamallya-semantic-space-inset-md))] font-body leading-normal">
      <BackLink {...back} />
      <div className="flex items-start justify-between gap-gap-md">
        <div className="min-w-0 flex-1">
          <h1
            ref={ref}
            tabIndex={-1}
            lang={titleLang}
            className="text-ui-title font-heading-strong text-text [outline-style:none] [overflow-wrap:anywhere]"
          >
            {title}
          </h1>
          {meta && <div className="text-ui-floor font-regular text-text-muted">{meta}</div>}
        </div>
        {end && <div className="shrink-0">{end}</div>}
      </div>
    </header>
  );
});
