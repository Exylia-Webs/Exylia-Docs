import { dict } from "@/content/dictionary";
import { Stagger, Words } from "@/components/fx/Words";
import type { Lang } from "@/content/registry";

/** The four parts every plugin's docs share, said once. */
export function HowToRead({ lang }: { lang: Lang }) {
  const l = dict.landing;
  return (
    <section id="estructura" className="mx-auto max-w-content scroll-mt-24 px-6 pb-28 sm:pb-36">
      <span className="chip-n">
        <b>02</b>
        {l.structureChip[lang]}
      </span>
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
        <Words
          text={l.structureHeading[lang]}
          className="font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white"
          accent="text-[1.08em]"
        />
        <p className="max-w-md text-[15.5px] leading-relaxed text-white/45 md:justify-self-end">{l.structureLead[lang]}</p>
      </div>
      <Stagger as="ol" glow className="mt-12 grid gap-px overflow-hidden rounded-2xl border hair sm:grid-cols-2 lg:grid-cols-4">
        {l.structureSteps.map((step, i) => (
          <li key={i} style={{ ["--i" as string]: i * 1.6 }} className="group relative bg-[#060608] p-6 transition-colors duration-300 hover:bg-[#0a0a0d] sm:p-7">
            <span className="block font-serif text-[clamp(3.5rem,5vw,4.75rem)] italic leading-none text-white/[0.12] transition-[color,transform] duration-500 group-hover:-translate-y-1 group-hover:text-white">
              0{i + 1}
            </span>
            <p className="mt-10 text-[17px] font-medium tracking-[-0.02em] text-white">{step.title[lang]}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/45">{step.body[lang]}</p>
          </li>
        ))}
      </Stagger>
    </section>
  );
}
