import { CookieSettingsButton, EXYLIA_APPS } from "@exylia-webs/ui";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Logo } from "./Logo";
import { ParticleWord } from "./fx/ParticleWord";

const HUB_LEGAL = "https://hub.exylia.net";
const link = "text-[13.5px] text-white/45 transition-colors hover:text-white";

export function Footer({ lang, tinted = false }: { lang: Lang; tinted?: boolean }) {
  const f = dict.footer;
  const main = [
    { href: SITE.discord, label: f.support[lang], hint: f.supportHint[lang] },
    { href: SITE.store, label: f.store[lang], hint: f.storeHint[lang] },
    { href: SITE.modrinth, label: "Modrinth", hint: f.modrinthHint[lang] },
    { href: SITE.hub, label: "Exylia Hub", hint: f.hubHint[lang] },
  ];

  return (
    <footer className="mt-24 border-t hair">
      <div className="mx-auto max-w-docs px-6 py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Logo className="h-7" />
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/40">{f.blurb[lang]}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4 lg:gap-x-12">
            {main.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-white/80 transition-colors group-hover:text-white">
                    {l.label}
                    <span
                      aria-hidden
                      className="text-[12px] text-white/25 transition-[color,transform] group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-white/70"
                    >
                      ↗
                    </span>
                  </span>
                  <span className="mt-1 block text-[12.5px] text-white/35">{l.hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex items-baseline justify-between gap-4">
          <p className="eyebrow">{f.services[lang]}</p>
          <a href={SITE.hub} target="_blank" rel="noopener noreferrer" className={link}>
            {f.allServices[lang]} →
          </a>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {Object.values(EXYLIA_APPS).map((app) => (
            <li key={app.url}>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.03]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.image} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 shrink-0 rounded-lg" />
                <span className="truncate text-[14px] text-white/75">{app.name.replace("Exylia ", "")}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t hair pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
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
          <p className="text-[12.5px] text-white/25">{f.madeWith[lang]}</p>
        </div>
      </div>
      {/* The name in a few thousand particles: they gather when it comes into view and part around the cursor. */}
      <div className="mx-auto max-w-docs overflow-hidden px-2">
        <ParticleWord word="Exylia" tinted={tinted} className="h-[clamp(7rem,22vw,22rem)]" />
      </div>
    </footer>
  );
}
