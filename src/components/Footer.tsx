import Link from "next/link";
import { documentedPlugins, SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Logo } from "./Logo";
import { Beam } from "./motion/Backdrops";

export function Footer({ lang }: { lang: Lang }) {
  const f = dict.footer;

  return (
    <footer className="relative mt-24 overflow-hidden">
      <Beam />
      <div className="mx-auto max-w-docs px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo className="h-7" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/40">{f.blurb[lang]}</p>
          </div>

          <div>
            <p className="eyebrow mb-4">{f.docs[lang]}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-1 lg:grid-cols-2">
              {documentedPlugins.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/${lang}/docs/${p.id}`}
                    className="text-[13.5px] text-white/45 transition-colors hover:text-white"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${lang}#plugins`}
                  className="text-[13.5px] text-white/45 transition-colors hover:text-white"
                >
                  {f.allPlugins[lang]}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">{f.exylia[lang]}</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={SITE.hub} target="_blank" rel="noopener noreferrer" className="text-[13.5px] text-white/45 transition-colors hover:text-white">
                  exylia.net ↗
                </a>
              </li>
              <li>
                <a href={SITE.discord} target="_blank" rel="noopener noreferrer" className="text-[13.5px] text-white/45 transition-colors hover:text-white">
                  Discord ↗
                </a>
              </li>
              <li>
                <a href={SITE.store} target="_blank" rel="noopener noreferrer" className="text-[13.5px] text-white/45 transition-colors hover:text-white">
                  {f.store[lang]} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t hair pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-wide text-white/25">
            © {new Date().getFullYear()} Exylia · DiGround
          </p>
          <p className="font-mono text-[11px] tracking-wide text-white/25">{f.madeWith[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
