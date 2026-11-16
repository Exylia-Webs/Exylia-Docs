/**
 * The plugin card's banner grows into the plugin's cover (View Transitions API).
 * The landing names the clicked banner and navigates; the cover, which carries
 * the same name, calls arrived() once it is on screen.
 */
let done: (() => void) | null = null;

export const BANNER_MORPH = "plugin-banner";

export function morphTo(banner: HTMLElement, go: () => void) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return go();
  banner.style.viewTransitionName = BANNER_MORPH;
  document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        done = resolve;
        go();
        setTimeout(resolve, 700); // never hold the old frame longer than this
      }),
  );
}

export function arrived() {
  done?.();
  done = null;
}
