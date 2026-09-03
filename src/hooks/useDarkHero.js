import { useEffect } from "react";

/**
 * Marks pages that open with a full-bleed dark hero. Until the navbar picks up
 * its own background on scroll it sits directly on that hero, so its text has
 * to be light regardless of the active theme.
 */
export function useDarkHero() {
  useEffect(() => {
    document.body.dataset.hero = "dark";

    return () => {
      delete document.body.dataset.hero;
    };
  }, []);
}
