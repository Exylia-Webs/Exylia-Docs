"use client";

// The Docs front page on the library landing engine (@exylia-webs/ui/site): the real search is the
// product moment, the bento shows the tools every page has, the catalogue is the domain section.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { EXYLIA_APPS, ICONS, LanguageSelect, ThemeToggle } from "@exylia-webs/ui";
import {
  LandingBento,
  LandingBrand,
  LandingButton,
  LandingFinal,
  LandingFooter,
  LandingHero,
  LandingProof,
  LandingSection,
  LandingShell,
  LandingStat,
  LandingSteps,
  LandingTile,
  StatePhrase,
  landingButtonClass,
} from "@exylia-webs/ui/site";
import { PluginBanner } from "@/components/PluginBanner";
import { loadIndex, prepare, rank, SearchDialog, useSearchHotkey, type Prepared } from "@/components/Search";
import { COPY } from "@/components/landing/copy";
import { dict } from "@/content/dictionary";
import { LANGS, SITE, documentedPlugins, groupByCategory, pageCount, plugins, type Lang, type Plugin } from "@/content/registry";
import { rememberLang } from "@/lib/lang";
import "./landing.css";

const TOTAL_PAGES = documentedPlugins.reduce((n, p) => n + pageCount(p), 0);
const GROUPS = groupByCategory(plugins);
const LIMIT = 12;
const HUB = "https://hub.exylia.net";
const plain = (s: string) => s.replace(/\*/g, "");
const STEP_ICONS = [ICONS.bolt, ICONS.sliders, ICONS.layers, ICONS.terminal];

