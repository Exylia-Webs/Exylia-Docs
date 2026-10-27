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
| `exyliaaimtrainer` | `ExyliaAimTrainer` | 1.2.0 | `c8dcbfc` 2026-10-23 | Current — reviewed for 1.2.0: `training.lock-rotation` (true); menus updated for the redesign (settings hub + targets/screen pages, `format`/`leaderboard_sort` actions, confirm.yml removed); Java reach via stand-in hitbox; tr added. Earlier: reviewed for 1.1.0: Bedrock (slime targets, Java and Bedrock records, boards and profile totals apart, the leaderboard edition button and `leaderboard_edition`, `top_bedrock_`/`top_java_` placeholders, lifetime placeholders per viewer edition; the API boards stay Java), `flick_180` and `flick_360` (eighteen drills, `spread.yaw` up to 360, migration 7), `language` and `lang/<code>/` (en, es, pt, fr, ru; `lang/custom` on update) with `feedback` and the boss bar text moved to `messages.yml` (migrations 5 and 6), `exyliaaimtrainer.use` and every menu action now checking its command's node, `match.duel-request-cooldown`, duels from inside a drill and refused for queued players, per-round and rematch seeds, `scoring.max-ping-correction-millis` and `min-reaction-millis`, REACTION difficulty as the weight alone, runs cut short no longer stored, the 2 s start throttle, `arena-unreachable` and `could-not-start`, leaving the arena's world keeping the player there, the held-player item guards, an editable `hotbar.yml`, and the overall rating recomputed from records. |
| `exyliaanalytics` | `ExyliaAnalytics` | 1.1.0 | `4a0f759` 2026-09-23 (web `582685c`) | Beta — first full documentation, twenty-one pages, written against the agent at `4a0f759` and the Exylia Analytics web platform (`~/Web/Exylia-Analytics`) at `582685c`. The agent: the one loader jar for Paper/Spigot 1.17+, Folia and Velocity, `loader.yml`, role detection, the four `config.yml` keys, the data folder, device-code linking, every event with its sender and fields, the queue/spool/backoff and every ingest answer, a privacy page listing what leaves the server and what never does (and IP hashing/encryption on arrival), the economy sources and dedup rules (ExyliaLib, the Vault/VaultUnlocked pass-through proxy, PlayerPoints, ExcellentEconomy, balance snapshots, ExyliaLib holdings), the integrations, `/analytics` and `/analyticsv` with the status readout, remote config (intervals, bounds, nine modules, revision refetch) and the API. The dashboard: pages, filters and server-filter semantics, charts, Overview, live feed, command palette, annotations, growth/retention/acquisition/campaign definitions, players and profiles, sessions, servers (status, pause, revoke, proxy mapping) and performance, moderation, ranks, placeholders, events and funnels, Tebex revenue and creator codes, the AI analyst, members, roles and every permission, settings. Left out on purpose: the platform admin panel, AI provider and deployment configuration, the ingest's operations. Written against the code; the discrepancies and broken behaviour are listed below. |
| `exyliaarmorskin` | `ExyliaArmorSkin` | 1.3.0 | `f905147` 2026-10-23 | Current — reviewed for 1.3.0: `behaviour.disabled-worlds` (default [], skins hidden), `/armorskinsadmin` hub, confirm on wardrobe/unlocks/crate block/showcase clear, Turkish. Earlier: reviewed for 1.2.0 from `c608783`: the crate on ExyliaLib (new page: 14 common, 12 rare, 9 epic and 5 legendary skins, keys on the account or as items, a winner worn in one click, `crate.reward`, crate blocks, `unlocks`), locked skins bought from the wardrobe with `shop.tier-prices` or a skin's own `price`, `showcase` mannequins, `language` and the files under `lang/<language>/` with `messages.yml`, `require-permission` gone (items never ask; node or unlock decides the wardrobe and `hide-without-permission`), offline `wardrobe clear`/`keys`/`unlocks`, the four crate placeholders (new page), and the 1.2.0 API (`shown`, `giveSkinItem`, `removerItem`, `openWardrobe`, `SkinApplyEvent`, `WardrobeChangeEvent`). Older drift fixed: 40 skins and 41 animation presets (docs listed 20 and 21), `exyliaarmorskin.wardrobe` defaults to `true`. |
| `exyliaarmortrims` | `ExyliaArmorTrims` | 1.4.0 | `d86de4a` 2026-10-23 | Current — reviewed for 1.4.0: `behaviour.disabled-worlds` (default [], trims hidden), `/armortrimsadmin` hub, confirm on unlocks/crate block/showcase clear, Turkish. Earlier: reviewed for 1.3.0 (everything since 1.1.0): the crate on ExyliaLib over presets, patterns and materials (new page: 47 prizes in four rarities, keys on the account and as items, `crate.reward`, crate blocks, `unlocks` as a second way to own), the currency shop (`shop.tier-prices`, per-entry `price`, purchasable templates, `armortrim:buy`), showcases (`showcase` block and subcommands), `language` with `lang/<language>/` files and player text moved to `messages.yml`, `require-permission` removed (menu always asks, items never), offline `set`/`clear`/`keys`/`unlocks`, four crate placeholders, the database opened in every mode, and the API's `shown`, `giveTrimItem`, `removerItem`, `openMenu`, `TrimSelectionChangeEvent` and `TrimApplyEvent`. |
| `exyliaarrows` | `ExyliaArrows` | 1.6.0 | `be3f37c` 2026-10-23 | Current — reviewed for 1.6.0: `disabled-worlds` (top-level, default [], no launch/trail/impact), `/arrowsadmin` hub, confirm on player/unlocks/crate block/showcase clear, favourites confirm, Turkish. Earlier: reviewed for 1.5.0 (range `8747e38..ebee590`): the crate on ExyliaLib with keys and unlocks carried over once from `arrows_players` and old key items still opening it, the menu shop (`shop.enabled`, `shop.tier-prices`, per-effect `price`, ExyliaEconomy or Vault), arrow-range `showcase` locations, `language` and the `lang/<code>/` files with every player-facing string moved to `messages.yml`, `require-permission` gone (tokens never ask, the menu always does), offline targets for `player`, `keys` and `unlocks`, rewards queued instead of dropped, the new projectile defaults, `trail.max-active-per-player`, the new menu slots, and the API's play, attach, preview, menus, unlocks, keys and `ArrowEffectPlayEvent`. |
| `exyliacapture` | `ExyliaCapture` | 1.3.0 | `4a97151` 2026-10-23 | Current — reviewed for 1.3.0: running events menu (`/captureadmin list`, setup start/stop), start-failure reasons, DTC `core-blocks`/`rotate-on-regen`/`idle-block`, `capture` modifier source with `capture:<id>` scope, ru/tr. Earlier: reviewed for 1.1.1: the eighth type, Bounty, with its settings, tokens and placeholders; the three API events (`CaptureStartEvent`, `ZoneCaptureEvent`, `CaptureEndEvent`) and `openMenu`; `config.yml` version 3 with `event-visuals` keyed by type and the per-type sidebars; schedules on the ExyliaLib module with `every`, gates and the ExyliaLib timezone; ExyliaStaff players on duty ignored; full-inventory rewards queued. Corrected: the leaderboard keys, the boss-bar `colour`/`overlay` keys and the multi-event `line1-format`/`line2-format`. The repository's `DOCUMENTATION.md` is stale and was not used. 1.2.0: Discord webhooks (new Webhooks page), `language` with `lang/<code>/` and the `lang/custom/` migration, `config.yml` version 5 moving boss bars and hologram lines into `messages.yml`, the SurvivalCore HUD (timer, beam, zone border, HUD bar, waypoint icons) and `/exylialib pendingrewards`. |
| `exyliacasino` | `ExyliaCasino` | 1.0.0 | `fd7776c` 2026-10-26 | Beta — first full documentation, nine pages per language (no API page: no public API or events), written against the source. Premium on the Lukittu loader (`Exylia-Casino-Loader.jar`), sold outside BuiltByBit (store not decided yet): `bbbResourceId` is empty, the registry entry has no `purchase`, and the licence key goes in `loader.yml` → `license_key`. Needs ExyliaLib 1.356.0. The seventeen games grouped on one `games` page with every option, payout and RTP; `config.yml` from `CasinoConfig` (booth keys from ExyliaLib's `EnclosureTheme` at 1.356.0). Documented as the code behaves where its comments differ: an idle round is forfeited (`HouseService.leave` settles 0), not cashed out or refunded as the `idle` comments of the module files say; the `enabled` comments name a 'chance' category in `config.yml` that does not exist; `language` says en or es while en, es, ru and tr ship. Never link this set from anything ExyliaTabletop publishes on BuiltByBit. |
| `exyliachatcosmetics` | `ExyliaChatCosmetics` | 1.3.0 | `89b1090` 2026-10-23 | Current — reviewed for 1.3.0: admin player hub (history/grants/tokens), `/cc loadout list` and `/cca list` open menus, `/cca chat history`/`forget`, `_still` placeholders, web editor, Turkish. Earlier: 1.2.0 checked: the `language` key (en, es, pt, fr, ru) and `lang/<language>/messages.yml`, and the chat cooldown line's `%time_left%` beside `%time%`. Resolved 2026-10-14 (config layout, en and es): Configuration rewritten to the current `Settings` record (`modules`, `defaults` per group, `shop` with `tier-prices`, `rank-colors.keep` replacing `repaint`; `chat.default-color`, `chat.module.enabled` and the `menu` section gone, the latter moved to `messages.yml`); Installation's file trees now show `lang/<language>/` (messages, the twelve menus, the chat module's messages and announcements), `cosmetics/presets.yml`, the loader jar, the ExyliaEconomy/Vault softdepends, the chat module on by default and bundled files refreshed through ExyliaLib; every page quoting a removed key or path updated; the `/cosmetics` and `/exyliachat` aliases removed. Still behind: no presets page (`/cc presets`, `/cc preset <id>`, `exyliachatcosmetics.preset.*`, the preset placeholders), the five staff screens and `/cca menu` only named, name and rank shadows not on the colours page, no buying page beyond the `shop` keys, the chat hardening (`d1be4e5`) and the cross-server sync of tokens, customs and loadouts (`1a0a5f5`) unreviewed; the registry entry has no `purchase` link although the plugin now ships as a loader jar. |
| `exyliaclans` | `ExyliaClans` | 1.3.0 | `eca4838` 2026-10-23 | Current — reviewed for 1.3.0: new Clan wars page (arenas, kits, rule sets, spectators, `wars.yml`, placeholders, tables), `/clanadmin` menus + confirm, `MANAGE_WARS`, `modules.wars`, level modifier perks with migration, `clan-exp`/`clan-kills` boost, ru/tr. Earlier: reviewed for 1.2.1. New: the per-clan Discord webhook page (menu, `/clan webhook` and its forms, `MANAGE_WEBHOOK`, the `webhooks` block, `webhooks.yml` templates, `clan_webhooks`); the `language` key and the `lang/<code>/` layout (en/es/pt/fr, `default` following ExyliaLib, 1.1.0 files adopted into `lang/custom/`), with the relational labels, boss bar texts and teleport titles moved from `config.yml` into `messages.yml`; `/clanadmin setslots` and `clans.extraSlots`; `FOCUS`, `CAMP` and `RALLY` as rank permissions (granted once to existing ranks), `/clan rally clear`, and every one of the 28 permissions toggleable in the role menu; invites and alliance requests both expiring on `invite-expire-seconds`, stored, with the 30-second sweep; the create, invite and mail waits and the rival-notice throttle; the plugin.yml permission block (commands default `true`, `exyliaclans.admin` parent of every admin node); cross-server sync on the database page; SurvivalCore native rally, map icons, chat tabs, team panels and keybinds; centred clickable prompts; the API's `roles`, `relation`, `addExp`, `adjustDtr`, `joinClan`, `setRole`, `openMenu` and the eight clan events (`exylia-api` `v1.133.0`); menu updates through `/exylialib updates`; reload starting and stopping modules; ExyliaEconomy soft-depend. Corrected against the source: camp `duration-seconds` now expires the marker, an expired regroup point cancels running countdowns, explosion filtering only under `BUILTIN`, a shrunk clan's DTR clamped to its new maximum, `PROMOTE`/`DEMOTE` enforced by direction; 1.2.1 makes a mistyped `visibility-mode` fall back to `DISABLED`. 1.2.1 ships the loader `plugin.yml` with `exyliaclans.admin.setslots` and the ExyliaEconomy soft-depend. |
| `exyliaclasses` | `ExyliaClasses` | 1.1.0 | `bd25f4f` 2026-10-14 | Current — reviewed for 1.1.0: `language` (en, es, pt, fr, ru) with `lang/<language>/messages.yml` and 1.0.0 files adopted into `lang/custom/`; the boss bar titles moved from `energy-bar.text`/`mark-bar.text` to `messages.yml` → `boss-bars.energy`/`boss-bars.mark` (config version 3); `%duration%` on `warmup.timer` and `abilities.cooldown`; the six class files refreshed through ExyliaLib on start and reload (missing written back, new keys added, changed defaults in `/exylialib updates`); ability cooldowns now kept across leaving the class, death, relog and reload. API: `useAbility` with `AbilityUseResult`, `giveEnergy`, `spendEnergy` and the three events `ClassEquipEvent`, `AbilityUseEvent`, `ClassRemoveEvent` (`exylia-api` 1.3.0). Discrepancy: the ExyliaLib javadoc of `ClassesService.remove` and `ClassRemoveEvent` still says cooldowns are cleared; the plugin keeps them. |
| `exyliacombat` | `ExyliaCombat` | 1.0.0 | `41bd7f4` 2026-10-26 | Beta — first full documentation, seventeen pages per language, written against the source. Premium on the Lukittu loader (`Exylia-Combat-Loader.jar`), not on BuiltByBit yet: `bbbResourceId` is empty, the registry entry has no `purchase`, and the licence key goes in `loader.yml` → `license_key`. Resolves ExyliaLib `latest.release` (no pin), so no minimum version is named. No own API: the api page documents ExyliaLib's `Combat` facade as ExyliaCombat answers it (bridge priority 100) and the tag/untag/log events. Config documented from `PluginConfig` and each module's settings record; `41bd7f4` (stats command `[pvpstats]` only, migration 2 dropping `stats` from the untouched old default) folded in. Documented as the code behaves where the README or comments differ: `/combatadmin settag` rejects 0 (`@Range(min = 0.1)`), so README's "settag to 0 untags" never happens; chorus fruit is refused whenever a tagged player eats it, not only "into a safe zone"; the `logout-npc-spawned` comment says "within 50 blocks" but the radius is `logout-npc.announce-radius` and the line ships empty in every language; the group `multiplier` does not scale stolen money; `%exyliacombat_top_best_streak_…%` cannot resolve (only `beststreak`); the README's opponent "stays tagged" on the destination server is only remembered, never re-tagged. Unsettled: the minimum Paper version (written as 1.21.3+), whether the shipped `__global__` cooldown region ever matches. |
| `exyliacrates` | `ExyliaCrates` | 1.0.0 | `dfbb500` 2026-10-14 | Beta — first full documentation, fourteen pages, written against the source at `dfbb500` and the crates contract in `exylia-api` (ExyliaLib `origin/main`, `e1885666`, public API 1.10.0). Premium on the Lukittu loader (`Exylia-Crates-Loader.jar`), but `bbbResourceId` is empty: the registry entry has no `purchase` and the pages link to the store; add the resource once it exists. The banner URL is assumed. Crates, the hub and its five sections, the wand, floating icon, hologram and idle loop; keys as records, items vs balance, costs (keys and money, all-or-nothing charge, multi-open); weighted rewards, the draw (weight × chance, 16 retries), rarities as weight bands in `tiers.yml` with celebrations, rewards per key, the guarantee and the contents screen; shared/private openings, remote opening, speed-up, settle on death/world change/quit/shutdown, history and retention, the `crate-announcements` channel, SurvivalCore stats and the `crates` modifier source; the eleven animations with every key of every `animations/<id>.yml`; `config.yml`, messages, menus; `CratesService` and `CrateOpenEvent`. Nothing is imported from ExyliaSurvivalCore (import dropped at `50fb9c3`). |
| `exyliadisplays` | `ExyliaDisplays` | 2.4.0 | `6f2da50` 2026-10-14 | Current — first full documentation, eighteen pages, written against the source (and ExyliaLib `origin/main` for `HologramConfig`, `HologramLine`, `Interactions` and the page tokens; the 2.4.0 jar names `exylia-lib: 1.299.0`). Free and open source (GPL-3.0, GitHub releases): no loader, no licence, `download` instead of `purchase`; formerly ExyliaHolograms. Holograms (lines, items, blocks, heads, the editor and its dialog windows, appearance, location and facing), every line tag, per-player pages with `[PAGE]` and `page-interval`, visibility (permission, per-player, `all`/`manual` lists, attaching to players and saved or unsaved mobs), NPCs (skin incl. `@mirror` and texture/signature, pose, scale, glow, equipment, look modes, label, linked hologram), the shared interaction lines with `[SAY]`/`[ANIMATE]`/`[LOOK]` and the NPC gate (permission, cooldown, refusals), fine adjust, hand edits and the file watcher, the six admin screens and their `exyliadisplays:holo_*`/`npc_*` actions, the ExyliaHolograms move and the five importers, every command, permission, `config.yml` key and preset, and every key of `holograms.yml`/`npcs.yml`. No API page: the plugin publishes no service and no placeholders (FAQ points to ExyliaLib's `Holograms`/`Npcs`). Documented as behaviour and listed below: NPC labels are never per viewer; renaming or deleting a linked hologram leaves the NPC's link dangling; broken YAML hides the whole file's contents; `/holoadmin reload` and `/npcadmin reload` reload everything; colliding imported names can pass 32 characters. |
| `exyliaduels` | `ExyliaDuels` | 1.0.0 | `305eec5` 2026-10-26 | Beta — first full documentation, ten pages per language (no API page: no public API or events), written against the source. Premium on the Lukittu loader (`Exylia-Duels-Loader.jar`), not on BuiltByBit yet: `bbbResourceId` is empty, the registry entry has no `purchase`, and the licence key goes in `loader.yml` → `license_key`. Resolves ExyliaLib `latest.release` (no pin), so the pages say "the newest ExyliaLib" although the README says 1.349.0. `config.yml` from `DuelsConfig`, scoreboard keys from ExyliaLib's `SidebarConfig`; en and es ship. Documented as the code behaves where it differs: `/duel stats <player>` answers "has never fought a duel" for any name the server has not cached (`getOfflinePlayerIfCached`), not only for players without a record; `%exyliaduels_money_won%` counts payouts in the configured `bets.money.currency` only; a cross-server challenge with no enabled kit is refused with `challenge.no-kit`; the `network` comment in `config.yml` points to a README that is not shipped with the jar. Not checked: the exact slots the kit editor shows, whether `bets.money.minimum`/`maximum` accept short forms. |
| `exyliaeconomy` | `ExyliaEconomy` | 1.1.0 | `0dc0f06` 2026-10-03 | Current — first full documentation, nineteen pages. Free and open source (GPL-3.0, GitHub releases): no loader, no licence, the registry entry carries `download` instead of `purchase`. Currencies in the database edited in game, the Vault bridge, payments (tax charged to the payer on top, confirmations, throttling, paytoggle, offline notices), banknotes, interest, leaderboards, the ledger with export and rollback, networked balances, the automatic ExyliaSurvivalCore import and `/economyadmin import vault|points`, ExyliaLib auto-install, and the API (ExyliaLib's `Economy` facade, `BalanceChangeEvent`, `EconomyPayEvent`, `EconomyExchangeEvent`). Documented as behaviour: placeholders cannot name a currency whose id has an underscore (ExyliaLib splits arguments on `_`), so the shipped `netherite_ingots`, `xp_points` and `xp_levels` are out of reach; the PlaceholderAPI form is `%exyliaeconomy_economy_…%`, not the README's; the networked switch cannot be turned back once balances exist; a `/pay` receiver online on another server is not notified. |
| `exyliaemotes` | `ExyliaEmotes` | 1.3.0 | `73f4a66` 2026-10-23 | Current — reviewed for 1.3.0: 88 emotes (20 new, unique icons), `/emotesadmin` hub, confirm on clears and favourites, lang/ folders (en/es/pt/fr/ru/tr), menu shop (`shop.tier-prices`, per-emote price). Earlier: first full documentation, fourteen pages: the 68 shipped emotes in four tabs with every id, rarity, kind, cooldown and prop (52 endless, 16 one-shot, two duets), how an `emotes.yml` entry and its `[RAGDOLL]`/`[CAMERA]` lines are written, endless loops with `loop_from`, rolled `tempo` and `endless-limit`, the hidden player and the camera, every way out (clicks and keys read off the wire, the 300 ms grace, damage and the traced punch at the body) and every refusal, the two cooldowns, duets (one standing invitation, right-click to accept, reach on invite and accept, bodies placed `gap` apart on the line between the players), the menu and `emote:` actions, the crate on ExyliaLib with the one-time import of the old keys and unlocks, showcases, and every key of `config.yml` and `messages.yml`. No API page: `exylia-api` publishes no emotes service. Written against the source: the stale comments and the broken behaviour are listed below. |
| `exyliaevents` | `ExyliaEvents` | 1.8.0 | `32dd433` 2026-10-23 | Current — reviewed for 1.8.0 (`c55a4a4..32dd433`): /events play, per-arena state/players/max_players placeholders, CS:GO team-glow, water/lava arena flags, event:<type> prize boosts, console admin commands, static arenas skip regeneration (tournament regenerates between matches only with build/break), running-event and inscription menus, FAWE optional, void rescue, Paper 1.21.4+, tr/ru. Earlier: reviewed across the 87 commits of 1.3.0 to 1.5.0. 51 types (43 games, 8 team variants): Block Morph Hunt with every setting, settling, the miss penalty, taunts and the four prop items; King of the Hill Teams; Hide and Seek's flashing last stretch (`glow-flash-interval`, `-count`, `-ticks`), seeker cage, `seeker-glow`, no pushing, hidden names and the win going to the hiders; the reworked Anvil Running storm and its new keys; Dodgeball `ammo`/`refill-seconds`; the Race grid and `boat-collisions`; Glass Bridge `collisions`; Paintball `shot-cooldown`; no pushing in Trivia; the TNT Run one-block break; and the defaults that moved (Mace Roulette `miss-kills-macer` and `mace-hit-eliminates` now on, `red-grace-ticks` 10, Sheep Wars `throw-power` 2.8). Shared `bounds-border` and `music-enabled`, the per-player arena border, idle arenas refusing world mobs and explosions, `player-isolation`, `exyliaevents.start.<configId>`, nametags hidden without TAB, `event-catalog` in `messages.yml`, 24 trivia questions. API: `forceStart`, `openMenu` and the six lifecycle events (`exylia-api` `v1.133.0`). Corrected: `chat-isolation` is in `config.yml`, not `scoreboards.yml`; there is no `menus/user/es/`. **Left out:** keys that were already undocumented before this review — the LMS and Survival Games zone, Block Party's colour and seed growth, Brackets' and Tournament's freeze and damage switches, Volcano's growth and footprint. 1.6.0: the custom-minigame registration API (`registerMinigame`, `net.exylia.lib.api.events.custom`, `exylia-api` `v1.7.0`) on the API page, the server-wide `world-border.enabled` switch, and Survival Games reading a chest minimum above the maximum as the maximum. The menu relayout needed no page: the grid was never documented. FAQ: where configurations, the lobby and the `event_bounds_<id>.schem` files are kept across an update. |
| `exyliaffa` | `ExyliaFFA` | 1.4.0 | `ba2d462` 2026-10-23 | Current — reviewed for 1.4.0: player data screen (/ffaadmin → Data management → Player); confirmation dialogs for resetstats/resetlayout/resetkit, console needs `confirm`; tr added. Earlier: reviewed for 1.2.0 and 1.3.0: languages (`language`, `lang/<code>/`, en/es/pt/fr/ru, `lang/custom/` adoption), the per-arena world border and `world-border.enabled`, the two action bars and the streak-break line moved into `messages.yml` (config v5, messages v2) with `%time_precise%`, the categorised rules menu (flags in ExyliaLib's policy editor), kit permissions enforced on every path, offline and network-wide `stats`/`resetstats`/`resetlayout`, the invite cooldown, `{server-ip}` on the sidebar, and `giveKit`, the menu openers and the four FFA events on the API (ExyliaLib `1.133.0`). Also fixed: streak broadcasts go to the arena, not the server. |
| `exyliagraves` | `ExyliaGraves` | 1.0.0 | `0ccba4f` 2026-10-20 | Current — first full documentation, twelve pages per language (no API page: no public API or events). Free and open source (GitHub releases, `download` in the registry). Documented as the code behaves where the README differs: water and lava are free blocks so the head goes in them, limits, placeholders and the respawn compass count graves on this server only, the oldest grave tipped out by the limit always drops, no data migration from SurvivalCore beyond sharing the `sc_graves` table (default H2 starts empty), `experience-percent: 0` acts like `NONE`, `expire-time: 0`/`max-per-player: 0` mean never/no limit. Pending in source: teleport warmup inert (`Teleports.of` without settings), `onInteract` ignoreCancelled makes graves unclickable in protected regions, staff action on a vanished grave reopens `/graves` instead of the admin list, double reload message, hologram toggle/offset not applied live, expire/delete/restore/remove audit entries carry no item list. |
| `exyliahiteffect` | `ExyliaHitEffect` | 1.5.0 | `fd7142f` 2026-10-23 | Current — reviewed for 1.5.0: `effects.disabled-worlds` (default []), `/hiteffectsadmin` hub, confirm on player/unlocks/crate block/showcase clear, favourites confirm, Turkish. Earlier: reviewed for 1.4.0 (and the drift since 1.0.10): `language` with en/es/pt/fr/ru under `lang/<code>/`, every word a player reads moved to `messages.yml` (the old `messages:` block of `config.yml` is not migrated), `require-permission` gone and tokens never checked, the menu `shop` with `tier-prices`, per-effect `price`, `purchasable_template` and `hiteffect:buy`, `showcase` places with their `/hiteffectsadmin showcase` subcommands, `player`/`keys`/`unlocks` on offline players, the crate on ExyliaLib with keys and unlocks imported into `exylia_crate_players`, the moved menu buttons, the five-a-second cap, and the 1.3.0 API (`play`, `playFor`, `preview`, `openMenu`, `openCrate`, `unlock`, `keys`, `addKeys`, `HitEffectPlayEvent`). |
| `exyliakilleffect` | `ExyliaKillEffect` | 1.8.0 | `774a6e2` 2026-10-23 | Current — reviewed for 1.8.0: `disabled-worlds` and `random-worlds` (top-level, default [], disabled wins), `/killeffectsadmin` hub, confirm on player/unlocks/crate block/showcase clear, favourites-tab clear confirm, Turkish. Earlier: reviewed for 1.7.0: `language` with en/es/pt/fr/ru under `lang/<code>/`, every word a player reads moved to `messages.yml` (the old `messages:` block of `config.yml` is not migrated), `require-permission` gone and tokens never checked, the menu `shop` with `tier-prices`, per-effect `price`, `purchasable_template` and `killeffect:buy`, the crate on ExyliaLib with keys and unlocks imported into `exylia_crate_players`, the moved menu buttons, `menu.weapon-names`, and the three-a-second cap. |
| `exylialib` | `ExyliaLib` | 1.321.2 | `cd2c5ca4` 2026-10-20 | Current — full review of the 677 commits since `4325202`, every page checked against the source. Fourteen new pages: library-config, commands, web-editor, player-settings, notices, discord-webhooks, holograms, ragdolls, mobs-and-models, regions, replays, client-integration, crates-and-loot, economy. Rewritten: menus (open animations removed, per-button sounds, ClickGuard, live values), input (15 request types, tuner), world (built-in schematic engine, FAWE optional), rewards (loot and economy moved out), text, chat, api (BetCore 2.0 break, new services), database (row locks, H2 backups and repair), players (stays, network cooldowns, accounts), sequences ([TOAST], [LID], [SHAKE], [CAMERA], 26 shapes), effects (YAML keys, compact/precise), displays (vfx, placed NPCs, interactions), first-plugin (now compiles). Pending: JitPack failed to build tags up to `v1.321.2` (`survivalcore-api` needs repository credentials), so the `com.github.DiGround-s.ExyliaLib:…:v1.321.2` coordinates on the API and first-plugin pages 404; fixed in ExyliaLib `57e69050` (JitPack builds skip the SurvivalCore bridge), so the coordinates work from the first tag released after it — bump them then. The `max-pool-size` key on ten plugins' installation pages was corrected to `pool-size`, the key the library reads. |
| `exyliamarket` | `ExyliaMarket` | 1.0.0 | `1ca8868` 2026-10-14 | Beta — first full documentation, twenty-one pages, written against the source (`MarketService` and its events read at ExyliaLib `54aa4d33`, exylia-api `1.11.0`, first shipped in ExyliaLib `v1.276.0`; the plugin compiles against ExyliaLib `1.296.0`). Premium on the Lukittu loader (`Exylia-Market-Loader.jar`); the Lukittu product exists but `bbbResourceId`/`bbbResourceUrl` are empty, so the registry entry has no `purchase` and the pages link to the store; add the resource URL once it is live. Banner URL assumed (`plugins/market/ExyliaMarketBanner.webp`). Nine modules: auction house (review, fee/tax, container preview, sorts, categories, watchlist), auctions (held bids, auto-bid ceilings, anti-snipe, buyout, boss bar), buy orders (material vs exact, `material-orders-accept`), bazaar (order book, maker price, 227 seeded products, products editor, UTC daily volume), shop (DB catalogue edited in game, item/command products, STATIC/DEMAND/RANDOM, stock, limits, discounts, rotations, 402-product default shop, `defaults add|replace` with backups), sell (`/sell` window, sell-on-close, sell bonus node, boosters, packet worth lore, price audit), worth (`worth.yml`, `/worth`, `/setworth`, editor), sell wands and autosell, trade; plus `/collect`, notices and feedback, the price index and its placeholders, `/marketadmin` with in-game settings, market log and stats, `discord.yml`, ExyliaSurvivalCore stat keys, Analytics. Documented as behaviour: ShopManager.restock skips a full product without moving `restockAt`, so limited stock refills within a minute of any later purchase (default black market effectively unlimited); shop catalogue edits reach other servers only with Redis; more than 21 shop categories are invisible; shop discounts apply to buy prices only and the larger of product/category wins (category lore says otherwise); chat counts items, `/shopadmin log` counts units; `exyliamarket.shop.perks` and `exyliamarket.shop.sell.<x>` are not in `plugin.yml`; numbered limit nodes replace the default (a lower N lowers it) although config comments say "raises"; `bazaar.daily-volume: 0` blocks all bazaar trades and the limit is only checked before a trade; the bazaar "expired" line says buy-order refunds wait in `/collect` but they go to the balance; material orders deliver plain copies even when `material-orders-accept` lets enchanted items in; the auction-house watchlist sends no notifications and sorts never-expiring listings first; `/ahadmin` and `/auctionadmin` `remove`/`clear` take a Player so they cannot run from the console despite the usage line; many messages carry a `[sound:]` tag identical to the configured sound, so sounds play twice and blanking the config sound does not silence them; autosell's `/settings` toggle defaults to on (the node alone enables it); trade money page offers ITEM/EXPERIENCE currencies despite the config comment; trade items are lost on a crash (in memory); `max-distance`/`request-expire-seconds` ≤ 0 disable the check; `worth.yml` "plain" ignores enchantments, damage and potion type; `MarketService` javadoc lists module id `market` (real id `auction-house`) and omits `bazaar`; `MarketDealEvent` is fired with source `bazaar`, not one of its constants; `MarketLogEvent` is deprecated and no longer fired; the `prices` comment in `config.yml` omits bazaar fills, which do feed the index. No SurvivalCore importer (removed in `823d10d`); tables keep the `sc_` names and wands keep the `exyliasurvivalcore:` item keys. Not added to the ExyliaLib API hub table yet (`MarketService` missing there). |
| `exyliamines` | `ExyliaMines` | 1.7.0 | `08e5439` 2026-10-22 | Current — reviewed for 1.7.0: web editor (`/exylialib editor ExyliaMines`: settings, templates, boosts, mines; needs `exyliamines.admin`), `/minesadmin boost list` menu with confirmed stop, Turkish, six reload steps. `settings.presence-margin` still undocumented. Earlier: 1.6.0 checked from `e933577` (1.5.4): the per-mine Fortune screen (mode, highest level, share per level, Silk Touch) and `OFF`/`LINEAR` now ruling vanilla drops; the ExyliaSurvivalCore import and the `exyliasurvivalcore.mines.admin` alias removed (migration now goes through a release before 1.6.0); boosts fed to ExyliaLib's modifiers under the `mines` source; autosell through ExyliaMarket; ExyliaLib 1.296.0; languages en, es, pt, fr, ru. Resolved 2026-10-14: the plugin is presented as premium like the other paid plugins (BuiltByBit 129495, `Exylia-Mines-Loader.jar` with the licence embedded, the loader installing ExyliaLib and updating on restart) on Introduction, Installation, the FAQ and the registry entry (`purchase` instead of `download`, version 1.6.0, no open-source tag); `/minesadmin edit|tp|reset|enable|disable`, `boost give`, `boost give-custom` and `boost stop <id> [player]` documented on Commands and Boosts, with a Personal boosts section. Still behind from 1.4.0–1.5.4: the presence margin around mines, realistic mines restricting breaking by default, and `MineBlockDropEvent`. |
| `exyliamobs` | `ExyliaMobs` | 1.0.0 | `82521c8` 2026-10-21 | Beta — first full documentation, eleven pages per language (no placeholders page: no PlaceholderAPI expansion), written against the source. Premium on the Lukittu loader (`Exylia-Mobs-Loader.jar`), not on BuiltByBit yet: `bbbResourceId` is empty, the registry entry has no `purchase`, and the licence key goes in `loader.yml` → `license_key`. Needs ExyliaLib 1.331.0 (pinned `exyliaLibVersion`). The mob engine links to ExyliaLib's mobs-and-models page instead of repeating it; the API page covers the `MobStore` ExyliaMobs provides (ExyliaRewards' piñatas spawn through it). Documented as the code behaves where its comments differ: the admin menu files say edits are kept, but `Languages.replace` rewrites `lang/<code>/menus/admin/` on every start; ExyliaSurvivalCore's shipped `mobs_killed` stat reads counter `kills.mobs` while ExyliaMobs raises `mobs_killed` and `mobs_killed_<id>`; `prefix` and `rewards-claimed` are untranslated in es/fr/pt/ru/tr; `no-currency` is defined but never sent; the hit-cooldown comment names `%seconds%` while the default uses `%cooldown%`; `RewardMode`'s javadoc says money reaches the top damager, but it reaches each list's own player. `/mobsadmin reload` does not re-read mobs or generators. |
| `exyliaplayervaults` | `ExyliaPlayerVaults` | 1.0.0 | `12303e0` 2026-10-20 | Current — first full documentation, twelve pages per language (no API page; the `exyliaplayervaults:*` menu actions are in configuration). Free and open source (GitHub releases, `download` in the registry). Migration from SurvivalCore is the shared `sc_vaults` table only: no permission aliases, no `/vaultadmin`, default H2 starts empty (the copy-the-H2-file advice in `network` is reasoned, not tested). `/pvadmin edit` skips blocked materials; list and history views are not audited. Pending in source: search cooldown message hardcodes 3s, `%vaults_bought%`/`%vaults_unlocked%` wrong in the staff view of an offline player's list, clear/restore of a vault open on the same server says another server, `%snapshot_cause%` untranslated, `view-title`/`snapshot-title` never get `%name%`. |
| `exyliapractice` | `ExyliaPracticeCore` | 1.3.0 | `bd6a125` 2026-10-23 | Current — reviewed for 1.3.0: kit rules build-height-limit (0) and start-countdown (on); `leaderboard.rank.value`/`value-top`; boosts and player-data admin screens; arena missing-parts lore; over-region fix; kits clear confirm; tr added. Earlier: Reviewed for 1.1.0 and 1.2.0: config v4 (`language`, `chat`, `world-border`, `replay`, double-sneak keys; titles/bars moved to `messages.yml` `effects.*`), `lang/<code>/` layout and admin-menu regeneration, match replays (`/replay`, history right-click), `/queue <category>`, `/history player`, kit rules hub with `bed-respawn`/`arrow-cooldown`, per-player borders, edge-measured extra-region protection, unranked queues skipping ELO checks, season ELO reset, ExyliaLib temporary clone world, `{server-ip}`, `%practice_…%` alias, API 1.3/1.4 methods and the eight events. Resolved 2026-10-14: the Bot PvP module has its page (`bot-pvp`/`pvp-contra-bots`: linking a kit to a combat mode, `BOT` arena usage, `/botpvp` and the party **Bots** button, the two menus, squads and refocusing, win/loss, nothing recorded, the `bot-pvp` messages), with `/botpvp` and `exyliapractice.botpvp` on Commands and Permissions, the `bot-practice` sidebar (twenty, not nineteen), `practice_match_replays` among the eighteen tables, and `introduction` now quoting 255 classes, 18 tables, 65 menus and 16 commands. Noted: `exyliapractice.botpvp` is not declared in `plugin.yml` (operators only by default), and the party menu's **Bots** path checks no node. |
| `exyliapracticebot` | `ExyliaPracticeBotV3` | 1.4.0 | `a6ee61b` 2026-10-23 | Current — reviewed for 1.4.0: `advanced.defense.shield` (true); `break-blocks` now applies to /bot too; menu reset asks for confirmation (/bot reset does not); tr added. Earlier: reviewed for 1.3.0: languages (`language`, `lang/<code>/`, en/es/pt/fr/ru), `bot.name` moved into `messages.yml` (config v4), `reserved-for-matches`, `break-blocks` limited to match bots, `/bot tpto` needing line of sight (`bot-out-of-sight`) and the spawn/teleport cooldowns, the crystal bot's gapples, armour wear and bottle mending, totem restocks and glowstone anchors, and on the API `BotTuning`, the `BotSpec` builder with `match()` and `settingsMenu`, several bots per owner (`ownedBy`, `all`), kit-bound totems, live `mode`/`difficulty`/`setDifficulty` on handles and `PracticeBotKillEvent` (ExyliaLib `1.127.0` and `1.133.0`). Also fixed: messages and config code-block paths, ExyliaCommons palette mention. |
| `exyliaprotections` | `ExyliaProtections` | 1.0.2 | `6b29fe5` 2026-10-14 | Beta — nineteen pages, written against the source. Review `53160df..6b29fe5` (19 commits, 1.0.2, ExyliaLib `v1.296.0`): `/protectionsadmin` (`/psadmin`, `/padmin`) with an admin hub, in-game settings (general, teleport, features, forced flags) written straight into `config.yml`, `list`/`here`/`delete`/`transfer`/`level`/`lives`/`flag`/`feature`/`settings`/`tiers` subcommands, and admin changes recorded in the staff log (`/exylialib logs`); `/protections admin` now only aliases give/migrate/reload/hub/import/cleanup; a real reload command (configs, messages, backend, timers, menus); teleport countdown section `teleport` (boss bar, tick sound, cancel messages, cooldown, `exyliaprotections.bypass.warmup`; replaces `settings.home-warmup-seconds`, config version 7); `forced-flags`; ten new flags (mob-damage, fall-damage, hunger, mob-griefing, block-spread, snow-ice, crop-trample, item-drop, item-pickup, ender-pearl; explosions no longer covers mob griefing) mirrored to WorldGuard and mapped by the ProtectionStones import; `cores.enabled`, `selection.enabled` now off by default; the manual merge (`/protections merge`, merge menu) removed and `submodules.merge` now means a new core touching the owner's land grows it; right-clicking a core opens its screen; centred menus with section cards; Russian translation. Fixed since 1.0.1 and no longer documented as quirks: operators no longer bypass (`exyliaprotections.bypass` defaults to false), `limit.0` allows none, selection checks the tier `permission`, moving a core moves its warp, raiders' core hits count under WORLDGUARD, `deniesFlight` respects `submodules.raids`. The ExyliaSurvivalCore import, the legacy `exyliasurvivalcore.protections*` nodes and limit prefix, and config migrations 1–4 were removed in `f09b413`; Migration now says nothing is imported. BuiltByBit resource now live (registry `purchase` added). Discrepancies noted: `exyliaprotections.bypass.warmup` is declared only in the main `plugin.yml`, not the loader's (still op through Bukkit's default for undeclared nodes); admin `hub.yml`/`settings.yml` say "yours to edit" but `menus/admin` is rewritten on every start; a core that grows existing land skips the disabled-worlds, limit and world-border checks (`ProtectionCores.placement` returns before `permitted`). Earlier: first documentation at `53160df` (1.0.1, nineteen pages; the protections module moved out of ExyliaSurvivalCore; French from `53160df`; the SurvivalCore import was broken at `f485fc9` and fixed in `3198514`). The ExyliaLib API hub table still lacks `ProtectionsService`. The ExyliaSurvivalCore Protections pages still describe the old module. |
| `exyliaproxyutils` | `ExyliaProxyUtils` | 2.0.2 | `79c3b5b` 2026-10-12 | Current — first full documentation, thirteen pages. Free, public on GitHub with automatic releases (`download` instead of `purchase`); the repository has no LICENSE file, so the pages say "free" and name no licence. One universal jar for Velocity 3.4+ and BungeeCord, Java 21, needs ExyliaLib 1.106.0+ (the Redis bridge) on the backends. No commands, no permissions, no menus: the pages cover `config.properties` key by key, the server-name = `server-id` rule, the eight modules (`ping`, `commands`, `connect` with the `arrive` push, `player`, `players`, `kick`, `punish-sources`, `punish-import`) with every payload and refusal, the `player-proxy:`/`console-proxy:` prefixes, the LiteBans/LibertyBans/AdvancedBan/BanManager hooks and `originId` formats, the `<prefix>:punish:external` stream and the history import (`/staffadmin import`), the login check against ExyliaStaff's ban mirror, the wire protocol, the self-updater and the release workflow, and the backend `Proxy` API. Written against the source, not the README; discrepancies below. Documented as behaviour: a proxy that cannot reach Redis at startup stays inert until restarted (only a drop after a good start is retried); the updater only reads `releases/latest`, so once a new major is published older majors stop getting patches; the updater writes the new jar over the running file under its old (possibly versioned) name; on BungeeCord a `kick` with a blank legacy screen shows the MiniMessage text raw, and the login denial ignores `mini`; on Velocity a `kick` with both screens blank says "You are banned from this network.". Stale in the source: `PingModule`'s javadoc ("through the first player to join") and the README ("at startup") — ExyliaLib pings with no player a second after start and every ten seconds until answered; `BridgeModule`'s javadoc says modules run on the proxy's network thread (they run on the Redis subscriber thread); `Bridge.withBuiltIns`' javadoc lists six modules (the two punishment modules are registered by `RedisBridge`); the README says ExyliaStaff asks `punish-sources` before an import, but nothing on the backends calls it at ExyliaStaff `ab6caa1`. |
| `exyliarewards` | `ExyliaRewards` | 1.0.0 | `817cc3e` 2026-10-26 | Beta — first full documentation, fourteen pages per language (no API page: no public API or events), written against the source. Premium on the Lukittu loader (`Exylia-Rewards-Loader.jar`), not on BuiltByBit yet: `bbbResourceId` is empty, the registry entry has no `purchase`, and the licence key goes in `loader.yml` → `license_key`. Needs ExyliaLib 1.344.0 (pinned in `gradle.properties`). `config.yml` from `RewardsConfig`, `discord.yml` from `DiscordConfig`, `votes.yml` and `referrals.yml` from the bundled files; rewards, calendars, codes, AFK zones, votes and the vote party, piñatas and referrals each documented from their services. `817cc3e` (loader `plugin.yml` now declares `exyliarewards.redeem`, default true, and `exyliarewards.calendar.catchup`, default false) folded in. Documented as the code behaves where it differs: `%exyliarewards_<id>_claims%` answers claims left, not claims made (README); reward IDs starting with `playtime`/`ready`/`freezes`/`afk_`/`votes_`/`referrals_` are shadowed by those placeholders, the preset `playtime_*` rewards included (inferred from ExyliaLib's longest-match rule, not tested in game); `/playtime` opens the playtime rewards list rather than showing playtime (README); the `language` comment says only "en" while en, es, fr, pt, ru and tr ship; the README omits `%exyliarewards_afk_top_<n>_name/value%`. Possible bug left out of the pages: Discord streak announcements fire for daily/weekly/monthly/cooldown rewards even with their Streak option off. |
| `exyliasandbox` | `ExyliaSandBox` | 1.2.0 | `e939c4b` 2026-10-23 | Current — reviewed for 1.2.0: kit room category, TP region and saved kit deletes now confirm (docs corrected); tr added. Earlier: reviewed for 1.1.0 (`7e6b005..9096008`): `language` (en, es, pt, fr, ru) with `messages.yml`, `scoreboards.yml` and `menus/` under `lang/<language>/`, 1.0.x files adopted into `lang/custom/`; the queue action bars, pad boss bar, countdown title and hologram lines and the kit-creator titles moved from `config.yml` to `messages.yml` (config version 4); new `prompts`, `wizards`, `confirm` and `screens` labels (world statuses and Active/Inactive are now editable); `rekit.cooldown-seconds` (30); combat tag refusing `/rekit`, `/back`, `/leavesandbox`, `/tpa`, `/tpaccept` and `/rtp` (`general.in-combat`); TPA refused from the kit creator or a queue, with `tpa.player-unavailable` and the centred ACCEPT/DECLINE request; kit room Q into the inventory and a 150 ms click limit; English kit-room names (ids unchanged); pads skip queued players; `{server-ip}` on the sidebar; user menus refreshed through `/exylialib updates`; RELOAD CONFIGS. API: `enter` with `EnterResult`, `openWorldSelector`, `SandboxJoinEvent`, `SandboxArriveEvent`, `SandboxLeaveEvent` with `LeaveReason` (`exylia-api` 1.3.0). Still documented as broken: the kit-room category editor never writes back, finishing a pre-generation shuts the server down, and the three `kit-creator` title blocks (now in `messages.yml`) are never read. |
| `exyliashields` | `ExyliaShields` | 1.3.0 | `4ee736d` 2026-10-23 | Current — reviewed for 1.3.0: `disabled-worlds` (default [], held design hidden), `/shields admin` hub (`exyliashields.admin`), confirm on unlocks/crate block/showcase clear and design delete/reset, Turkish. Earlier: reviewed for 1.2.0: patterns and colours won from a crate (rarities under `crate.tiers`, a `tier` on every entry, account and item keys, crate blocks) or bought from the editor and colour picker (`shop.tier-prices`, per-entry `price`, ExyliaLib's `purchase` lines), showcases playing the 30 most taken community designs, `language` with `lang/<code>/` in five languages and the preview labels, import prompt and key item text moved to `messages.yml`, the admin `keys`/`unlocks` (offline too), `item key`, `menu crate`, `crate block` and `showcase` subcommands under `/shields`, the first placeholders, and the API's `openSlots`/`openLibrary` with the slot-select and import events. Older drift fixed: 43 patterns ship, not 41. |
| `exyliaspecials` | `ExyliaSpecials` | 4.1.0 | `d9acf65` 2026-10-23 | Current — reviewed for 4.1.0: combat tag, barrier, logout NPCs and vanilla cooldowns moved to ExyliaCombat in 5c86cc2 (combat page rewritten, combat cmds/perms/keys removed, export file documented; the 4.1.0 changelog's barrier items belong to ExyliaCombat); list commands open menus; compressor resource-pack ids, in-place compression. Pending: minimum ExyliaLib (intro says 1.299.1, code uses a 1.328.0 API). Earlier: first full documentation, eighteen pages, written against the source at `9f59ae7` (release v4.0.0, a rewrite with no 3.x compatibility; `ExyliaSpecialsV3` ignored) and `SpecialsService` in `exylia-api` (ExyliaLib `origin/main`, `6e9f9802`). Premium on the Lukittu loader (`Exylia-Specials-Loader.jar`, ExyliaLib 1.299.1+), BuiltByBit resource 49406 as `purchase`; the banner URL is assumed. The item file (id, `settings` with `${}` formulas and the in-game form, `texts`, item template, `permission`, `limit` INFINITE/USES/TIMED, `cooldown` with `combat-seconds`, `regions`, features and their gate keys), the sixteen triggers, the gate order and messages, charge/refund, item protections and delivery; the 37 steps of the action language with every key and default, run variables, targeting eligibility, summons and the `duel` step; the twelve states and `only` filters; the 70 bundled items with settings and ranges; the fifteen tool features, `BlockBreaker`, carried tools and the recipe/filter editors; the seven tracker stats, the 8 bundled trackers, applying, remove/reset; combat providers, built-in tagging and restrictions, safe zones, the barrier, logout NPCs and `exyliaspecials_combat_loggers`; vanilla cooldowns (triggers, world/region/combat times, region use caps, defaults) and the action bar; duel arenas (`arenas.yml`, snapshots, copies in the temporary world, policies, lifecycle, quit/death/restart); `/specialsadmin` and the admin menus, permissions (and the loader `plugin.yml` gap), placeholders, `config.yml`, messages, languages (en, es, fr, pt, ru, tr; items read from `lang/<code>/items`; tr added 2026-10-18 from `e36a382`), the API and `SpecialItemUseEvent`/`OneVsOne*Event`. |
| `exyliastaff` | `ExyliaStaff` | 1.6.0 | `0824b4b` 2026-10-23 | Current — reviewed for 1.6.0: Discord webhooks module (`modules.discord`, `modules/discord/config.yml` + templates), replay `death-seconds` 30 / `death-keep-days` 3, 5-minute single-server purges, LiteBans kicks, vanished hidden from suggestions, clear [confirm], Turkish. Earlier: reviewed for 1.5.0 across `64824bb..c4c2bb4` (23 commits). **Punishments** extended: `engine: commands|exylia` (native bans refused at pre-login and mirrored to Redis for ExyliaProxyUtils, IP bans that learn the address, kicks through the proxy, mutes with `mute-blocked-commands`, warnings shown once at next join), evidence (`evidence-lines`) and `appeal-url` on the `screen-ban`/`screen-kick`/`muted`/`warned` screens, approvals (`/punish requests|approve|deny`, restrictive `exyliastaff.punish.type.<t>`/`.permanent`/`.category.<id>`/`.reason.<id>`/`.edit`/`.revoke` nodes, a blocked step becomes a request to a superior), `observe` (LiteBans, LibertyBans, AdvancedBan, BanManager recorded through the `punish:external` stream, under the plugin name as reason so no ladder climbs), `/staffadmin import`. `/exyliastaff` and `/es` replaced by `/staffadmin` with `info`, `history|reports|notes clear`, `wipe [confirm]`, `import`, `weblink` and the `exyliastaff.admin.info|history.clear|reports.clear|notes.clear|wipe` nodes. Web: `/staffadmin weblink`, `/staff web` single-use join link, join reminders, `chat-history` block. Freeze: `/freeze <player> [reason]`, `persist-on-quit` (default true), `alert-rejoin`. Helpop `claimed-timeout-minutes`; reports `punish-reasons`; replays `vertical-margin` 6, Kill entries, web-kept replays skip the purge; Russian (`ru`). Not documented (web-only): `replay.watch`, `staff.teleport`/`bring`, `freeze.chat`, web kick. `plugin.yml` softdepend lists LiteBans and AdvancedBan but not LibertyBans or BanManager. |
| `exyliasurvivalcore` | `ExyliaSurvivalCore` | 1.2.2 | `da1b53b` 2026-09-14 | Current — reviewed across 90 commits, then again at `da1b53b` for the economy placeholders: the balance names moved here from ExyliaLib `1.162.1`, the `survivalcore` short identifier, and `vault` resolving to the stored currency Vault serves; thirty-one pages. Twelve new pages for the eighteen new modules, in two new nav groups: **Economy** (stored currencies, the Vault bridge and the ledger moved from ExyliaLib, boosters, sell wands and autosell; the shop; market, auctions and orders; trade and vaults) and **Protections** (regions on the internal or WorldGuard backend, raids, banks/upkeep/rent/upgrades, the admin side and the ProtectionStones import), plus duel rooms, optimization with the item updater, rewards and votes, missions and seasons, and graves inside Combat. Every existing page brought up to date: counters in stats, prestige, cross-server TPA and `/back`, the `teleport` section, BundledFiles-managed owner menus, fifty switches, 118 menus, 72 tables, 337 actions. The API page covers `exylia-api` `v1.133.0` (checked at `v1.160.2`). Written against the source; the stale comments and the broken behaviour are listed below. The other commits up to `da1b53b` (Vault registration at enable, cross-server auction locks, rank-up charging once, protection corner pillars, duel room borders) are not yet reflected. |
| `exyliatabletop` | `ExyliaTabletop` | 1.0.0 | `961902c` 2026-10-27 | Beta — synced through `961902c` (23 commits after `24721df`, version still 1.0.0 in `build.gradle`). Added: Truco (2, or 4 in pairs with `pairs`; never 3), Generala (2–6, `/generala`, `/yahtzee`), Chess and Escoba (2), so twenty-two games; `players` is now the most a table seats (defaults Pick a Card 8, Poker/Hot Potato/Generala 6, Liar's Dice/Ludo 4) and hosts pick the seats (`SeatsPrompt`); `duel <player> [player...]` seats exactly the invitees and host; tables in the world (`/tabletopadmin table create|edit|remove|list`, `tables.yml`, `tables` section, `tables.only`); `guide` side panels; `tabletop-command`; `arena.freeze` keeps players inside the room; `theme.nearest` 2.5; the hotbar leave button and `tabletop:leave`; open tables announced on the `tabletop-tables` Broadcasts channel; fr and pt; pair wins split and counted for each partner; exylia-api 3.1.0 (`TableMatchCreateEvent.getInvitees`). Needs ExyliaLib 1.376.0 (`PlacedTables` seat lines and `nextId` 1.371.0, hologram fix 1.375.0, setup tools answering clicks 1.376.0). Premium on the Lukittu loader (`Exylia-Tabletop-Loader.jar`), BuiltByBit resource 134403. Neutral wording for BuiltByBit (no bet, casino, gamble, jackpot, chips or house) and no link to ExyliaCasino. Documented as the code behaves where its comments differ: a teleport by a plugin (cause `PLUGIN`/`UNKNOWN`) does not forfeit, although `MatchListener`'s javadoc says it does (a world change always forfeits); Hot Potato seats 2–6, not "three to six" as `HotPotatoRound`'s javadoc says; `TableMatch.arena` is always null and events fire from whichever thread reached the step, not "everything on the global thread" as `TableEvent`'s javadoc says; clicking a table in the world checks no permission (not even `exyliatabletop.play`); on a pair win the fee exemption is read from the first partner only and each partner's chat share is rounded to 2 decimals, while the escrow splits by the currency's decimals with the remainder to the first; `TableMatchEndEvent.getWinner` is the first partner and `getPrize` the whole prize; a Truco `duel` naming two players (three seats) grows to a four-seat table only the invitees may join, so it can never fill or start early (docs say to invite one or three). |
| `exyliatotemtrainer` | `ExyliaTotemTrainer` | 1.2.0 | `01760e7` 2026-10-23 | Current — reviewed for 1.2.0: /totem gated by `exyliatotemtrainer.use`; every menu action checks its command's node (table added); confirm.yml removed; tr added. Earlier: reviewed for 1.1.0 (from `6ec68a0`): `language` and `lang/<code>/` folders (en, es, pt, fr, ru; a 1.0.0 server moves to `lang/custom`), `feedback` moved into `messages.yml`, the speed-weighted rating (`performance.speed-weights`, `reference-ticks`; `by-ticks` now ships empty) and the leaderboard speed button, `match.duel-request-cooldown`, `chat.isolation`, solo training now needing a ready arena, save-on-entry and dress-on-arrival with the held-player guards, the session summary screen (`training_result.yml`, Play again), the centred duel request, `{server-ip}` sidebars, neutral placeholder values, and the API's five `open*` menu methods and cancellable `DuelRequestEvent`. |

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
| Updated | `exyliaevents` on 2026-09-20 for `registerMinigame` and the `net.exylia.lib.api.events.custom` package, naming `v1.7.0`. The hub's service table notes the sub-package; the page's "What it does not expose" no longer claims per-minigame settings are out of reach. |
| Pending | `MinesService` (exylia-api `v1.8.0`) is documented on `exyliamines` but not yet listed in the hub's service table. The ExyliaSurvivalCore pages still describe the mines module and the stored economy that moved to ExyliaMines and ExyliaEconomy (`10d082c`, `896a57b`). |
| Added later | `SpecialsService` (ExyliaSpecials 4.0.0) listed in the hub's service table on 2026-10-18; its javadoc no longer names ExyliaSpecialsV3 (ExyliaLib `v1.311.3`). |
| Not documented | ExyliaTabletop, ExyliaPearls and ExyliaTotems all publish a service, but have no documentation set on this site at all. They are absent from the hub's service table for that reason. |
| Separate artifact | `exyliaanalytics` has an API page of its own that is **not** part of `exylia-api`: `net.exylia.analytics.api.ExyliaAnalytics` (`track`, `economy`, `supply`, `available`) ships inside `Exylia-Analytics-Loader.jar`, is published to no Maven repository, and is compiled against as a local `compileOnly` file. It is absent from the hub's service table for that reason. |

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

### Stale strings and broken behaviour in ExyliaEmotes

Found while writing that set at `f7b0ba8`. The pages describe what the code does.

- **Walking keys ignore `cancel-on-move`.** `EscapeHatch.java:78-85` ends an emote on any held walking,
  sprint, jump or sneak key read off the wire, whatever `behaviour.cancel-on-move` says; only the Bukkit
  `onInput` path (`EmoteStage.java:485-488`) honours it. With the camera up that packet path is the one
  that fires.
- **`%exyliaemotes_emote_<id>_<field>%` cannot reach an id with an underscore.**
  `PlaceholderAPIHook.java:67` splits at the first `_` after `emote_`, so the thirteen shipped ids with
  one (`six_seven`, `orange_justice`, `chicken_dance`...) always answer `placeholders.unknown`.
- **`partner-cannot` says "does not own that emote" for any refusal.** `EmoteStage.java:212-213` maps
  every refusal of the partner — cooldown, combat, world, ownership — onto `PARTNER_CANNOT`.
- **An invitation checks almost nothing.** The javadoc at `Invitations.java:116` says everything that would
  stop it is checked on invite; the code checks only self, busy and reach. Ownership, cooldown, combat
  and world are checked on accept.
- `EmoteMessages.java:86-87`: the default `needs-partner` tells the player to run
  `/emote %id% <player>`; the command is `/emote play <id> <player>` (`/emote <x>` only opens the menu).
- `EmoteMessages.java:79,102,106`: `cancelled`, `camera-unavailable` and `refreshed` are declared and
  never sent.
- `EmoteSettings.java:63`: `require-permission` says commands and the API are never limited by it.
  `/emote play` is; only `/emotesadmin play` is not, and there is no API.
- `EmoteSettings.java:148-154`: the `duet.max-distance` comment is garbled mid-sentence ("It is not what
  / meet in the middle").
- `EmoteSettings.java:279-281` and `menus/crate.yml:6-9`: keys are said to live on this plugin's row and
  `/emotesadmin keys give` to be the only way in. They live in ExyliaLib's `exylia_crate_players`, and
  `item key` hands out key items that open the crate.
- `ExyliaEmotes.java:450-451`: says an edited menu gets the new version beside it as `.new`. ExyliaLib's
  `BundledFiles` keeps the old file as `<name>.v<old version>` when `menu-version` rises, and otherwise
  leaves an edited file alone.

### Discrepancies and broken behaviour in ExyliaAnalytics

Found while writing that set, at agent `4a0f759` and web `582685c`. The pages describe what the code does.

- **Session starts from Spigot are rejected.** `PaperAgent.java:495-513` returns a `null` protocol when
  neither ViaVersion nor Paper's `getProtocolVersion()` answers, which is every plain Spigot server
  without ViaVersion. The ingest requires a number (`apps/ingest/src/protocol.ts:70`), so every
  `session.start` of a standalone Spigot server is dropped, and it reports no network sessions. A null
  `ip` (`PaperAgent.java:483`) would be dropped the same way (`protocol.ts:68`).
- **A resumed server never resumes on its own.** While paused, `Agent.emit` drops everything
  (`Agent.java:207`), so no batch is sent and no `configRevision` comes back; the config is only fetched
  when `configStale` (`Agent.java:432`). Resuming from the dashboard needs `/analytics reload` or a
  restart. The first start after it is then annotated as a crash, since the paused run sent no
  `server.stop` (`apps/ingest/src/lifecycle.ts`).
- **The Vault proxy misses plugins that cache the economy on enable.** `EconomySources.start` schedules
  the first wrap for the next tick (`EconomySources.java:136`), after every plugin has enabled. README
  says "cached Vault's economy before the agent started"; in practice it is before the first tick.
- **Stale Folia comment.** `PaperAgent.java:64-65` says Folia is not supported in v1; `plugin.yml`
  declares `folia-supported: true` and `Schedulers` runs on the global region. The join/quit maps in
  `PaperAgent` (`online`, `sessions`, `hostnames`, `locales`, `kicked`, lines 86-91) are plain
  `HashMap`/`HashSet` written from region threads on Folia, which is not thread-safe.
- **Heartbeats slow down with lag.** `PaperAgent.sample` counts one "second" per 20 ticks
  (`PaperAgent.java:405`); below about 6.7 TPS three heartbeat intervals exceed the silence threshold and
  the ingest closes the server's sessions as timed out while it is running.
- **Custom property keys over 48 characters and placeholder names over 64** are accepted by the agent
  (`Agent.customProps`, `LocalConfig`) and rejected by the ingest (`protocol.ts:123,129`), dropping the
  whole event there.
- **"Over its plan quota".** The agent's 403 message (`Agent.java:522`) and `docs/protocol.md` mention a
  plan quota; the ingest only answers 403 for a suspended workspace (`routes/agent.ts`). There are no
  plans or quotas in the web code.
- **CoinsEngine.** `docs/protocol.md`, `docs/metrics.md` and the web's Economy empty state name
  CoinsEngine; the agent hooks ExcellentEconomy (`su.nightexpress.excellenteconomy`), CoinsEngine's
  successor, and not CoinsEngine's own classes.
- **README "TODO before the first release"** still lists the whole real-server test pass, hence the Beta
  status in the registry.

### Discrepancies and broken behaviour in ExyliaDisplays

Found while writing that set at `6f2da50`. The pages describe what the code does.

- **NPC labels are drawn once for everybody.** `NpcRenderer.java:233` builds the label's `HologramConfig`
  with `per-player` `false` and, unlike `StoredHologram.toConfig`, never turns it on for a line with a
  placeholder, so `%player_name%` in a label is not filled per viewer. The README sells labels as having
  "every line tag … per-player lines"; the viewer tags (`<range>`, `<perm>`, `<if>`) do work. Documented
  with the linked hologram as the workaround (inferred from the code, not tested in game).
- **A linked hologram can be orphaned.** `EntryStore.rename` (`EntryStore.java:120`) and `delete` never
  touch `npcs.yml`, so renaming or deleting a hologram leaves an NPC's `linked-hologram` naming a hologram
  that no longer exists; nothing follows the NPC until it is linked again. Two NPCs linked to one hologram
  move it back and forth (each writes its `location`).
- **Broken YAML empties the module.** A hand edit that does not parse is ExyliaLib's `BROKEN_FILE`: every
  default is used, so `holograms.yml`/`npcs.yml` read as no entries and `applyAll` takes every hologram or
  NPC out of the world until the file is fixed. Documented as a danger callout.
- **`/holoadmin reload` and `/npcadmin reload` reload everything.** Both call `Reloads.run` (all configs,
  both modules, menus) before re-reading their own file.
- **Imported names can pass 32 characters.** `EntryStore.java:160` appends `_2`, `_3`… after
  `Names.sanitize` has already cut the name to 32, so a long colliding name ends up 34+ characters, which
  `Names.valid` would refuse for `create`/`rename`.
- `README.md:234`: messages and screens are said to ship "in English and Spanish"; Russian (`ru`) ships
  since 2.4.0 (`08c45dd`).
- `README.md:170`: `/npc` is listed with the alias `/npcs` only; `NpcCommand` also registers `/exylianpc`,
  and `/displays` has `/exyliadisplays` and `/edisplays`, which the README omits.
- README "Line tags": the paragraph "Anything else at the start of a line, such as `<gradient:...>`…" is
  printed twice.
- `HologramFile.java:16`: the `holograms.yml` header says "Every key is described in the README"; the
  README describes only a few. The File reference page is the full list.
- `HologramActions.java:28`: the javadoc calls the actions `exyliaholograms:*`; they are
  `exyliadisplays:holo_*`.
- `FileWatcher.java:66`: when a file cannot be watched the console says "use /holoadmin reload" even for
  `npcs.yml`, whose command is `/npcadmin reload`.

### Discrepancies and broken behaviour in ExyliaCrates

Found while writing that set at `dfbb500`. The pages describe what the code does.

- **An opening whose draws all miss pays nothing and keeps the keys.** `CratesService.pick` retries a reward
  whose chance misses `CHANCE_ATTEMPTS` (16) times and then returns `null`; `draw` skips it. When every draw
  misses, `paid` (`CratesService.java:593-597`) sends `no-rewards` and returns after the costs were charged and
  the pity row written — nothing is refunded. A crate whose rewards all have a low chance eats keys.
- **Deleting a key can make a crate free.** `CratesManager.deleteKey` removes the key from each crate's costs;
  a crate left with none encodes `free` and opens for everybody at no cost (`max-multi-open` times on sneak).
  The confirmation prompt (`prompts.key-delete`) only says the crates "will stop asking for it".
- **`/cratesadmin reload` does not redraw holograms.** The `crates` reload step (`CratesService.reload`) only
  invalidates animations/fillers and restarts the idle loop; `hologram-lines`, `hologram.enabled` and
  `hologram.offset-y` reach standing holograms only through `refresh` (a General/Opening/Presence edit) or a
  restart. The cost and reward editors (`editCosts`, `saveRewards`) do not call `refresh` either.
- **Crates and keys are never re-read across a network.** `CratesManager.load` reads `crates`/`crates_keys` once;
  only `CratePlayerEntity` has an `onRemoteChange` listener. An edit on one server reaches the others on restart,
  and a stale server saving a crate overwrites the newer row.
- **`CrateOpenEvent` javadoc (ExyliaLib `exylia-api`)**: says it fires "after the keys are spent and the rewards
  handed over"; it fires in `paid()` before the animation, and prizes are handed at the reveal. `getKeys()` is
  documented as keys spent but receives `times` (openings), so a 3-key crate reports 1 and a money-only crate
  reports openings. `getRewards()` says "rarest first"; it is draw order (`won`).
- **`CratesService.giveKeys` javadoc**: "The player is told nothing." `CratesServiceImpl` sends `keys-received`
  with the `keys.received` effect to an online player, and a player away gets `keys-while-away` on join (the
  grant bumps `unseen`). The interface also still describes balances as "per player and crate".
- **A player who quits mid-opening is paid but never summarised or announced.** `forget` → `settle(false)`, so
  `summarise` (chat lines and the broadcast of a broadcasting tier) never runs. Death and world change use
  `settle(true)` and do announce.
- **A guarantee without a tier, or with a tier the crate holds nothing of.** `pityAfter > 0` with `pityTier`
  null: the preview says "No guarantee" but `%crate_pity_<id>%` counts down. A tier with no reward in it falls
  back to an ordinary draw (`pick`), `isPityTier` never matches, the counter never resets and the preview keeps
  saying `pity-next`.
- **Remote opening is open to everyone.** `/crates open` and the preview's `crate_open` button open any enabled
  crate from anywhere for any holder of `exyliacrates.use` (default true); no per-crate permission or setting.
  The preview button also opens "in front of the player" even when the preview was opened from the block.
- `CratesAdminCommand.told` fills `%crate%` (and `%key%`) of `keys-given`/`keys-taken`/`keys-set` with the raw
  key id, while the player-facing lines use the crate names (`CrateKeys.opens`).
- `CrateSetupMenu.values` writes `pity-every` with the tier **id**, not its `display`.
- `animation-none` (messages) and `prompts.animation` are declared and never read.
- `config.yml` declares no `language` key; the plugin follows ExyliaLib's language only (other translated
  plugins write `language: default`).
- The key screen's **Get keys** (`crate_key_give`) and API grants (`CratesServiceImpl.giveKeys`) are never
  written to the staff log; every `/cratesadmin key` command is.
- Local `~/Java/Exylia/ExyliaLib` is 126 commits behind `origin/main` and lacks `net.exylia.lib.api.crates`;
  the API page was written from `origin/main`.

### Discrepancies and broken behaviour in ExyliaSpecials

Found while writing the docs against `9f59ae7`; the pages describe what the code does.

- **Loader `plugin.yml` is missing two nodes.** `src/loader/resources/plugin.yml` (the one shipped in
  `Exylia-Specials-Loader.jar`) declares neither `exyliaspecials.admin.arena` nor `exyliaspecials.duel.bypass` and
  does not list them under `exyliaspecials.*` / `exyliaspecials.admin.*`; the inner `src/main/resources/plugin.yml`
  does. Wildcards granted to non-operators therefore miss both. Its `libraries` list also differs from the inner one.
- **Admin menu buttons skip the per-command nodes.** `menu/AdminButtons.java` registers the `exyliaspecials:admin_*`
  actions without permission checks: giving items/appliers and creating, editing and deleting arenas from the menu
  need only `exyliaspecials.admin`, though `plugin.yml` says `admin.arena` covers "the duel arena screens". The
  actions sit in ExyliaLib's shared registry, so any action line can call them.
- **`HELD` abilities are never charged.** `ItemEngine.pulse` (~78-90) checks `ready()` but never `charge()`: uses and
  cooldown on a `HELD` feature are never spent. Same for `magnet`, the automatic compressor/void filter pass
  (`CarriedTools.walk`) and `telekinesis`/`auto_smelt`.
- **`PASSIVE` abilities never run.** `Trigger.PASSIVE` is accepted by `AbilityFactory` but nothing fires it for
  abilities. ARCHITECTURE.md's trigger list also omits `PASSIVE`.
- **Run variables are not filled in `message` text or `play` effect lines** (`FeedbackActions.message` passes only
  `%player%`; effect lines are compiled once). `%targets_found%` in a message prints raw.
- **Step `condition`/`permission`/`chance` are ignored on other plugins' actions** named in a step (`ActionLibrary`
  ~30-32).
- **Summon body defaults change with the presence of `body:`** (`SummonSpec` Body.read): absent = invulnerable decoy
  wearing the owner's gear; present = vulnerable, no equipment unless written.
- **`message to: both` messages the caster twice** when the caster is among the targets.
- **`teleport` modes `forward` and `to_source` skip the WorldGuard PvP check** that the other modes make.
- **Wall shape faces south after `target_look` on a block** (anchor yaw 0).
- **`blocks mode: clear` default list includes natural terrain** (stone, deepslate, dirt, sand, gravel, netherrack,
  end stone, obsidian, planks...; `WorldActions.java:21`); the bundled **Siege Forge** sneak "sweep away what others
  built" uses it, so it deletes terrain within 5 blocks with no drops wherever protection plugins allow.
- **`compressor_mint` and `compressor_vault` ship with `recipes: []`**: they do nothing until recipes are added in
  the editor, though their lore promises currency folding.
- **"Ally" items affect enemies.** `bards_anthem` and `cleansing_flare` use `pvp-check: false` with no team filter.
- **Timed items are only swept in the main hand** (`TimedItems`); expired items elsewhere keep stale lore until used.
- **`TAKE_DAMAGE` fires only for player damage** (melee or player projectile); not mobs, falls or fire.
- **`damage`, `target_radius`, `target_chain` default to `only-players: true`.**
- **Deleted bundled item/tracker files come back** on every start/reload (`Languages.refresh`), and items have no
  `enabled` key.
- **Automatic compression ignores short `every`.** Passes only run on inventory scans (≤1 s after a change, else the
  100-tick fallback), so `pocket_furnace`'s `every: 2` runs about every 5 s on an idle inventory.
- **`infinite_bucket`'s built-in 1 s feature cooldown overrides any item-level `cooldown:`.**
- **`auto_smelt` without `telekinesis` smelts mob drops too** (`ToolDrops.onMobDrops`); smelted amounts are capped
  at the result's max stack size.
- **Extra blocks from area/vein/tree tools probably drop no XP** (`breakNaturally(tool)`; unverified against Paper).
- **Crowbar drops bypass telekinesis.**
- **Even area sizes give n+1** (`width: 4` breaks 5) in `area_break`, `till`, `seed_planter`.
- **`till` accepts a passable block above** (short grass) where vanilla requires air.
- **Prospector message says "veins" but counts blocks.**
- **`hunter_kills` credits the main-hand item at death time**, not the bow that fired; a thrown trident's damage never
  counts for `damage_dealt` although TRIDENT is whitelisted.
- **Tracker `%kill_N%` above `max-kills-shown` stays literal; `stattrack remove <id>` rejects ids whose file was
  deleted** (only `all` clears them). `remove`/`reset` act on the main hand only.
- **Region use caps reset on `/specialsadmin reload`**, not only on restart (`VanillaCooldowns.java:39`), contrary to
  the config comment.
- **Default `FIREWORK_ROCKET` rule `regions: {__global__: …}` never matches** (`WorldGuardRegions.idsAt` excludes the
  global region), so the 12 s elytra-boost cooldown applies everywhere. Defaults also ship server-specific region ids
  (`pot`, `mazo`, `mazoswap`, `mace`, `crystal_hole`, `crystal_flat`).
- **Vanilla `LAUNCH` covers only pearls, snowballs, eggs and potions**, all potions mapped to `SPLASH_POTION`;
  **`RESURRECT` ignores the entry's material** and does not skip special totems (`VanillaCooldownListener` ~83-105).
- **`duels.allowed-commands` needs names without a slash** (`Duels.java:483-486`) while `combat.allowed-commands`
  accepts both; a `/msg` entry in the duel list never matches.
- **Walking out of a duel arena is not blocked** — only teleports — though the arena menu says "nobody leaves it mid
  duel"; `snapshot-saved` says the arena "is restored after every duel" although in-place restore needs `regenerate`.
- **Starting a second arena selection throws** (`ArenaEditor.select` → `beginSelection`, uncaught
  IllegalStateException). Spawns are not checked against bounds; reselecting bounds keeps the old snapshot.
- **Probable duel/combat-log race**: with the built-in tag a fighter who quits is also a combat logger; the NPC spawns
  in the copy (cleared on release) and on rejoin `LogoutNpcs.claim` and `Duels.onJoin` both teleport. Not verified at
  runtime.
- **Blocked teleport causes, pearls and chorus share the `on-region-blocked` notification toggle**; chorus fruit is
  refused outright while tagged whenever WorldGuard is installed.
- **Lunar/Feather players never see the action bar**, so region use counts are never shown to them.
- **API**: `giveItem` caps at 64 (command 2304) and does message the player despite its javadoc; `startCooldown` with an
  unknown id silently does nothing; `activate` runs only the first feature on the primary trigger; `TriggerType.RADIUS` is never produced.
- **Cooldowns menu lists only the viewer's item cooldowns, but CLEAR ALL also clears vanilla ones.**
- **ARCHITECTURE.md** says commands root `/exyliaspecials` with aliases `/specials`, `/es`; only `/specialsadmin`
  exists. ARCHITECTURE.md/README list languages en, es, pt, fr; `ru` ships too.

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

Rechecked at `9bb51f6` (1.1.0) on 2026-10-14. Resolved and removed: standing still (the README and the
architecture notes now say it is always frozen), the drill count (README says eighteen, `DrillKind`'s javadoc
four kinds), drills needing a ready arena (the architecture notes now say so), `hotbar.yml` (now editable and
documented as such; `AimMenus` no longer mentions a `.new` file), the placeholder rename, and the README's
ExyliaLib floor (now 1.277.0). Still open:

- **`match.use-preferences`** claims each player keeps their own size and distance. Both sides play rules
  built once from the challenger's preferences, colour and style included; a rematch reuses them, seed and all.
- **`match.allow-even-formats`** claims a tied even series is replayed as a decider. Whoever wins the last
  round takes it (`MatchFormat.isDecided`). Three draws in a row give the duel up (`MatchRunner.DRAW_LIMIT`).
- **The reset confirmation says "every record, session and duel"**; `aim_matches` rows stay.
- **`docs/ARCHITECTURE.md`** still opens with "built on ExyliaLib 1.153.x"; the README's 1.277.0 is right.

Behaviour documented in place rather than promised: an accepted duel before the arenas load never starts
and says nothing; `/aim duel <player>` without a drill plays the first drill in the file, not
`default-drill`; a `default-format` missing from `formats` refuses every duel sent without a length; tab
completion offers `overall` and even lengths that are then refused; `admin_session_stop` has no confirmation and ignores duels; `max-players-per-arena` is
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
