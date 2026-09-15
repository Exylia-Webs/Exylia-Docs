# Documentation status

What each plugin's documentation was last checked against, so a review can start from the last
verified commit instead of from the whole history.

**Reviewed through** is the newest source commit the docs are known to describe. Everything after it
in that repository is undocumented until somebody says otherwise.

Sources live in `~/Java/Exylia/<repo>`; override with `EXYLIA_SOURCES`.

```bash
scripts/doc-drift.sh              # every plugin
scripts/doc-drift.sh exyliaevents # just one
```

| Docs | Repository | Version documented | Reviewed through | State |
|---|---|---|---|---|
| `exyliaaimtrainer` | `ExyliaAimTrainer` | 1.0.1 | `1217ced` 2026-09-15 | Current — reviewed again for 1.0.1: punching the air no longer replays a finished drill (the summary and the hotbar do, and the rest hint is gone from chat and from the `session-complete` title), and the server-wide `training_count`, `match_count` and `playing_count`, and accuracy in a tracking drill reading time on target (`7376386`). First full documentation, nineteen pages, including the drill change from the drill list, summary and hotbar and the five-second idle rest: the four drill kinds and the sixteen shipped drills with every key, score, difficulty and rating, the grades, the player settings, duels on the challenger's rules and one seed, arenas from the admin menu, the session lifecycle and isolation, per-drill and overall boards, the HUD, the practice-queue borrow, the menus and `aimtrainer:` actions, and `AimTrainerService` (needs `exylia-api` `v1.153.0`). Written against the source, not the README or the config comments: several disagree (see below). |
| `exyliaarmorskin` | `ExyliaArmorSkin` | 1.0.0 | `c608783` 2026-09-03 | Current — wardrobe, per-piece permissions, twenty animated skins, the four body-aware animation types and the trim-metal cycle. |
| `exyliaarmortrims` | `ExyliaArmorTrims` | 1.1.0 | `1d83e8f` 2026-09-03 | Current — the cosmetic gate is a library contract, documented in the library’s Cosmetic rules page rather than per plugin. |
| `exyliaarrows` | `ExyliaArrows` | 1.0.5 | `2a7335b` 2026-09-03 | Current — rewritten for the 120 display-driven effects, the three triggers, tokens, the menu and the `arrows-effects` flag. |
| `exyliacapture` | `ExyliaCapture` | 1.1.0 | `c8c2ec7` 2026-09-02 | Current — typed durations noted. The database indexes and the admin menu layout were not worth a page. |
| `exyliachatcosmetics` | `ExyliaChatCosmetics` | 1.0.0 | `e1bf009` 2026-09-07 | Current — first full documentation: the shipped catalogue (180 tags in seven tabs, 90 nick, 96 chat, 90 shadow and 77 rank colours, 18 fonts, 5 modifiers, 18 animations), tag marks as sprites, particles and head skins with the 1.21.9 ceiling, the four custom kinds and the create/edit token economy, entitlements and expiry, the menus, and the whole built-in chat module across five pages, mentions included: a name is a mention with or without the `@`, and the nudge ships as a sound alone. Written against the source: the repository's own `docs/` predates the current catalogue by twelve commits. |
| `exyliaclans` | `ExyliaClans` | 1.1.0 | `7d014e2` 2026-09-08 | Current — reviewed for 1.1.0. `visibility-mode` now ships as `DISABLED` and has five values; the kick truce, the cross-server clan home, the 32-character role-name clean, the level-table bounds and the configurable `placeholders.na` / `placeholders.none` fallbacks are documented. Corrected against the source: the DTR regeneration arithmetic, `setdtr` having no lower clamp and clearing the freeze, the backfill running on every start, an expired regroup point still teleporting whoever is counting down, `pillar-duration-seconds` and the camp `duration-seconds` being inert, the sneak-any-click claim confirm, the camelCase columns, and SQLite never having been a backend. The standalone reflection jar is named on the API page. |
| `exyliaclasses` | `ExyliaClasses` | 1.0.0 | `d48bfe0` 2026-08-31 | Current — the only change since was a database index. |
| `exyliaevents` | `ExyliaEvents` | 1.5.0 | `0821e96` 2026-09-15 | Current — reviewed across the 87 commits of 1.3.0 to 1.5.0. 51 types (43 games, 8 team variants): Block Morph Hunt with every setting, settling, the miss penalty, taunts and the four prop items; King of the Hill Teams; Hide and Seek's flashing last stretch (`glow-flash-interval`, `-count`, `-ticks`), seeker cage, `seeker-glow`, no pushing, hidden names and the win going to the hiders; the reworked Anvil Running storm and its new keys; Dodgeball `ammo`/`refill-seconds`; the Race grid and `boat-collisions`; Glass Bridge `collisions`; Paintball `shot-cooldown`; no pushing in Trivia; the TNT Run one-block break; and the defaults that moved (Mace Roulette `miss-kills-macer` and `mace-hit-eliminates` now on, `red-grace-ticks` 10, Sheep Wars `throw-power` 2.8). Shared `bounds-border` and `music-enabled`, the per-player arena border, idle arenas refusing world mobs and explosions, `player-isolation`, `exyliaevents.start.<configId>`, nametags hidden without TAB, `event-catalog` in `messages.yml`, 24 trivia questions. API: `forceStart`, `openMenu` and the six lifecycle events (`exylia-api` `v1.133.0`). Corrected: `chat-isolation` is in `config.yml`, not `scoreboards.yml`; there is no `menus/user/es/`. **Left out:** keys that were already undocumented before this review — the LMS and Survival Games zone, Block Party's colour and seed growth, Brackets' and Tournament's freeze and damage switches, Volcano's growth and footprint. |
| `exyliaffa` | `ExyliaFFA` | 1.1.1 | `569a4f1` 2026-09-02 | Current — arena chat isolation and duration inputs documented. |
| `exyliahiteffect` | `ExyliaHitEffect` | 1.0.10 | `1fe222a` 2026-09-03 | Current. |
| `exyliakilleffect` | `ExyliaKillEffect` | 1.4.0 | `24746f4` 2026-09-11 | Current — the 100 effects in five categories (meme, void, cataclysm, lovestruck, cosmic), all built on the choreographed `[RAGDOLL]` step with `keys:`, `{killer}`/`{crowd}` bodies, `then:`, props, strings and chains, the `[PIXELS]` shape, the sound volume cap, the play/menu/unlock/key API and `KillEffectPlayEvent`, crate keys as an item, the reward queue with `rewards-claimed`, and crate blocks binding when their world loads. |
| `exylialib` | `ExyliaLib` | 1.128.0 | `4325202` 2026-09-08 | Current — chat rules, cosmetic rules, the display ceiling, region flags, log cleanup, the extra NPC motion, the ragdoll module (a body cut into its six parts, in eleven poses), and the pending-reward store the library keeps with `claimOnJoin`. |
| `exyliapractice` | `ExyliaPracticeCore` | 1.0.0 | `a8b3bf6` 2026-09-03 | Arena usages, the short `practice` identifier, `total_bot_players` and typed kit-rule durations documented. **Gap:** the Bot PvP module has no page at all — difficulties, its menus and `bot-name`/`bot-skin` are undocumented. |
| `exyliapracticebot` | `ExyliaPracticeBotV3` | 1.2.2 | `20ca313` 2026-09-06 | Current — first full documentation: the seven combat models and their per-mode config, the five-rung skill ladder, the gear and buffs a player tunes, both menu files and the eleven `practicebot` actions, attack/follow and the three automatic removals, `max-bots` against the slider bounds, and the API. Written against the source, not the config comments: two of those are stale (see below). |
| `exyliasandbox` | `ExyliaSandBox` | 1.0.3 | `7e6b005` 2026-09-06 | Current — first full documentation, eighteen pages: the generated worlds and their five terrain presets, the RTP and its 1v1 queue matcher, kits and the permission tier that counts down from 100, the kit room, the teleport pads, the admin panel, the nineteen menus, the seven tables and `SandBoxService`. Two things are documented as broken rather than as promised: the kit-room category editor never writes back, and finishing a pre-generation shuts the server down. |
| `exyliashields` | `ExyliaShields` | 1.0.4 | `83a54f9` 2026-09-01 | Current — the only change since was a database index. |
| `exyliastaff` | `ExyliaStaff` | 1.3.1 | `5434a74` 2026-09-08 | Current — reviewed for 1.3.0. Four module pages added: inventory restore (causes, retention, the five screens, the eleven parts and the offline queue), reveal, AFK and the action bar. The staff armour is no longer really worn: it is stated to the players around the wearer as an overlay, corrected on **Staff mode** and **First steps**. Left out on purpose: global chat, which is one hotbar button and three modes, and the scoreboard, documented inside **Staff mode**. |
| `exyliasurvivalcore` | `ExyliaSurvivalCore` | 1.2.2 | `da1b53b` 2026-09-14 | Current — reviewed across 90 commits, then again at `da1b53b` for the economy placeholders: the balance names moved here from ExyliaLib `1.162.1`, the `survivalcore` short identifier, and `vault` resolving to the stored currency Vault serves; thirty-one pages. Twelve new pages for the eighteen new modules, in two new nav groups: **Economy** (stored currencies, the Vault bridge and the ledger moved from ExyliaLib, boosters, sell wands and autosell; the shop; market, auctions and orders; trade and vaults) and **Protections** (regions on the internal or WorldGuard backend, raids, banks/upkeep/rent/upgrades, the admin side and the ProtectionStones import), plus duel rooms, optimization with the item updater, rewards and votes, missions and seasons, and graves inside Combat. Every existing page brought up to date: counters in stats, prestige, cross-server TPA and `/back`, the `teleport` section, BundledFiles-managed owner menus, fifty switches, 118 menus, 72 tables, 337 actions. The API page covers `exylia-api` `v1.133.0` (checked at `v1.160.2`). Written against the source; the stale comments and the broken behaviour are listed below. The other commits up to `da1b53b` (Vault registration at enable, cross-server auction locks, rank-up charging once, protection corner pillars, duel room borders) are not yet reflected. |
| `exyliatotemtrainer` | `ExyliaTotemTrainer` | 1.0.0 | `6ec68a0` 2026-09-04 | Current — first full documentation: the six shipped modes as four choices, grading and score, duels with draws and the even-format rule, arenas from the admin menu, per-mode leaderboards, the `totem_` PlaceholderAPI spelling. Blackout and `close-inventory` documented. |

