import { CookieSettingsButton, EXYLIA_APPS } from "@exylia-webs/ui";
import { SITE, type Lang } from "@/content/registry";
import { dict } from "@/content/dictionary";
import { Logo } from "./Logo";

const HUB_LEGAL = "https://hub.exylia.net";
const link = "text-[13.5px] text-white/45 transition-colors hover:text-white";

export function Footer({ lang }: { lang: Lang }) {
  const f = dict.footer;
  const columns = [
    {
      title: f.services[lang],
      links: [
        ...Object.values(EXYLIA_APPS).map((app) => ({ href: app.url, label: app.name.replace("Exylia ", "") })),
        { href: SITE.hub, label: f.allServices[lang] },
      ],
    },
    {
      title: f.exylia[lang],
      links: [
        { href: SITE.hub, label: "exylia.net" },
        { href: SITE.discord, label: "Discord" },
        { href: SITE.store, label: f.store[lang] },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t hair">
      <div className="mx-auto max-w-docs px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <Logo className="h-7" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/40">{f.blurb[lang]}</p>
          </div>
          <div className="flex gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-4">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

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
