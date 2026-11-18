/** Drifting light behind a hero; all CSS (globals.css `.aurora`). `tinted` takes the plugin's colour. */
export function Aurora({ tinted = false, className = "" }: { tinted?: boolean; className?: string }) {
  return (
    <div aria-hidden className={`aurora ${tinted ? "aurora-tinted" : ""} ${className}`}>
      <i />
      <i />
      <i />
      <b />
    </div>
  );
}
