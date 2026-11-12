import { forwardRef, type ReactNode } from "react";

// KMP-C2 (specs/KMP-C2-screen-header.md). Header of the three tab screens, on the canvas. Exactly one h1; the eyebrow is a paragraph.
// Only text.default and text.muted appear here (canvas rule). Top padding is token padding plus the platform top inset (conventions 15).

export type ScreenHeaderProps = {
  title: string;
  titleLang?: string;
  /** For example a date, formatted by the consumer. Uppercase and tracking apply to Latin text only. */
  eyebrow?: string;
  eyebrowLang?: string;
  /** The Settings icon button on Today. Only one trailing control. */
  trailing?: ReactNode;
  /** The week switcher on Week. */
  below?: ReactNode;
};

export const ScreenHeader = forwardRef<HTMLHeadingElement, ScreenHeaderProps>(function ScreenHeader(
  { title, titleLang, eyebrow, eyebrowLang, trailing, below },
  ref,
) {
  return (
    <header className="bg-surface-canvas px-inset-md pb-stack-md pt-[calc(env(safe-area-inset-top)+var(--shamallya-semantic-space-inset-md))] font-body leading-normal">
      <div className="flex items-start justify-between gap-gap-md">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p lang={eyebrowLang} className="text-ui-floor font-label text-text-muted [overflow-wrap:anywhere] latin:uppercase latin:tracking-label">
              {eyebrow}
            </p>
          )}
          <h1 ref={ref} tabIndex={-1} lang={titleLang} className="text-ui-headline font-heading-strong text-text [outline-style:none] [overflow-wrap:anywhere]">
            {title}
          </h1>
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
      {below && <div className="mt-stack-md">{below}</div>}
    </header>
  );
});
