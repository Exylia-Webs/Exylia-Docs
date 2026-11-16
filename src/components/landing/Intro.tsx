/**
 * First-visit curtain: the wordmark rises, a counter runs to 100, the curtain
 * lifts and the hero plays its entrance. Pure CSS (`.intro` in globals.css),
 * switched on by an inline script before first paint so it never flashes,
 * and skipped on later visits in the session and under reduced motion.
 */
const SCRIPT = `try{if(!sessionStorage.getItem("exylia-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("exylia-intro","1");var h=document.documentElement;h.classList.add("has-intro","intro-hold");setTimeout(function(){h.classList.remove("intro-hold")},1650);setTimeout(function(){h.classList.remove("has-intro")},2700)}}catch(e){}`;

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="intro" aria-hidden>
        <p className="intro-word font-display font-semibold">
          {"Exylia".split("").map((ch, i) => (
            <span key={i} style={{ ["--i" as string]: i }}>
              {ch}
            </span>
          ))}
        </p>
        <p className="rise mt-4 font-mono text-[11px] uppercase tracking-[0.4em] text-white/40" style={{ ["--d" as string]: "0.4s" }}>
          Docs
        </p>
        <span className="intro-count font-mono text-[12px] tracking-[0.2em] text-white/45" />
        <span className="intro-bar" />
      </div>
    </>
  );
}
