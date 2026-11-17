# Writing the Exylia docs

Who reads these pages: a **server owner who just bought the plugin**. Not a developer. They want to
get something working ("set up my first arena", "change the colours", "give VIPs a kit"), and only
later look things up (permissions, placeholders, API). AI assistants read the same pages (the
ExyliaTickets support bot crawls them, outside models read `/llms.txt`), so every page must also
answer a question on its own.

## Sidebar shape (every plugin)

| Group (en / es) | Pages |
|---|---|
| Getting started / Empezar | `introduction` (what it does, what you need, what you will have in 10 minutes), `installation`, one quick start: "Your first <thing>" / "Tu primer(a) <cosa>" that ends with the feature working in game |
| Guides / Guías | One page per task, titled with a verb: "Create an arena", "Add spawns", "Reward kill streaks". 4–12 pages. This is where most readers live |
| How it works / Cómo funciona | Optional. Systems explained plainly (combat rules, how stats are counted) for plugins that need it |
| Reference / Referencia | `commands`, `permissions`, `placeholders`, `configuration`, `api` (only if the plugin has one) |
| Help / Ayuda | `troubleshooting` ("Common problems" / "Problemas comunes") and `faq` |

The group **Customise (all Exylia plugins)** is appended automatically to every sidebar from
`SHARED_GROUP` in `src/content/registry.ts` (ExyliaLib's colours, messages and languages, menus,
economy, database). Never copy those topics into a plugin: link to them.
Plugins that run without ExyliaLib set `standalone: true` in the registry.

**Keep existing slugs.** Old URLs are linked from BuiltByBit, Discord and search engines. Rename
titles and move pages between groups freely; when a page's content becomes a guide, keep its slug.
New pages get new slugs (English slug in `en`, Spanish slug in `es`). Remove a page only when its
content truly moved; then fix every link to it (the test finds them).

## Voice

- Second person, short sentences, plain words. Spanish uses **tú**, natural Spain/LatAm-neutral
  Spanish, never a literal translation of the English.
- Start every page with what the reader will get, in one or two sentences. No history, no
  architecture, no "this module is responsible for".
- Name things the way the player sees them: the button text in the menu, the command they type.
  Internal names (`arenaId`, `iconMaterial`, class names, enum values) only in Reference or inside
  `<Details>`.
- Say defaults and limits plainly: "By default everyone can join. To limit it, …".
- One idea per paragraph. Tables only when the reader compares rows; otherwise a list or steps.
- No filler: no "simply", "just", "powerful", "seamless", no emoji.

## Guide page template

```mdx
---
title: "Add spawns to an arena"
description: "Let players appear in different places, pick where they drop, or get a VIP spawn."
questions:
  - "How do I add a spawn?"
  - "Can players choose where they spawn?"
  - "How do I make a spawn only for VIPs?"
updated: "1.5.0"
---

One or two sentences: what the reader ends up with.

## Before you start

Only if something must exist first (an arena, a region, another plugin). Link to its guide.

## Steps

<Steps>
  <Step title="Open the arena">
    Run `/ffaadmin`, click **Arenas**, then your arena.
  </Step>
  <Step title="…">…exact buttons and commands, in order…</Step>
</Steps>

## Check that it works

What to do in game to see it working, and what you should see.

## Going further

Variations as short sections ("Make a VIP spawn", "Let the game pick the spawn").

<Details title="Technical details">
Field tables, YAML keys, edge cases: kept for the people who want them.
</Details>

<Cards>
  <Card title="Next: Create a kit" href="/docs/exyliaffa/kits">One line on why.</Card>
</Cards>
```

`questions` (3–6, in the page's language) are how a real person would ask; search and the AI
assistant match on them. Write them in both languages.

## Reference data: `content/<plugin>/data.json`

Commands, permissions and placeholders are **data**, not hand-written tables. One file per plugin
(shared by both languages):

```json
{
  "commands": [
    { "usage": "/ffa join <arena>", "permission": "exyliaffa.commands.join", "group": "player",
      "en": "Join an arena.", "es": "Entrar en una arena." }
  ],
  "permissions": [
    { "node": "exyliaffa.admin", "default": "op", "group": "admin",
      "en": "Open /ffaadmin and every admin menu.", "es": "Abrir /ffaadmin y todos los menús de admin." }
  ],
  "placeholders": [
    { "key": "%exyliaffa_kills%", "example": "128", "group": "stats",
      "en": "The player's total kills.", "es": "Las kills totales del jugador." }
  ]
}
```

- `default` is `"true"` (everyone), `"op"` or `"false"` (nobody until granted).
- `group` is free text; use it to show a slice on a guide page: `<Commands group="admin" />`.
- `aliases` (commands) is optional.
- Draw them with `<Commands />`, `<Permissions />`, `<Placeholders />`. Another plugin's rows:
  `<Permissions from="exylialib" />`.
- Every row comes from the source: `plugin.yml`, the command classes, the PlaceholderAPI expansion.
  The tables get a filter, copy buttons and a link per row (`#row-<slugified first cell>`).

The `commands`, `permissions` and `placeholders` pages keep a short intro ("how to give a
permission with LuckPerms", "placeholders need PlaceholderAPI") and then the component, plus prose
only for what a table cannot say (per-arena nodes, wildcards).

## Components

| Component | Use |
|---|---|
| `<Steps>` / `<Step title>` | Every procedure |
| `<Callout type="tip\|note\|warning\|danger" title>` | One per idea, never two in a row |
| `<Cards>` / `<Card title href>` | Next steps, choices |
| `<Details title>` | Technical tables and edge cases that most readers skip |
| `<Commands />` `<Permissions />` `<Placeholders />` | Reference data, optional `group` / `from` |
| `<Since v="1.5.0" />` | After a heading, for what a version added |

Links are written without a language: `/docs/exyliaffa/kits`, `/docs/exylialib/colours`. They get
a hover preview automatically. Link generously: every mention of a command, permission or feature
documented elsewhere is a link. Colours, messages, menus, economy and database go to the shared
ExyliaLib pages.

## For the AI readers

- Each page stands alone: write the plugin name, the full command and the file name, not "as above".
- Facts as facts: defaults, limits, which version, which file. A model answers what the page says.
- Content inside `<Details>` stays in the HTML and in `/llms.txt`, so nothing is lost by folding it.
- Do not paste secrets or real server addresses.

## Accuracy

Sources live in `~/Java/Exylia/<Repo>` (the mapping is in `DOCS-STATUS.md`). Every command,
permission, placeholder, button label, default and file name is checked against the source and its
`src/main/resources` (menus, `lang/`, `config.yml`). If the source and the old docs disagree, the
source wins. Never invent a feature; if unsure, leave it out and say so in your report.

## Check before committing

```bash
DOCS_PLUGIN=exyliaffa pnpm test   # pages exist, compile, links resolve, data rows exist
pnpm typecheck                    # only if you changed code
```
