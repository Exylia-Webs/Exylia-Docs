/**
 * Reading progress, driven by a CSS scroll timeline (`.scroll-progress` in
 * globals.css): no JavaScript and no scroll listener. Browsers without scroll
 * timelines simply don't show it.
 */
export function ScrollProgress() {
  return (
    <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-[60] h-px bg-[rgb(var(--accent))]" />
  );
}
