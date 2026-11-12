import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";

// Shared live-region utility (specs/_conventions.md section 13).
// One visually hidden, polite, atomic status region per screen shell. Callers supply the wording.

export const SETTLE_MS = 500;

type Announce = (message: string) => void;

const AnnounceContext = createContext<Announce | null>(null);
// Mounted providers, newest last. Serves the standalone `announce` export, which has no React context.
const mounted: Announce[] = [];

const warn = (text: string) => {
  if (import.meta.env.DEV) console.warn(`[announce] ${text}`);
};

export function AnnounceProvider({ children }: { children: ReactNode }) {
  const nested = useContext(AnnounceContext) !== null;
  const region = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const announce = useCallback<Announce>((message) => {
    if (!message) return; // empty is ignored and does not cancel a pending message
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = region.current;
      if (!el) return;
      // Clear first, then set, so an identical message is a fresh change.
      el.textContent = "";
      el.textContent = message;
    }, SETTLE_MS);
  }, []);

  useEffect(() => {
    if (nested) {
      warn("Nested AnnounceProvider ignored: one provider per screen shell. The outer region is used.");
      return;
    }
    mounted.push(announce);
    return () => {
      clearTimeout(timer.current); // teardown cancels pending announcements
      mounted.splice(mounted.indexOf(announce), 1);
    };
  }, [announce, nested]);

  if (nested) return <>{children}</>;
  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div ref={region} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />
    </AnnounceContext.Provider>
  );
}

const noProvider: Announce = () => warn("announce() called with no AnnounceProvider mounted; nothing was announced.");

/** Announce bound to the nearest provider. Prefer this inside components. */
export function useAnnounce(): Announce {
  const bound = useContext(AnnounceContext);
  return bound ?? noProvider;
}

/** Standalone announce for non-component callers: routes to the newest mounted provider. */
export const announce: Announce = (message) => (mounted.at(-1) ?? noProvider)(message);