## The API pages

Every plugin's **API** page was rewritten on 2026-09-06 for the new API system, and they are current
for the whole suite regardless of what each row above says. A row's *reviewed through* still refers
to the rest of that plugin's set, not to its API page.

What changed: the per-plugin reflection jars and static facades are gone. There is now one published
artifact, `com.github.DiGround-s.ExyliaLib:exylia-api`, holding every service, record, enum and event
in the suite, reached through `net.exylia.lib.api.ExyliaAPI`. Documented against `exylia-api` at
ExyliaLib `befa514` — release tag `v1.113.0`, the tag JitPack builds and the one the pages name.

| | |
|---|---|
| Hub page | `exylialib` — integration for Gradle, Gradle Kotlin DSL and Maven, the lookup, timing, events, and the classloader reason the artifact must be `compileOnly`. New page. |
| Rewritten | The 14 plugins that already had an API page. |
| New | `exyliasurvivalcore`, which had none and now publishes 31 methods and 6 cancellable events. Registered in `SURVIVALCORE_NAV`. |
| Added later | `exyliachatcosmetics` (`CosmeticsService` and `ChatService`) and `PracticeBotService`, which the artifact already published but the hub table had not listed. |
| Added later | `exyliasandbox` (`SandBoxService`), once that plugin's set was written. |
| Updated | `exyliasurvivalcore` on 2026-09-14 for the rtp, kit-gift, crate-key, rank-cost, bounty, mine-break and six menu-opener methods and four new events, naming `v1.133.0`. The hub's "What is not there" no longer says menu openers are left out. |
| Not documented | ExyliaBetCore, ExyliaSpecialsV3, ExyliaPearls and ExyliaTotems all publish a service, but have no documentation set on this site at all. They are absent from the hub's service table for that reason. |