/** The real search, inline: the index downloads on first focus and the results open under the field. */
function HeroSearch({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const s = dict.search;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [prepared, setPrepared] = useState<Prepared[] | null>(null);
  const deferred = useDeferredValue(query);
  const load = () => {
    if (!prepared) loadIndex(lang).then((e) => setPrepared(prepare(e))).catch(() => {});
  };
  const hits = useMemo(() => (prepared ? rank(prepared, deferred, 5) : []), [prepared, deferred]);
  useEffect(() => setCursor(0), [query]);
  const searching = query.trim() !== "";
  const href = (i: number) => `/${lang}/docs/${hits[i].plugin}/${hits[i].slug}`;
  const idle = documentedPlugins.slice(0, 5);

  return (
    <div className="dl-search">
      <label className="dl-field">
        <span className="dl-glass" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={load}
          onPointerEnter={load}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, hits.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); if (hits[cursor]) router.push(href(cursor)); }
            else if (e.key === "Escape") setQuery("");
          }}
          placeholder={l.searchExamples[lang][0]}
          aria-label={l.searchLabel[lang].replace("{n}", String(TOTAL_PAGES))}
        />
        <span className="k dl-count">{TOTAL_PAGES} {s.pages[lang]}</span>
      </label>
      <ul className="dl-results" aria-live="polite">
        {!searching && idle.map((p) => (
          <li key={p.id}>
            <Link href={`/${lang}/docs/${p.id}/`} className="dl-hit">
              <b>{p.name}</b>
              <span className="muted">{p.tagline[lang]}</span>
            </Link>
          </li>
        ))}
        {searching && !prepared && <li className="muted dl-note">{s.loading[lang]}</li>}
        {searching && prepared && hits.length === 0 && <li className="muted dl-note">{s.noResults[lang]} <b>{query}</b></li>}
        {searching && hits.map((hit, i) => (
          <li key={`${hit.plugin}/${hit.slug}`}>
            <Link href={href(i)} onMouseEnter={() => setCursor(i)} className="dl-hit" data-active={i === cursor || undefined}>
              <b>{hit.title}</b>
              <span className="muted">{hit.pluginName} · {hit.group}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({ p, lang, pagesLabel }: { p: Plugin; lang: Lang; pagesLabel: string }) {
  const documented = p.nav.length > 0;
  const body = (
    <>
      <PluginBanner plugin={p} className="aspect-[2/1] w-full" rounded="rounded-[12px]" />
      <span className="dl-card-head">
        <b>{p.name}</b>
        <span className="k">{documented ? `${pageCount(p)} ${pagesLabel}` : dict.landing.statusSoon[lang]}</span>
      </span>
      <span className="muted dl-card-tag">{p.tagline[lang]}</span>
    </>
  );
  return documented
    ? <Link href={`/${lang}/docs/${p.id}/`} className="dl-card">{body}</Link>
    : <a href={p.purchase ?? p.download ?? SITE.store} target="_blank" rel="noopener noreferrer" className="dl-card dl-soon">{body}</a>;
}

function Catalog({ lang }: { lang: Lang }) {
  const l = dict.landing;
  const c = COPY[lang];
  const [cat, setCat] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const list = useMemo(() => (cat ? (GROUPS.find((g) => g.key === cat)?.plugins ?? []) : plugins), [cat]);
  const shown = all || cat ? list : list.slice(0, LIMIT);
  return (
    <>
      <div className="dl-chips" role="group" aria-label={c.tools.categories}>
        <button type="button" aria-pressed={cat === null} onClick={() => setCat(null)}>{l.filterAll[lang]} <span className="k">{plugins.length}</span></button>
        {GROUPS.map((g) => (
          <button key={g.key} type="button" aria-pressed={cat === g.key} onClick={() => setCat(g.key)}>
            {g.label[lang]} <span className="k">{g.plugins.length}</span>
          </button>
        ))}
      </div>
      <div className="dl-grid">
        {shown.map((p) => <Card key={p.id} p={p} lang={lang} pagesLabel={c.pages} />)}
      </div>
      {!cat && list.length > LIMIT && (
        <button type="button" className={landingButtonClass("paper", "md", "dl-more")} onClick={() => setAll((v) => !v)}>
          {(all ? l.showLess : l.showAll)[lang].replace("{n}", String(list.length))}
        </button>
      )}
    </>
  );
}

export function DocsLanding({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const l = dict.landing;
  const f = dict.footer;
  const router = useRouter();
  const [search, setSearch] = useState(false);
  useSearchHotkey(useCallback(() => setSearch(true), []));
  const switchLang = (next: string) => {
    if (next === lang || !LANGS.includes(next as Lang)) return;
    rememberLang(next as Lang);
    router.push(`/${next}${window.location.hash}`);
  };
  const ai = l.featureAssistant;
  // heroTitle marks the promise word with *stars*: "{n} plugins.\nOne way to *read* them."
  const [a, word, z] = l.heroTitle[lang].replace("{n}", String(plugins.length)).replace("\n", " ").split("*");

  return (
    <LandingShell
      brand={<LandingBrand name="Docs" href={`/${lang}`} />}
      navLabel="Docs"
      links={[
        { href: "#plugins", label: dict.nav.plugins[lang] },
        { href: "#how", label: dict.nav.ecosystem[lang] },
        { href: "#features", label: plain(c.tools.lines.join(" ")) },
      ]}
      actions={
        <>
          <button type="button" onClick={() => setSearch(true)} className={landingButtonClass("ghost", "sm", "l-signin")}>
            {c.searchHint} <span className="k">⌘K</span>
          </button>
          <span className="l-lang"><LanguageSelect locales={LANGS} locale={lang} onChange={switchLang} /></span>
          <ThemeToggle />
        </>
      }
      sheetAction={
        <button type="button" onClick={() => setSearch(true)} className={landingButtonClass("paper")}>{c.searchHint}</button>
      }
      footer={
        <LandingFooter
          brand={<LandingBrand name="Exylia Docs" href={`/${lang}`} />}
          blurb={f.blurb[lang]}
          columns={[
            { title: "Docs", links: [{ href: "#plugins", label: dict.nav.plugins[lang] }, { href: "#how", label: dict.nav.ecosystem[lang] }, { href: "/llms.txt", label: "llms.txt" }] },
            { title: f.support[lang], links: [{ href: SITE.discord, label: f.support[lang] }, { href: SITE.store, label: f.store[lang] }, { href: SITE.modrinth, label: "Modrinth" }] },
            { title: f.legal[lang], links: [{ href: `${HUB}/${lang}/legal`, label: f.legal[lang] }, { href: `${HUB}/${lang}/legal/privacy`, label: f.privacy[lang] }] },
          ]}
          services={{
            title: f.services[lang],
            items: Object.values(EXYLIA_APPS).map((a) => ({ name: a.name.replace("Exylia ", ""), href: a.url, image: a.image })),
            all: { href: SITE.hub, label: f.allServices[lang] },
          }}
          legal={f.madeWith[lang]}
        />
      }
    >
      <LandingHero
        kicker={l.kicker[lang]}
        title={<>{a}<StatePhrase on state="good">{word}</StatePhrase>{z}</>}
        lead={l.lead[lang]}
        actions={
          <>
            <LandingButton href="#plugins" variant="accent" size="lg" trail={ICONS.arrowDown}>{l.ctaPrimary[lang]}</LandingButton>
            <LandingButton href={SITE.store} variant="paper" size="lg" external>{l.ctaSecondary[lang]}</LandingButton>
          </>
        }
        note={l.statsLead[lang]}
        demo={
          <LandingTile index={0} kicker={c.searchHint} title={l.searchLabel[lang].replace("{n}", String(TOTAL_PAGES))}>
            <HeroSearch lang={lang} />
          </LandingTile>
        }
        demoLabel={c.searchHint}
      />

      <LandingSection id="plugins" kicker={`${GROUPS.length} ${c.tools.categories.toLowerCase()}`} title={plain(c.plugins.lines.join(" "))} lead={plain(c.plugins.lead)}>
        <Catalog lang={lang} />
      </LandingSection>

      <LandingSection id="how" kicker={l.structureKicker[lang]} title={l.structureTitle[lang]} lead={l.structureLead[lang]}>
        <LandingSteps steps={l.structureSteps.map((s, i) => ({ title: s.title[lang], body: s.body[lang], icon: STEP_ICONS[i] }))} />
      </LandingSection>

      <LandingSection id="features" kicker={l.featuresKicker[lang]} title={plain(c.tools.lines.join(" "))} lead={plain(c.tools.lead)}>
        <LandingBento>
          <LandingTile index={0} span={7} kicker="⌘K" title={c.tools.items[0][0]}>
            <p className="muted">{c.tools.items[0][1]}</p>
            <ul className="dl-mini">
              {l.searchExamples[lang].slice(0, 4).map((q) => <li key={q} className="l-li"><span className="k">⌘K</span><b>{q}</b></li>)}
            </ul>
          </LandingTile>
          <LandingTile index={1} span={5} hue="ink" kicker="AI" title={ai.title[lang]}>
            <p className="muted">{ai.body[lang]}</p>
            <p className="dl-q">{ai.question[lang]}</p>
            <p className="muted">{ai.answer[lang]}</p>
          </LandingTile>
          <LandingTile index={2} kicker="EN · ES" title={c.tools.items[2][0]}>
            <p className="muted">{c.tools.items[2][1]}</p>
            <div className="row dl-tags"><span className="tag solid">EN</span><span className="tag">ES</span></div>
          </LandingTile>
          <LandingTile index={3} hue="sunk" kicker={l.featureCopy.copied[lang]} title={c.tools.items[3][0]}>
            <p className="muted">{c.tools.items[3][1]}</p>
            <div className="l-li dl-code"><code>/exyliaffa arena create</code><span className="tag ok">{l.featureCopy.copied[lang]}</span></div>
          </LandingTile>
          <LandingTile index={4} kicker="config.yml" title={c.tools.items[4][0]}>
            <p className="muted">{c.tools.items[4][1]}</p>
            <ul className="dl-mini">
              {["arena.max-players: 16", "kit.cooldown: 30s", "storage.type: mysql"].map((x) => <li key={x} className="l-li"><code>{x}</code></li>)}
            </ul>
          </LandingTile>
          <LandingTile index={5} span={6} hue="sunk" kicker="llms.txt" title={c.tools.items[6][0]}>
            <p className="muted">{c.tools.items[6][1]}</p>
            <div className="l-li dl-code"><code>docs.exylia.net/llms.txt</code></div>
          </LandingTile>
          <LandingTile index={6} span={6} kicker={c.tools.items[7][0]} title={c.tools.items[5][0]}>
            <p className="muted">{c.tools.items[5][1]}</p>
            <ul className="dl-mini">
              {["/exyliaffa join", "/exyliaffa kit", "/exyliaffa stats"].map((x) => <li key={x} className="l-li"><code>{x}</code><span className="tag">cmd</span></li>)}
            </ul>
          </LandingTile>
        </LandingBento>
      </LandingSection>

      <LandingSection label={l.statsLead[lang]}>
        <LandingProof>
          <LandingStat index={0} hue="good" label={l.statPlugins[lang]} value={String(plugins.length)} />
          <LandingStat index={1} hue="paper" label={l.statPages[lang]} value={String(TOTAL_PAGES)} />
          <LandingStat index={2} hue="ink" label={l.statLangs[lang]} value={String(LANGS.length)} />
          <LandingStat index={3} hue="paper" label={c.tools.categories} value={String(GROUPS.length)} />
        </LandingProof>
      </LandingSection>

      <LandingFinal
        title={plain(c.start.lines.join(" "))}
        lead={plain(c.start.lead)}
        actions={
          <>
            <LandingButton href="#plugins" variant="accent" size="lg">{c.start.browse[0]}</LandingButton>
            <LandingButton href={SITE.discord} variant="light" size="lg" external>{f.support[lang]}</LandingButton>
          </>
        }
      />
      <SearchDialog lang={lang} open={search} onClose={() => setSearch(false)} />
    </LandingShell>
  );
}
