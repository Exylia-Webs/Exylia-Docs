import Link from "next/link";
import { CookieSettingsButton } from "@exylia-webs/ui";
import { documentedPlugins, SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Logo } from "./Logo";
import { Beam } from "./motion/Backdrops";

const HUB_LEGAL = "https://hub.exylia.net";

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
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-wide">
            <p className="text-white/25">© {new Date().getFullYear()} Exylia · DiGround</p>
            {/* The hub's privacy policy covers this site too: it collects nothing beyond it. */}
            <a href={`${HUB_LEGAL}/${lang}/legal`} className="text-white/40 transition-colors hover:text-white">
              {f.legal[lang]}
            </a>
            <a href={`${HUB_LEGAL}/${lang}/legal/privacy`} className="text-white/40 transition-colors hover:text-white">
              {f.privacy[lang]}
            </a>
            <CookieSettingsButton className="text-white/40 transition-colors hover:text-white" />
          </div>
          <p className="font-mono text-[11px] tracking-wide text-white/25">{f.madeWith[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