The source of truth for these pages is
`~/Java/Exylia/ExyliaLib/exylia-api/src/main/java/net/exylia/lib/api/`, not the plugin repositories:
the interfaces carry the javadoc that says why each method behaves as it does.

### Two stale strings in ExyliaPracticeBotV3

Found while writing this set and documented as behaviour rather than as promised. Both claim that
picking a combat mode applies that mode's kit. It does not: `Loadout.of(mode).applyTo(settings)` runs
only from the `BotSettings` constructor — first creation and `/bot reset` — and from
`PracticeBotServiceImpl` on an API spawn. `set_mode` and `cycle mode` call `setMode` and nothing else,
which is the intended behaviour: `Loadout`'s javadoc and the menu item's own lore both say the kit
stays as the player left it.

- `MessagesDefaults` default for `bot.mode-changed`: *"Mode set to %mode% » kit applied."*
- `BotDefaults`' `@Comment` on `bot.mode`: *"Picking a mode applies that mode's kit AND its combat model."*

The pages describe what the code does. If the strings are corrected, nothing here needs rewriting.

### Fields ExyliaChatCosmetics declares and does not use

Found while writing that set. Each is read from the file without complaint and reaches the definition;
nothing then consumes it. The pages say so rather than describing an effect that does not happen.

- `requirement` on any cosmetic entry: parsed by `CosmeticInfo.read` and copied through
  `RankColorType.withoutPermission`, never evaluated. `BrowserRows` filters on `hidden()` alone.
