import { dict } from "@/content/dictionary";
import type { Lang } from "@/content/registry";

/** The four parts every plugin's docs share, said once. */
export function HowToRead({ lang }: { lang: Lang }) {
  const l = dict.landing;
  return (
    <section id="estructura" className="mx-auto max-w-content scroll-mt-24 px-6 pb-28 sm:pb-36">
      <h2 className="max-w-3xl font-display text-[clamp(1.9rem,4.2vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-white">
        {l.structureLead[lang]}
      </h2>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border hair bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
        {l.structureSteps.map((step, i) => (
          <li key={i} className="bg-[#060608] p-6">
            <span className="text-[12px] tabular-nums text-white/30">0{i + 1}</span>
            <p className="mt-8 text-[17px] font-medium tracking-[-0.02em] text-white">{step.title[lang]}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/45">{step.body[lang]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
