import { CookieSettingsButton, EXYLIA_APPS } from "@exylia-webs/ui";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Logo } from "./Logo";

const HUB_LEGAL = "https://hub.exylia.net";
const link = "text-[13.5px] text-white/45 transition-colors hover:text-white";

export function Footer({ lang }: { lang: Lang }) {
  const f = dict.footer;
  const main = [
    { href: SITE.discord, label: "Discord" },
    { href: SITE.store, label: f.store[lang] },
    { href: SITE.hub, label: "exylia.net" },
  ];

  return (
    <footer className="mt-24 border-t hair">
      <div className="mx-auto max-w-docs px-6 py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Logo className="h-7" />
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/40">{f.blurb[lang]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {main.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-[13.5px] text-white/70 transition-colors hover:border-white/25 hover:text-white"
              >
                {l.label}
                <span className="text-white/30">↗</span>
              </a>
            ))}
          </div>
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
    </footer>
  );
}