- `safe` on a font: reports whether the glyphs live in the basic plane. No menu value exposes it and
  nothing restricts a font by it.
- `animation` on a custom cosmetic: the column exists and both renderers honour it, but every caller
  of `create` and `edit` passes `null`, so nothing writes one.

Its own `docs/` folder is a version behind the plugin — it was last touched at `e6d264b`, twelve
commits before `4e4428b`, and its tags, fonts, menu-default and command sections all predate what
ships. The site's pages were written from the source; the repository's notes were used only where the
source confirmed them.

## How a review goes

1. `scripts/doc-drift.sh` — see what moved.
2. Read the source for what it names, never the commit message alone.
3. Update both languages of the affected pages, and `src/content/registry.ts` when the version,
   tagline, summary or navigation changes.
4. `pnpm build`, then check the generated `out/` for broken links and anchors.
5. Move the row's **reviewed through** to the repository's `HEAD` and note what is left.

## What is deliberately left out

Not every commit is documentation. Database indexes, refactors, internal fixes and packet-level
performance work change nothing a server owner reads or writes, and a page that lists them is a page
nobody trusts. What earns a change: a new file, key, command, permission or placeholder; a default
that moved; a rule a player can feel; a limit an owner can hit.

## Conventions worth keeping

- Every English page has a Spanish twin with a translated slug, registered in `src/content/registry.ts`.
- Nothing goes in the documentation that was not read in the source. Commit messages describe
  intent; the code describes behaviour.
- Placeholder tables list the whole placeholder, not just its tail: every name is written complete,
  with its `%` signs and its full prefix, and each one gets its own row and its own description. Never
  a bare suffix, never two names sharing a row, never a group standing in for the placeholders under it.
- One identifier per plugin: its own name. ExyliaLib removed `Placeholders.identifier(...)`, so the
  short `practice`, `survivalcore`, `exyliaaim` and `exyliatotem` identifiers no longer exist. A plugin
  whose registered names carry a short group prefix (`staff_`, `classes_`) is a different case: the
  reference page writes the PlaceholderAPI form, and the pages that document that plugin's own YAML keep
  the registered name and say once why the two differ. ExyliaAimTrainer and ExyliaTotemTrainer register
  under their plugin name, so both forms are one: `%exyliaaimtrainer_<name>%`, `%exyliatotemtrainer_<name>%`.

### Where ExyliaAimTrainer's own notes disagree with its code

The pages follow the code. The README and `docs/ARCHITECTURE.md` were used only where the source
confirmed them.

- **Standing still is not a setting.** The README and the architecture notes describe it as the player's
  choice; `HudService.show` always freezes, `Preferences` has five toggles, and the profile's `freeze`
  column is legacy. `AimPreferences.freeze` always returns `true`.
- **Sixteen drills ship, not eleven.** `GlobalDefaults.defaultDrills()`; `DrillKind`'s javadoc still says
  three kinds.
- **`match.use-preferences`** claims each player keeps their own size and distance. Both sides play rules
  built once from the challenger's preferences, colour and style included; a rematch reuses them, seed and all.
- **`match.allow-even-formats`** claims a tied even series is replayed as a decider. Whoever wins the last
  round takes it. Three draws in a row give the duel up (`MatchRunner.DRAW_LIMIT`).
- **A drill needs a ready arena.** The architecture notes and `TrainingSession.arenaId`'s javadoc say it
  runs where the player stands; `TrainingService.start` refuses.
- **`menus/hotbar.yml` is not editable** — overwritten from the jar on every start and reload — and
  `menus/admin/` is refreshed on every reload too, not only on start. `AimMenus`' comment about a `.new`
  file describes nothing the library does.
- **The reset confirmation says "every record, session and duel"**; `aim_matches` rows stay.
- **Placeholders** were renamed after 1.0.1: the group is now the plugin name, so every name is
  `%exyliaaimtrainer_<name>%` everywhere. The old `%exyliaaimtrainer_aim_<name>%` and `%aim_<name>%` no
  longer resolve; the pages and the README agree.
- **README's ExyliaLib floor** (1.153.0) is below what the menus need (`refreshVersionedDirectory`, 1.156.1;
  `BundledFiles`, 1.158.0). The pages name no floor for the plugin.

Behaviour documented in place rather than promised: an accepted duel before the arenas load never starts
and says nothing; `/aim duel <player>` without a drill plays the first drill in the file, not
`default-drill`; a `default-format` missing from `formats` refuses every duel sent without a length; tab
completion offers `overall` and even lengths that are then refused; no `admin_*` or player menu action checks
a permission node; `admin_session_stop` has no confirmation and ignores duels; `max-players-per-arena` is
checked before arrival, so a duel can put an arena one over; a board only drops its cache when a run beats the
best rating; `leaderboard.cache-seconds` and `history.prune-interval-minutes` need a restart; COMBO keeps three
blocks of reach while the fighter closes only to the scaled distance, so a distance multiplier past about ×1.10
at size ×1.00 keeps it out of reach (derived from the code, not tested in game); `menu.reason-self` and
`menu.difficulty-label` are written and never read; the practice prompt's *OPEN DRILLS* button opens `/aim`.

API: `duel()` with an unknown drill returns `false` silently and never validates `bestOf`;
`AimRoundEndEvent` fires before the round's win is counted; a replay stores the cut-short run without an end
event and fires no new start event.

### What ExyliaSandBox does that the docs call out rather than promise

Both are behaviour, not roadmap. The pages describe what the code does.

- **The kit-room category editor never saves.** The grid opens, accepts drops and closes; the listener
  that would write it back is written but never registered, so every change is discarded. The pages
  point owners at **Reset to Defaults** instead.
- **Finishing a pre-generation shuts the server down.** `Bukkit.shutdown()` is called when the queue
  drains, with the log line *"All worlds pregenereted. Restarting server..."*. Intended for the first
  boot; it fires the same way when a world is created from the panel on a live server.

Smaller ones, all documented in place: `disable_powder_snow` is toggled and read but never persisted;
`heightVariation` and `stoneVariants` are stored and never read; the three `kit-creator.*-input-title`
blocks in `config.yml` are orphaned; `back.outside-world` and `queue.select-kit` are never sent;
deleting a teleport pad or a kit-room category asks for no confirmation; and the five seeded kit-room
categories are still Spanish.

### Stale comments and defaults in ExyliaSurvivalCore

The generated files and the javadoc disagree with the code in these places. The documentation follows
the code and says so on the page where it matters.

- **Menu headers.** 34 of the 49 `menus/admin/*.yml` still say *"This file is yours to edit… never
  overwritten"* and 12 say *"REGENERATED ON EVERY STARTUP"*; the directory is deleted and re-extracted on
  every enable, `/sc reload` and `/exylialib reload`. The `duelroom_*` screens have no header. Six owner
  menus (crates history/preview, economy wallet/top/history, `menus/currency_select.yml`) say *"written
  once"* and now receive new keys through BundledFiles. `SurvivalMenus`' comment describes the opposite
  header.
- **`ranks.yml`'s header lists requirement types `kills` and `level`.** Neither exists. The real set is
  `money`, `playtime`, `placeholder` and `permission`.
- **`messages.yml` → `admin.usage`** still names `delhome` and `listhomes` as `/survivalcore`
  subcommands; **eight warmup defaults are still in Spanish**, and TPA's English action bar reads
  *"Teleportando en"*.
- **`teleport.*` keys nobody reads:** `safe-search-radius`, `safe-max-attempts`, `back-history-size`,
  `tpa-expiry-seconds`, `tpa-max-pending`, `random-max-attempts`.
- **`repair/groups.yml`** names `survivalcore.repair.group.<key>` and says the priciest group wins; the
  code checks `exyliasurvivalcore.repair.group.` and takes the first match in file order.
- **`votes.yml`** says streak rewards are paid once; they are paid every time the streak reaches the
  number again. **`stats.yml`**'s counter list omits the new modules' counters, and `Stats`' javadoc
  example `duels.win_streak` is counted nowhere.
- **Economy:** `EconomyModule` and `CoreDefaults` still place the currencies in `currencies.yml` or in
  ExyliaLib; they are in the database. `BoosterType.MONEY` omits votes. A currency's `networked` flag is
  stored and toggled and read by nothing.
- **Shop:** `ShopModule` claims one catalogue across servers; `ShopManager` loads once and keeps stock,
  limits and demand per server.
- **Trade:** the `currencies` comment says item and experience currencies never qualify and the window
  holds four; every known currency is offered, 28 per page.
- **Protections:** `Renting.maxPeriods` reads "at once" and is a lifetime cap; `raidEnemyWarned` is never
  sent.
- **Graves:** `expire-minutes` names only `-1` for never; `0` is never too.
- **API javadoc (ExyliaLib):** `SurvivalKit.maxUses` says `0` is unlimited, the plugin uses `-1` and `0`
  refuses the first claim; `DuelRoomEndEvent` lists one case with no event, there are four, and a fight
  cancelled for inactivity fires it with a `null` winner.
- **`scheduled-commands`**' `daily_bonus` gives `eco give @a 50` and announces *"1000 shards"*.

### Things ExyliaSurvivalCore does not do, documented as such

- `/stats` is **never registered** — rewritten for offline players, the method still has no command
  annotation. The screens open from `survivalcore:stats_open`, the viewer's own profile only.
- `/bounty cancel` cancels nothing; `bounties.anonymous` is inert (`bounty_place_confirm.yml` passes
  `false`).
- **Rankup charges twice:** `/rankup claim` takes the money requirement and every shipped rank runs
  `eco take` as well. An automatic rank-up charges nothing and fires no `RankUpEvent`.
- **Market and auctions do not sync across servers.** Listings stay on their server, and two servers'
  bids overwrite each other's row — the overwritten bid is never refunded. Orders do sync.
- **ExyliaLib's `default-currency: vault`** is not a stored currency, so with it `/baltop`, the history
  and the top placeholders are empty, and `/pay` skips the currency's permission, minimum and tax. The
  economy page says to set a stored id.
- **Permissions:** nothing is declared in `plugin.yml`, so every node defaults to op. `SPAWN`,
  `RTP_BYPASS` and `SHOP_CATEGORY_PREFIX` are declared and never checked; `shop.sell.<multiplier>` is
  checked and never declared. `/spawn`, `/reclaim` and `/playtime` check nothing and the last two write;
  the crate block, the vault actions and the reward actions check no node; selling from a shop category
  skips `shop.sell`. `protections.bypass` needs the node set explicitly, so operators do not pass it.
- `/autosell` with `player-settings` off answers *on* and changes nothing, and autosell is then always on.
- A TPA sender who moves to a third server before the answer is never teleported, though the target is
  told it was accepted. `teleport.warmup-seconds` also delays teleports meant to be instant.
- Portals have no server column: on a shared database every server loads every portal.
- WorldGuard backend: an abandoned protection opens building and explosions to everybody, wider than
  the internal backend. Imported ProtectionStones regions kept in WorldGuard (the default) block
  upgrading, merging or moving over them.
- Seasons over a best-value counter rank nobody; an unknown `counter` closes with no winners.
- No bare `/afkzone` and no bare `/repair`; `/autotpaaccept` duplicates `/tpatoggle autoaccept`;
  `spawner_import_from_chest` and `lc_import_from_chest` are unreachable from any shipped menu.

Smaller ones are documented on their pages and not repeated here: the shop's restock rounding and
hotbar-first selling, the trade window's accept rules, vault caps, reward and vote timers that need a
restart, mission targets that can roll 0, the optimization module's silent block limits and stack
respawns, and the item updater's ender chest.
