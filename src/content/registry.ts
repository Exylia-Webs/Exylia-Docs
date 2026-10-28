/**
 * The documentation registry.
 *
 * Adding a plugin is two steps: describe it here, then drop the matching
 * `.mdx` files under `content/<id>/<lang>/`. Page titles and descriptions are
 * read from each file's frontmatter, never repeated in this file.
 */

export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

/** English is the fallback everywhere: it is what an unknown locale gets. */
export const DEFAULT_LANG: Lang = "en";

export type Localized = Record<Lang, string>;

export type DocStatus = "stable" | "beta" | "soon";

/**
 * One page, in both languages.
 *
 * `id` is the stable identity across languages — it is what lets the language
 * toggle land on the same page instead of the index. The slugs are what the URL
 * and the file name read, and they differ on purpose: an English URL should not
 * say `introduccion`.
 */
export type DocRef = {
  id: string;
  slugs: Localized;
};

export type NavGroup = {
  label: Localized;
  pages: DocRef[];
};

export type Plugin = {
  id: string;
  name: string;
  tagline: Localized;
  summary: Localized;
  version: string;
  status: DocStatus;
  category: Localized;
  /** Minecraft versions the plugin targets. */
  minecraft: string;
  tags: Localized[];
  /**
   * Wide 2:1 key art, served from the plugin bucket. Every plugin declares one
   * even when the file is not uploaded yet: the banner components fall back to
   * the monogram on a load error, so a missing image degrades instead of
   * breaking the layout.
   */
  banner: string;
  /** BuiltByBit resource page. Absent for what is not sold on its own. */
  purchase?: string;
  /** GitHub releases of a free, open-source plugin; shown in place of `purchase`. */
  download?: string;
  /** Sidebar structure. Empty for plugins whose docs are not written yet. */
  nav: NavGroup[];
};

export const SITE = {
  name: "Exylia Docs",
  url: "https://docs.exylia.net",
  discord: "https://discord.exylia.net",
  hub: "https://exylia.net",
  /** Every resource on BuiltByBit, where the licences are actually sold. */
  store: "https://link.exylia.net/@services",
  description: {
    en: "Official documentation for Exylia's Minecraft plugins: installation guides, configuration reference, commands, permissions, placeholders and API.",
    es: "Documentación oficial de los plugins de Exylia: guías de instalación, configuración, comandos, permisos, placeholders y API.",
  } satisfies Localized,
} as const;

/** Shorthand for a page whose slug is the same string in both languages. */
function page(id: string, en: string, es: string): DocRef {
  return { id, slugs: { en, es } };
}

const FFA_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("arenas", "arenas", "arenas"),
      page("rules", "rules", "reglas"),
      page("kits", "kits", "kits"),
      page("spawns", "spawns", "spawns"),
      page("regeneration", "regeneration", "regeneracion"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("combat", "combat", "combate"),
      page("killstreaks", "killstreaks", "killstreaks"),
      page("stats", "stats", "estadisticas"),
      page("scoreboard", "scoreboard", "scoreboard"),
      page("player-settings", "player-settings", "ajustes-jugador"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const CAPTURE_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("event-types", "event-types", "tipos-de-evento"),
      page("zones", "zones", "zonas"),
      page("rewards", "rewards", "recompensas"),
      page("scheduling", "scheduling", "programacion"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("clans", "clans", "clanes"),
      page("stats", "stats", "estadisticas"),
      page("visuals", "visuals", "visuales"),
      page("webhooks", "webhooks", "webhooks"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const EVENTS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("arenas", "arenas", "arenas"),
      page("event-types", "event-types", "tipos-de-evento"),
      page("teams-and-kits", "teams-and-kits", "equipos-y-kits"),
      page("rewards", "rewards", "recompensas"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("game-flow", "game-flow", "flujo-de-juego"),
      page("gauntlets", "gauntlets", "gauntlets"),
      page("inscriptions", "inscriptions", "inscripciones"),
      page("network", "network", "red"),
      page("stats", "stats", "estadisticas"),
      page("visuals", "visuals", "visuales"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const LIB_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("library-config", "library-config", "config-de-la-libreria"),
      page("first-plugin", "first-plugin", "primer-plugin"),
    ],
  },
  {
    label: { en: "Foundations", es: "Fundamentos" },
    pages: [
      page("config", "configuration", "configuracion"),
      page("text", "text", "texto"),
      page("tasks", "tasks", "tareas"),
      page("database", "database", "base-de-datos"),
    ],
  },
  {
    label: { en: "Interfaces", es: "Interfaces" },
    pages: [
      page("menus", "menus", "menus"),
      page("items", "items", "items"),
      page("actions", "actions", "acciones"),
      page("input", "input-and-editors", "entrada-y-editores"),
      page("player-settings", "player-settings", "ajustes-de-jugador"),
      page("overlays", "overlays", "overlays"),
      page("notices", "notices", "avisos"),
      page("chat", "chat", "chat"),
      page("discord-webhooks", "discord-webhooks", "webhooks-de-discord"),
      page("cosmetics", "cosmetics", "cosmeticos"),
    ],
  },
  {
    label: { en: "Visuals", es: "Visuales" },
    pages: [
      page("effects", "effects", "efectos"),
      page("sequences", "sequences", "secuencias"),
      page("displays", "displays-and-npcs", "displays-y-npcs"),
      page("holograms", "holograms", "hologramas"),
      page("ragdolls", "ragdolls", "ragdolls"),
      page("mobs-and-models", "mobs-and-models", "mobs-y-modelos"),
      page("display", "display", "pantalla"),
    ],
  },
  {
    label: { en: "Gameplay", es: "Juego" },
    pages: [
      page("schedules", "schedules", "horarios"),
      page("regions", "regions", "regiones"),
      page("world", "world", "mundo"),
      page("replays", "replays", "repeticiones"),
      page("players", "players", "jugadores"),
      page("client-integration", "client-integration", "integracion-de-cliente"),
      page("rewards", "rewards", "recompensas"),
      page("crates-and-loot", "crates-and-loot", "cajas-y-loot"),
      page("economy", "economy", "economia"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("api", "api", "api"),
      page("modules", "modules", "modulos"),
      page("commands", "commands", "comandos"),
      page("web-editor", "web-editor", "editor-web"),
      page("faq", "faq", "faq"),
    ],
  },
];

function cosmeticNav(effectsEn: string, effectsEs: string): NavGroup[] {
  return [
    {
      label: { en: "Getting started", es: "Empezar" },
      pages: [
        page("introduction", "introduction", "introduccion"),
        page("installation", "installation", "instalacion"),
      ],
    },
    {
      label: { en: "Configuring", es: "Configurar" },
      pages: [page("effects", effectsEn, effectsEs)],
    },
    {
      label: { en: "Reference", es: "Referencia" },
      pages: [
        page("commands", "commands", "comandos"),
        page("placeholders", "placeholders", "placeholders"),
        page("faq", "faq", "faq"),
      ],
    },
  ];
}

const SHIELDS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("designs", "designs", "disenos"),
      page("community", "community", "comunidad"),
      page("crate", "crate", "caja"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("placeholders", "placeholders", "placeholders"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const PRACTICEBOT_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("modes", "modes", "modos"),
      page("difficulty", "difficulty", "dificultad"),
      page("equipment", "equipment", "equipamiento"),
      page("menus", "menus", "menus"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("behaviour", "behaviour", "comportamiento"),
      page("limits", "limits", "limites"),
      page("compatibility", "compatibility", "compatibilidad"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const CHATCOSMETICS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "The catalogue", es: "El catálogo" },
    pages: [
      page("catalogue", "catalogue", "catalogo"),
      page("tags", "tags", "etiquetas"),
      page("colors", "colors", "colores"),
      page("fonts", "fonts", "fuentes"),
      page("animations", "animations", "animaciones"),
      page("custom", "custom", "personalizados"),
    ],
  },
  {
    label: { en: "Wearing them", es: "Llevarlos" },
    pages: [
      page("menus", "menus", "menus"),
      page("entitlements", "entitlements", "concesiones"),
      page("tokens", "tokens", "tokens"),
    ],
  },
  {
    label: { en: "Chat module", es: "Módulo de chat" },
    pages: [
      page("chat", "chat", "chat"),
      page("channels", "channels", "canales"),
      page("formats", "formats", "formatos"),
      page("filter", "filter", "filtro"),
      page("chat-features", "chat-features", "funciones-de-chat"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("integrations", "integrations", "integraciones"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const TOTEMTRAINER_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("modes", "modes", "modos"),
      page("grading", "grading", "calificacion"),
      page("duels", "duels", "duelos"),
      page("arenas", "arenas", "arenas"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("training", "training", "entrenamiento"),
      page("stats", "stats", "estadisticas"),
      page("scoreboard", "scoreboard", "scoreboard"),
      page("compatibility", "compatibility", "compatibilidad"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const AIMTRAINER_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("drills", "drills", "ejercicios"),
      page("scoring", "scoring", "puntuacion"),
      page("settings", "settings", "ajustes"),
      page("duels", "duels", "duelos"),
      page("arenas", "arenas", "arenas"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("training", "training", "entrenamiento"),
      page("stats", "stats", "estadisticas"),
      page("hud", "hud", "hud"),
      page("compatibility", "compatibility", "compatibilidad"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("menus", "menus", "menus"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const CLANS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("modules", "modules", "modulos"),
      page("roles", "roles", "roles"),
      page("claims", "claims", "terrenos"),
      page("levels", "levels", "niveles"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("dtr", "dtr", "dtr"),
      page("relations", "relations", "relaciones"),
      page("war-tools", "war-tools", "herramientas-de-guerra"),
      page("clan-wars", "clan-wars", "guerras-de-clanes"),
      page("recruitment", "recruitment", "reclutamiento"),
      page("chat-and-mail", "chat-and-mail", "chat-y-correo"),
      page("webhooks", "webhooks", "webhooks"),
      page("stats", "stats", "estadisticas"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("menus", "menus", "menus"),
      page("database", "database", "base-de-datos"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const ARMORSKIN_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("skins", "skins", "skins"),
      page("wardrobe", "wardrobe", "vestidor"),
      page("animations", "animations", "animaciones"),
      page("effects", "effects", "efectos"),
      page("crate", "crate", "caja"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("placeholders", "placeholders", "placeholders"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const EMOTES_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("emotes", "emotes", "emotes"),
      page("playing", "playing", "reproducir"),
      page("duets", "duets", "duetos"),
      page("menu", "menu", "menu"),
      page("crate", "crate", "caja"),
      page("showcases", "showcases", "showcases"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("placeholders", "placeholders", "placeholders"),
      page("faq", "faq", "faq"),
    ],
  },
];

const ANALYTICS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("linking", "linking", "vinculacion"),
    ],
  },
  {
    label: { en: "The dashboard", es: "El panel" },
    pages: [
      page("dashboard", "dashboard", "panel"),
      page("audience", "audience", "audiencia"),
      page("players", "players", "jugadores"),
      page("servers", "servers", "servidores"),
      page("community", "community", "comunidad"),
      page("events", "events", "eventos"),
      page("revenue", "revenue", "ingresos"),
      page("analyst", "analyst", "analista"),
      page("team", "team", "equipo"),
    ],
  },
  {
    label: { en: "The agent", es: "El agente" },
    pages: [
      page("data", "data", "datos"),
      page("privacy", "privacy", "privacidad"),
      page("economy", "economy", "economia"),
      page("integrations", "integrations", "integraciones"),
      page("configuration", "configuration", "configuracion"),
      page("remote-config", "remote-config", "configuracion-remota"),
      page("commands", "commands", "comandos"),
    ],
  },
  {
    label: { en: "Developers", es: "Desarrolladores" },
    pages: [page("api", "api", "api")],
  },
  {
    label: { en: "Help", es: "Ayuda" },
    pages: [page("faq", "faq", "faq")],
  },
];

function effectsNav(extra: DocRef[] = []): NavGroup[] {
  return [
    {
      label: { en: "Getting started", es: "Empezar" },
      pages: [
        page("introduction", "introduction", "introduccion"),
        page("installation", "installation", "instalacion"),
        page("first-steps", "first-steps", "primeros-pasos"),
      ],
    },
    {
      label: { en: "Configuring", es: "Configurar" },
      pages: [
        page("effects", "effects", "efectos"),
        page("sequences", "sequences", "secuencias"),
        page("create-with-ai", "create-with-ai", "crear-con-ia"),
        page("modes-and-tokens", "modes-and-tokens", "modos-y-fichas"),
        page("menu", "menu", "menu"),
        ...extra,
      ],
    },
    {
      label: { en: "Reference", es: "Referencia" },
      pages: [
        page("commands", "commands", "comandos"),
        page("permissions", "permissions", "permisos"),
        page("configuration", "configuration", "configuracion"),
        page("placeholders", "placeholders", "placeholders"),
        page("api", "api", "api"),
        page("faq", "faq", "faq"),
      ],
    },
  ];
}

const ARMORTRIMS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("trims", "trims", "trims"),
      page("modes-and-items", "modes-and-items", "modos-y-objetos"),
      page("menu", "menu", "menu"),
      page("crate", "crate", "caja"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("placeholders", "placeholders", "placeholders"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const CLASSES_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("classes", "classes", "clases"),
      page("abilities", "abilities", "habilidades"),
      page("passives", "passives", "pasivas"),
      page("weapons", "weapons", "armas"),
      page("energy", "energy", "energia"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const PRACTICE_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Arenas", es: "Arenas" },
    pages: [
      page("arenas", "arenas", "arenas"),
      page("clones", "clones", "clones"),
      page("extra-regions", "extra-regions", "regiones-extra"),
    ],
  },
  {
    label: { en: "Kits", es: "Kits" },
    pages: [
      page("kits", "kits", "kits"),
      page("kit-rules", "kit-rules", "reglas-de-kit"),
      page("special-conditions", "special-conditions", "condiciones-especiales"),
      page("kit-editor", "kit-editor", "editor-de-kits"),
    ],
  },
  {
    label: { en: "Playing", es: "Jugar" },
    pages: [
      page("queue", "queue", "cola"),
      page("duels", "duels", "duelos"),
      page("parties", "parties", "parties"),
      page("bot-pvp", "bot-pvp", "pvp-contra-bots"),
      page("spectating", "spectating", "espectadores"),
      page("lobby", "lobby", "lobby"),
    ],
  },
  {
    label: { en: "Competitive", es: "Competitivo" },
    pages: [
      page("elo", "elo", "elo"),
      page("seasons", "seasons", "temporadas"),
      page("stats", "stats", "estadisticas"),
      page("match-history", "match-history", "historial"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("scoreboards", "scoreboards", "scoreboards"),
      page("configuration", "configuration", "configuracion"),
      page("database", "database", "base-de-datos"),
      page("web-api", "web-api", "web-api"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const SURVIVALCORE_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Modules", es: "Módulos" },
    pages: [
      page("modules", "modules", "modulos"),
      page("movement", "movement", "movimiento"),
      page("combat", "combat", "combate"),
      page("duel-rooms", "duel-rooms", "salas-de-duelo"),
      page("progression", "progression", "progresion"),
      page("missions-and-seasons", "missions-and-seasons", "misiones-y-temporadas"),
      page("rewards-and-votes", "rewards-and-votes", "recompensas-y-votos"),
      page("kits-and-crates", "kits-and-crates", "kits-y-cajas"),
      page("zones", "zones", "zonas"),
      page("restrictions", "restrictions", "restricciones"),
      page("quality-of-life", "quality-of-life", "utilidades"),
      page("optimization", "optimization", "optimizacion"),
    ],
  },
  {
    label: { en: "Economy", es: "Economía" },
    pages: [
      page("economy", "economy", "economia"),
      page("shop", "shop", "tienda"),
      page("market", "market", "mercado"),
      page("trade-and-vaults", "trade-and-vaults", "intercambio-y-baules"),
    ],
  },
  {
    label: { en: "Protections", es: "Protecciones" },
    pages: [
      page("protections", "protections", "protecciones"),
      page("protection-raids", "protection-raids", "asaltos-a-protecciones"),
      page("protection-economy", "protection-economy", "economia-de-protecciones"),
      page("protection-admin", "protection-admin", "administrar-protecciones"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("menus", "menus", "menus"),
      page("database", "database", "base-de-datos"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const SANDBOX_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("worlds", "worlds", "mundos"),
      page("kits", "kits", "kits"),
      page("kit-room", "kit-room", "sala-de-kits"),
      page("tp-regions", "tp-regions", "regiones-tp"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("rtp-and-queue", "rtp-and-queue", "rtp-y-cola"),
      page("teleports", "teleports", "teletransportes"),
      page("admin-panel", "admin-panel", "panel-admin"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("menus", "menus", "menus"),
      page("database", "database", "base-de-datos"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const STAFF_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Modules", es: "Módulos" },
    pages: [
      page("staff-mode", "staff-mode", "modo-staff"),
      page("vanish", "vanish", "vanish"),
      page("freeze", "freeze", "freeze"),
      page("inspect", "inspect", "inspeccion"),
      page("teleport", "teleport", "teletransporte"),
      page("xray-vision", "xray-vision", "vision-xray"),
      page("staff-chat", "staff-chat", "chat-staff"),
      page("staff-list", "staff-list", "lista-staff"),
      page("reports", "reports", "reportes"),
      page("helpop", "helpop", "helpop"),
      page("punishments", "punishments", "sanciones"),
      page("mining", "mining", "mineria"),
      page("inventory-restore", "inventory-restore", "restaurar-inventario"),
      page("item-revocation", "item-revocation", "revocacion-de-objetos"),
      page("replays", "replays", "repeticiones"),
      page("reveal", "reveal", "revelar"),
      page("afk", "afk", "afk"),
      page("action-bar", "action-bar", "barra-de-accion"),
      page("staff-log", "staff-log", "registro-staff"),
      page("staff-admin", "staff-admin", "panel-admin"),
      page("staff-web", "staff-web", "staff-web"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("languages", "languages", "idiomas"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const MINES_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("mines", "mines", "minas"),
      page("area", "area", "area"),
      page("classic-mines", "classic-mines", "minas-clasicas"),
      page("realistic-mines", "realistic-mines", "minas-realistas"),
      page("loot-and-effects", "loot-and-effects", "botin-y-efectos"),
      page("fortune", "fortune", "fortuna"),
      page("lucky-rewards", "lucky-rewards", "premios-de-suerte"),
      page("boosts", "boosts", "potenciadores"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("holograms", "holograms", "hologramas"),
      page("players-menu", "players-menu", "menu-de-jugadores"),
      page("stats", "stats", "estadisticas"),
      page("integrations", "integrations", "integraciones"),
      page("migration", "migration", "migracion"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const PROXYUTILS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Features", es: "Funciones" },
    pages: [
      page("modules", "modules", "modulos"),
      page("punishments", "punishments", "sanciones"),
      page("login-bans", "login-bans", "baneos-al-entrar"),
      page("updates", "updates", "actualizaciones"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("protocol", "protocol", "protocolo"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const DISPLAYS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Holograms", es: "Hologramas" },
    pages: [
      page("holograms", "holograms", "hologramas"),
      page("line-tags", "line-tags", "etiquetas-de-linea"),
      page("pages", "pages", "paginas"),
      page("visibility", "visibility", "visibilidad"),
    ],
  },
  {
    label: { en: "NPCs", es: "NPCs" },
    pages: [page("npcs", "npcs", "npcs")],
  },
  {
    label: { en: "Shared", es: "Común" },
    pages: [
      page("interactions", "interactions", "interacciones"),
      page("fine-adjust", "fine-adjust", "ajuste-fino"),
      page("editing-files", "editing-files", "editar-archivos"),
      page("menus", "menus", "menus"),
      page("migration", "migration", "migracion"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("file-reference", "file-reference", "referencia-de-archivos"),
      page("faq", "faq", "faq"),
    ],
  },
];

const MARKET_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Between players", es: "Entre jugadores" },
    pages: [
      page("auction-house", "auction-house", "casa-de-subastas"),
      page("auctions", "auctions", "subastas"),
      page("orders", "orders", "pedidos"),
      page("bazaar", "bazaar", "bazar"),
      page("trade", "trade", "intercambios"),
    ],
  },
  {
    label: { en: "Selling to the server", es: "Vender al servidor" },
    pages: [
      page("shop", "shop", "tienda"),
      page("selling", "selling", "venta"),
      page("sell-wands", "sell-wands", "varitas-de-venta"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("collect", "collect", "recoger"),
      page("prices", "prices", "precios"),
      page("administration", "administration", "administracion"),
      page("integrations", "integrations", "integraciones"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const CASINO_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("playing", "playing", "jugar"),
    ],
  },
  {
    label: { en: "Games", es: "Juegos" },
    pages: [page("games", "games", "juegos")],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("faq", "faq", "faq"),
    ],
  },
];

const DUELS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
    ],
  },
  {
    label: { en: "Duels", es: "Duelos" },
    pages: [
      page("dueling", "dueling", "duelos"),
      page("arenas-and-kits", "arenas-and-kits", "arenas-y-kits"),
      page("network", "network", "red"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("faq", "faq", "faq"),
    ],
  },
];

const MOBS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("building-mobs", "building-mobs", "crear-mobs"),
      page("models", "models", "modelos"),
      page("rewards", "rewards", "recompensas"),
      page("generators", "generators", "generadores"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const REWARDS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
    ],
  },
  {
    label: { en: "Rewards", es: "Recompensas" },
    pages: [
      page("rewards", "rewards", "recompensas"),
      page("calendar", "calendar", "calendario"),
      page("codes", "codes", "codigos"),
    ],
  },
  {
    label: { en: "Modules", es: "Módulos" },
    pages: [
      page("afk-zones", "afk-zones", "zonas-afk"),
      page("votes", "votes", "votos"),
      page("referrals", "referrals", "referidos"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("network", "network", "red"),
      page("faq", "faq", "faq"),
    ],
  },
];

const TABLETOP_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("playing", "playing", "jugar"),
    ],
  },
  {
    label: { en: "Games", es: "Juegos" },
    pages: [page("games", "games", "juegos")],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const COMBAT_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
    ],
  },
  {
    label: { en: "Combat", es: "Combate" },
    pages: [
      page("combat-tag", "combat-tag", "etiqueta-de-combate"),
      page("logging-out", "logging-out", "desconexion"),
      page("restrictions", "restrictions", "restricciones"),
      page("protection", "protection", "proteccion"),
      page("cooldowns", "cooldowns", "cooldowns"),
    ],
  },
  {
    label: { en: "Kills", es: "Kills" },
    pages: [
      page("stats", "stats", "estadisticas"),
      page("kill-rewards", "kill-rewards", "recompensas"),
    ],
  },
  {
    label: { en: "Network", es: "Red" },
    pages: [
      page("cross-server", "cross-server", "multiservidor"),
      page("integrations", "integrations", "integraciones"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const CRATES_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Crates", es: "Cajas" },
    pages: [
      page("crates", "crates", "cajas"),
      page("keys", "keys", "llaves"),
      page("rewards", "rewards", "recompensas"),
      page("openings", "openings", "aperturas"),
      page("animations", "animations", "animaciones"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const SPECIALS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Special items", es: "Ítems especiales" },
    pages: [
      page("items", "items", "items"),
      page("actions", "actions", "acciones"),
      page("states", "states", "estados"),
      page("item-catalogue", "item-catalogue", "catalogo-de-items"),
      page("tools", "tools", "herramientas"),
      page("trackers", "trackers", "contadores"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("combat", "combat", "combate"),
      page("cooldowns", "cooldowns", "cooldowns"),
      page("duels", "duels", "duelos"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const PROTECTIONS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Protecting land", es: "Proteger terreno" },
    pages: [
      page("creating-protections", "creating-protections", "crear-protecciones"),
      page("backends", "backends", "backends"),
      page("people-and-access", "people-and-access", "personas-y-acceso"),
      page("menus", "menus", "menus"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("raids", "raids", "asaltos"),
      page("economy", "economy", "economia"),
      page("land-tools", "land-tools", "herramientas"),
      page("warps", "warps", "warps"),
      page("administration", "administration", "administracion"),
      page("migration", "migration", "migracion"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const ECONOMY_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Configuring", es: "Configurar" },
    pages: [
      page("currencies", "currencies", "monedas"),
      page("payments", "payments", "pagos"),
      page("banknotes", "banknotes", "billetes"),
      page("interest", "interest", "intereses"),
      page("leaderboards", "leaderboards", "clasificaciones"),
    ],
  },
  {
    label: { en: "Systems", es: "Sistemas" },
    pages: [
      page("vault", "vault", "vault"),
      page("network", "network", "red"),
      page("ledger", "ledger", "registro"),
      page("migration", "migration", "migracion"),
      page("integrations", "integrations", "integraciones"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("api", "api", "api"),
      page("faq", "faq", "faq"),
    ],
  },
];

const GRAVES_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Graves", es: "Tumbas" },
    pages: [
      page("graves", "graves", "tumbas"),
      page("menu", "menu", "menu"),
      page("staff", "staff", "staff"),
      page("network", "network", "red"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("faq", "faq", "faq"),
    ],
  },
];

const PLAYERVAULTS_NAV: NavGroup[] = [
  {
    label: { en: "Getting started", es: "Empezar" },
    pages: [
      page("introduction", "introduction", "introduccion"),
      page("installation", "installation", "instalacion"),
      page("first-steps", "first-steps", "primeros-pasos"),
    ],
  },
  {
    label: { en: "Vaults", es: "Baúles" },
    pages: [
      page("vaults", "vaults", "cofres"),
      page("purchases", "purchases", "compras"),
      page("staff", "staff", "staff"),
      page("network", "network", "red"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
      page("permissions", "permissions", "permisos"),
      page("placeholders", "placeholders", "placeholders"),
      page("configuration", "configuration", "configuracion"),
      page("faq", "faq", "faq"),
    ],
  },
];

export const plugins: Plugin[] = [
  {
    id: "exyliaffa",
    name: "ExyliaFFA",
    tagline: {
      en: "High-performance FFA system",
      es: "Sistema FFA de alto rendimiento",
    },
    summary: {
      en: "Unlimited arenas, multiple kits, permission-gated spawns, per-arena rules, schematic regeneration, persistent stats and a full admin panel.",
      es: "Arenas ilimitadas, kits múltiples, spawns con permisos, reglas por arena, regeneración con esquemáticos, estadísticas persistentes y panel de administración completo.",
    },
    version: "1.4.0",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/ffa/ExyliaFFABanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-ffa-core-ffa-kitpvp-system.95568/",
    tags: [
      { en: "Arenas", es: "Arenas" },
      { en: "Kits", es: "Kits" },
      { en: "Stats", es: "Estadísticas" },
      { en: "Folia", es: "Folia" },
    ],
    nav: FFA_NAV,
  },
  {
    id: "exyliapractice",
    name: "ExyliaPracticeCore",
    tagline: { en: "A whole practice server", es: "Un servidor de practice entero" },
    summary: {
      en: "Ranked matchmaking, duels, parties, a per-player kit editor, arenas that clone and regenerate themselves, nine ELO ranks and seasons — the largest plugin in the ecosystem.",
      es: "Matchmaking clasificatorio, duelos, parties, editor de kits por jugador, arenas que se clonan y regeneran solas, nueve rangos de ELO y temporadas: el plugin más grande del ecosistema.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/practice/ExyliaPracticeCoreBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-practicecore-ranked-duels.123130/",
    tags: [
      { en: "Queue", es: "Colas" },
      { en: "ELO", es: "ELO" },
      { en: "Parties", es: "Parties" },
      { en: "Folia", es: "Folia" },
    ],
    nav: PRACTICE_NAV,
  },
  {
    id: "exyliacapture",
    name: "ExyliaCapture",
    tagline: {
      en: "Zone-capture events, eight mechanics",
      es: "Eventos de captura de zona, ocho mecánicas",
    },
    summary: {
      en: "KOTH, point-scored KOTH, Conquest, Payload, Destroy The Core and Bounty, all created from in-game menus with a shared zone wand, schedules, rewards and clan support.",
      es: "KOTH, KOTH por puntos, Conquest, Payload, Destroy The Core y Bounty, todos creados desde menús in-game con selector de zona, horarios, recompensas y soporte de clanes.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Events", es: "Eventos" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/capture/ExyliaCaptureBanner.webp",
    purchase: "https://builtbybit.com/resources/exyliacapture-koth-conquest-dtc-more.105758/",
    tags: [
      { en: "KOTH", es: "KOTH" },
      { en: "Conquest", es: "Conquest" },
      { en: "Payload", es: "Payload" },
      { en: "Clans", es: "Clanes" },
    ],
    nav: CAPTURE_NAV,
  },
  {
    id: "exyliakilleffect",
    name: "ExyliaKillEffect",
    tagline: { en: "Kill effects drawn with display entities", es: "Efectos de muerte hechos con display entities" },
    summary: {
      en: "110 kill effects across five categories, each one a body choreographed joint by joint among real items and blocks, often with the killer and the crowd acting it out: chosen from a menu, won out of a crate, bought with currency or bound to a weapon with a token, and written as sequences a server owner can edit.",
      es: "110 efectos de muerte en cinco categorías, cada uno un cuerpo coreografiado articulación a articulación entre objetos y bloques reales, muchas veces con el asesino y el público actuándolo: elegidos desde un menú, ganados en una caja, comprados con moneda o atados a un arma con una ficha, y escritos como secuencias que el dueño puede editar.",
    },
    version: "1.8.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/kill-effect/ExyliaKillEffectBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-killeffects-eula-friendly.79398/",
    tags: [
      { en: "Displays", es: "Displays" },
      { en: "Cosmetic", es: "Cosmético" },
      { en: "Folia", es: "Folia" },
    ],
    nav: effectsNav([page("crate", "crate", "caja")]),
  },
  {
    id: "exyliahiteffect",
    name: "ExyliaHitEffect",
    tagline: { en: "Hit effects drawn with display entities", es: "Efectos de golpe hechos con display entities" },
    summary: {
      en: "90 hit effects across six categories, played on the body of whoever was struck and written to a budget of six tenths of a second: chosen from a menu, won out of a crate, bought with currency or bound to a weapon with a token.",
      es: "90 efectos de golpe en seis categorías, lanzados sobre el cuerpo de quien recibe el impacto y escritos con un presupuesto de seis décimas de segundo: elegidos desde un menú, ganados en una caja, comprados con moneda o atados a un arma con una ficha.",
    },
    version: "1.5.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/hit-effect/ExyliaHitEffectBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-hiteffect-eula-friendly.79413/",
    tags: [
      { en: "Displays", es: "Displays" },
      { en: "Combat", es: "Combate" },
      { en: "Folia", es: "Folia" },
    ],
    nav: effectsNav([page("crate", "crate", "caja")]),
  },
  {
    id: "exyliaemotes",
    name: "ExyliaEmotes",
    tagline: { en: "Emotes performed by an animated body, filmed from outside", es: "Emotes hechos por un cuerpo animado, filmados desde fuera" },
    summary: {
      en: "68 emotes in four tabs, each one a body choreographed joint by joint that the player watches from a camera outside it: 52 that loop until stopped, two duets that meet in the middle, props built from blocks, owned by permission or won out of a crate, looped in lobby showcases, and written in a file a server owner can edit.",
      es: "68 emotes en cuatro pestañas, cada uno un cuerpo coreografiado articulación a articulación que el jugador mira desde una cámara fuera de él: 52 que se repiten hasta que se paran, dos duetos que se encuentran en el medio, atrezo hecho de bloques, conseguidos por permiso o ganados en una caja, repetidos en showcases de lobby, y escritos en un archivo que el dueño puede editar.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/emotes/ExyliaEmotesBanner.webp",
    tags: [
      { en: "Emotes", es: "Emotes" },
      { en: "Cosmetic", es: "Cosmético" },
      { en: "Folia", es: "Folia" },
    ],
    nav: EMOTES_NAV,
  },
  {
    id: "exyliaarmortrims",
    name: "ExyliaArmorTrims",
    tagline: { en: "Armour trims drawn with packets", es: "Trims de armadura dibujados con paquetes" },
    summary: {
      en: "Eighteen named presets plus any pattern and material combined by hand, chosen on one screen, won out of a crate, bought with currency or carried as a trim item, and drawn on the way to the client so the armour itself is never converted.",
      es: "Dieciocho presets con nombre más cualquier combinación de patrón y material hecha a mano, elegidos en una sola pantalla, ganados en una caja, comprados con moneda o llevados como objeto, y dibujados en el camino al cliente para que la armadura nunca se convierta.",
    },
    version: "1.4.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/armor-trims/ExyliaArmorTrimsBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-armortrim-eula-friendly.79414/",
    tags: [
      { en: "Trims", es: "Trims" },
      { en: "Cosmetic", es: "Cosmético" },
      { en: "Folia", es: "Folia" },
    ],
    nav: ARMORTRIMS_NAV,
  },
  {
    id: "exyliaarmorskin",
    name: "ExyliaArmorSkin",
    tagline: { en: "Armour skins that never touch the item", es: "Skins de armadura que nunca tocan el objeto" },
    summary: {
      en: "Forty animated colour-and-trim skins worn over any armour piece, chosen from a wardrobe, won out of a crate, bought with currency or carried as an item, and drawn on the way to the client with packets: enchantments, attributes, durability and plugin data stay exactly as they were.",
      es: "Cuarenta skins animadas de color y trim que se llevan sobre cualquier pieza de armadura, elegidas en un vestidor, ganadas en una caja, compradas con moneda o llevadas como objeto, y dibujadas en el camino al cliente con paquetes: encantamientos, atributos, durabilidad y datos de otros plugins quedan intactos.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/armor-skin/ExyliaArmorSkinBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-armorskin-eula-friendly.123499/",
    tags: [
      { en: "Skins", es: "Skins" },
      { en: "Cosmetic", es: "Cosmético" },
      { en: "Packets", es: "Paquetes" },
      { en: "Folia", es: "Folia" },
    ],
    nav: ARMORSKIN_NAV,
  },
  {
    id: "exyliaarrows",
    name: "ExyliaArrows",
    tagline: { en: "Arrow effects drawn with display entities", es: "Efectos de flecha hechos con display entities" },
    summary: {
      en: "120 projectile effects across six categories, each one three moments — launch, trail and impact — drawn with real blocks and items: chosen from a menu or bound to a bow with a token.",
      es: "120 efectos de proyectil en seis categorías, cada uno con tres momentos — lanzamiento, estela e impacto — dibujados con bloques y objetos reales: elegidos desde un menú o atados a un arco con una ficha.",
    },
    version: "1.6.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/arrows/ExyliaArrowsBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-arrows-eula-friendly.99752/",
    tags: [
      { en: "Displays", es: "Displays" },
      { en: "Projectiles", es: "Proyectiles" },
      { en: "Folia", es: "Folia" },
    ],
    nav: effectsNav([page("crate", "crate", "caja")]),
  },
  {
    id: "exyliashields",
    name: "ExyliaShields",
    tagline: { en: "A shield design editor in a menu", es: "Un editor de escudos en un menú" },
    summary: {
      en: "43 patterns and 16 colours layered into custom shield designs, saved in numbered slots, unlocked by permission, a crate or currency, and shareable through a community library.",
      es: "43 patrones y 16 colores en capas para diseñar escudos, guardados en ranuras numeradas, desbloqueados por permiso, caja o moneda, y compartibles en una biblioteca comunitaria.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Cosmetic", es: "Cosmético" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/shields/ExyliaShieldsBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-shields-eula-friendly.99717/",
    tags: [
      { en: "Shields", es: "Escudos" },
      { en: "Editor", es: "Editor" },
      { en: "Folia", es: "Folia" },
    ],
    nav: SHIELDS_NAV,
  },
  {
    id: "exyliachatcosmetics",
    name: "ExyliaChatCosmetics",
    tagline: { en: "Chat cosmetics, and the chat itself", es: "Cosméticos de chat, y el chat mismo" },
    summary: {
      en: "Tags, nick, rank, chat and shadow colours, fonts and modifiers a player wears from a menu, custom tags and colours they mix themselves, grants that expire, loadouts — and a full chat module underneath: channels, formats, a bilingual filter, mentions, emojis, item renders, whispers and an announcer.",
      es: "Etiquetas, colores de nick, de rango, de chat y de sombra, fuentes y modificadores que el jugador se pone desde un menú, etiquetas y colores que se mezcla él mismo, concesiones que caducan, loadouts — y debajo un módulo de chat completo: canales, formatos, un filtro bilingüe, menciones, emojis, ítems mostrados, susurros y un anunciador.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Social", es: "Social" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/chat-cosmetics/ExyliaChatCosmeticsBanner.webp",
    tags: [
      { en: "Chat", es: "Chat" },
      { en: "Cosmetics", es: "Cosméticos" },
      { en: "Filter", es: "Filtro" },
      { en: "Channels", es: "Canales" },
      { en: "Folia", es: "Folia" },
    ],
    nav: CHATCOSMETICS_NAV,
  },
  {
    id: "exyliaclans",
    name: "ExyliaClans",
    tagline: { en: "Clans, territory and raiding", es: "Clanes, territorio y raideo" },
    summary: {
      en: "Per-clan ranks written by the players themselves, a bank, rectangular land claims, deaths till raidable, levels, alliances and rivalries, a recruitment board in both directions, and a clan mailbox.",
      es: "Rangos que cada clan escribe por su cuenta, banco, terrenos rectangulares, deaths till raidable, niveles, alianzas y rivalidades, un tabl\u00f3n de reclutamiento en los dos sentidos y un buz\u00f3n de clan.",
    },
    version: "1.3.0",
    status: "stable",
    category: { en: "Social", es: "Social" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/clans/ExyliaClansBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-clans.123502/",
    tags: [
      { en: "Clans", es: "Clanes" },
      { en: "Claims", es: "Terrenos" },
      { en: "DTR", es: "DTR" },
      { en: "Folia", es: "Folia" },
    ],
    nav: CLANS_NAV,
  },
  {
    id: "exyliaclasses",
    name: "ExyliaClasses",
    tagline: { en: "HCF classes worn, not chosen", es: "Clases HCF que se visten, no se eligen" },
    summary: {
      en: "Six editable classes entered by wearing an armour set: passive effects, conditional passives, right-click abilities, hold effects, an energy resource, and arrow marks or backstabs \u2014 all of it written in YAML files you can add to.",
      es: "Seis clases editables en las que se entra vistiendo una armadura: efectos pasivos, pasivas condicionales, habilidades de clic derecho, efectos al sostener, un recurso de energ\u00eda y marcas de flecha o apu\u00f1alamientos, todo escrito en archivos YAML a los que puedes a\u00f1adir m\u00e1s.",
    },
    version: "1.0.0",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/classes/ExyliaClassesBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-classes-modern-hcf-classes-pvp.81542/",
    tags: [
      { en: "Classes", es: "Clases" },
      { en: "HCF", es: "HCF" },
      { en: "Abilities", es: "Habilidades" },
      { en: "Folia", es: "Folia" },
    ],
    nav: CLASSES_NAV,
  },
  {
    id: "exyliaevents",
    name: "ExyliaEvents",
    tagline: { en: "Fifty-one minigames in one plugin", es: "Cincuenta y un minijuegos en un plugin" },
    summary: {
      en: "TNT Tag, Spleef, OITC, CS:GO, Capture the Flag, Murder Mystery, Zombie Horde and forty-four more, each with its own arena, settings, kits, rewards and scoreboard, run from in-game menus \u2014 and gauntlets that chain them into one series.",
      es: "TNT Tag, Spleef, OITC, CS:GO, Capture the Flag, Murder Mystery, Zombie Horde y cuarenta y cuatro m\u00e1s, cada uno con su arena, ajustes, kits, recompensas y scoreboard, todo desde men\u00fas in-game \u2014 m\u00e1s gauntlets que los encadenan en una serie.",
    },
    version: "1.8.0",
    status: "stable",
    category: { en: "Events", es: "Eventos" },
    minecraft: "1.21.4+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/events/ExyliaEventsBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-events-core-22-minigames.95715/",
    tags: [
      { en: "Minigames", es: "Minijuegos" },
      { en: "Teams", es: "Equipos" },
      { en: "Arenas", es: "Arenas" },
      { en: "Folia", es: "Folia" },
    ],
    nav: EVENTS_NAV,
  },
  {
    id: "exyliasurvivalcore",
    name: "ExyliaSurvivalCore",
    tagline: {
      en: "Fifty survival modules in one plugin",
      es: "Cincuenta módulos de survival en un solo plugin",
    },
    summary: {
      en: "Homes, warps, TPA, RTP, kits, crates, mines, protections with raids and rent, an economy with its own currencies, a shop, a market, auctions, trades, missions, seasons, votes and duel rooms, each one a module that registers nothing at all when it is turned off.",
      es: "Homes, warps, TPA, RTP, kits, cajas, minas, protecciones con asaltos y alquiler, una economía con monedas propias, tienda, mercado, subastas, intercambios, misiones, temporadas, votos y salas de duelo, cada uno un módulo que no registra absolutamente nada cuando está apagado.",
    },
    version: "1.1.2",
    status: "stable",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/survival/ExyliaSurvivalCoreBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-survivalcore.123501/",
    tags: [
      { en: "Survival", es: "Survival" },
      { en: "Modular", es: "Modular" },
      { en: "Database", es: "Database" },
      { en: "Folia", es: "Folia" },
    ],
    nav: SURVIVALCORE_NAV,
  },
  {
    id: "exyliamines",
    name: "ExyliaMines",
    tagline: { en: "Mines that come back, built in game", es: "Minas que vuelven, construidas en el juego" },
    summary: {
      en: "Classic mines refilled from a weighted composition and realistic mines whose blocks grow back one by one, all built from a menu, with custom loot, lucky rewards, timed boosts, Fortune rules, holograms and statistics.",
      es: "Minas clásicas que se rellenan desde una composición ponderada y minas realistas cuyos bloques vuelven a crecer uno a uno, todo montado desde un menú, con botín propio, premios de suerte, potenciadores temporales, reglas de Fortuna, hologramas y estadísticas.",
    },
    version: "1.7.0",
    status: "stable",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    purchase: "https://builtbybit.com/resources/exylia-mines.129495/",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/mines/ExyliaMinesBanner.webp",
    tags: [
      { en: "Mines", es: "Minas" },
      { en: "Boosts", es: "Potenciadores" },
      { en: "Regeneration", es: "Regeneración" },
      { en: "Folia", es: "Folia" },
    ],
    nav: MINES_NAV,
  },
  {
    id: "exyliaprotections",
    name: "ExyliaProtections",
    tagline: { en: "Land protection run from menus", es: "Protección de terreno desde menús" },
    summary: {
      en: "Land protected with a core block or a two-corner selection, shared through roles, clans and per-player overrides, with raids on the core, a bank, upkeep and rent, subregions, upgrades, perks and public warps, on an internal index or mirrored into WorldGuard.",
      es: "Terreno protegido con un bloque núcleo o una selección de dos esquinas, compartido con roles, clanes y permisos por jugador, con asaltos al núcleo, banco, mantenimiento y alquiler, subregiones, mejoras, ventajas y warps públicos, sobre un índice interno o reflejado en WorldGuard.",
    },
    version: "1.0.2",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    purchase: "https://builtbybit.com/resources/exylia-protections.129494/",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/protections/ExyliaProtectionsBanner.webp",
    tags: [
      { en: "Protections", es: "Protecciones" },
      { en: "Raids", es: "Asaltos" },
      { en: "WorldGuard", es: "WorldGuard" },
      { en: "Folia", es: "Folia" },
    ],
    nav: PROTECTIONS_NAV,
  },
  {
    id: "exyliaspecials",
    name: "ExyliaSpecials",
    tagline: { en: "Special items, tools, combat tag and duels", es: "Ítems especiales, herramientas, combate y duelos" },
    summary: {
      en: "Special items built from YAML: abilities written in a 37-step action language, fifteen tool behaviours, limits by uses or time, cooldowns and region rules, with 70 items included and every number editable in game. Plus stat trackers, a built-in combat tag with logout NPCs and a safe-zone barrier (or DeluxeCombat, CelestCombat, PvPManager), cooldowns for vanilla items, and 1v1 duel arenas played on copies.",
      es: "Ítems especiales hechos en YAML: habilidades escritas en un lenguaje de 37 acciones, quince comportamientos de herramienta, límites por usos o tiempo, cooldowns y reglas por región, con 70 ítems incluidos y cada número editable en el juego. Además contadores de estadísticas, un sistema de combate propio con NPCs de desconexión y una barrera en las zonas seguras (o DeluxeCombat, CelestCombat, PvPManager), cooldowns para ítems vanilla y arenas de duelos 1v1 jugadas en copias.",
    },
    version: "4.1.1",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/specials/ExyliaSpecialsBanner.webp",
    purchase: "https://builtbybit.com/resources/exyliaspecials.49406/",
    tags: [
      { en: "Items", es: "Ítems" },
      { en: "PvP", es: "PvP" },
      { en: "Tools", es: "Herramientas" },
      { en: "Combat", es: "Combate" },
      { en: "Folia", es: "Folia" },
    ],
    nav: SPECIALS_NAV,
  },
  {
    id: "exyliacrates",
    name: "ExyliaCrates",
    tagline: { en: "Crates opened with keys, animated over the block", es: "Cajas que se abren con llaves, animadas sobre el bloque" },
    summary: {
      en: "Crates built and edited in game and placed on any block, opened with key items or a key balance shared across a network, priced in any mix of keys and money, with weighted rewards whose rarity follows the weight, a guarantee after so many openings, eleven opening animations everybody nearby watches, bulk openings, a history and server-wide announcements.",
      es: "Cajas creadas y editadas dentro del juego y colocadas en cualquier bloque, que se abren con ítems de llave o con un saldo de llaves compartido en toda la red, con un precio de cualquier mezcla de llaves y dinero, recompensas con peso cuya rareza sigue al peso, una garantía tras tantas aperturas, once animaciones de apertura que ven todos los que están cerca, aperturas múltiples, un historial y anuncios a todo el servidor.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/crates/ExyliaCratesBanner.webp",
    tags: [
      { en: "Crates", es: "Cajas" },
      { en: "Animations", es: "Animaciones" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: CRATES_NAV,
  },
  {
    id: "exyliacasino",
    name: "ExyliaCasino",
    tagline: { en: "Seventeen casino games against the house, drawn in 3D", es: "Diecisiete juegos de casino contra la casa, dibujados en 3D" },
    summary: {
      en: "Mines, tower, crash, hi-lo, double or nothing, blackjack, baccarat, video poker, roulette, live roulette, a wheel of fortune, coinflip, slots, plinko, keno, scratch cards and horse races, played against the house in the server's currencies on 3D tables drawn in front of each player, each with its RTP shown, every stake held by an escrow that survives a restart, and one games catalogue and busy state shared with ExyliaTabletop.",
      es: "Mines, tower, crash, hi-lo, double or nothing, blackjack, baccarat, video poker, ruleta, ruleta en directo, una rueda de la fortuna, cara o cruz, tragaperras, plinko, keno, rasca y gana y carreras de caballos, jugados contra la casa con las monedas del servidor en mesas 3D dibujadas delante de cada jugador, cada uno con su RTP a la vista, cada apuesta retenida por un depósito que sobrevive a un reinicio, y un catálogo de juegos y un estado de ocupado compartidos con ExyliaTabletop.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/casino/ExyliaCasinoBanner.webp",
    tags: [
      { en: "Casino", es: "Casino" },
      { en: "Minigames", es: "Minijuegos" },
      { en: "Economy", es: "Economía" },
      { en: "Folia", es: "Folia" },
    ],
    nav: CASINO_NAV,
  },
  {
    id: "exyliatabletop",
    name: "ExyliaTabletop",
    tagline: { en: "Twenty-two board, card and dice games played player against player", es: "Veintidós juegos de tablero, cartas y dados entre jugadores" },
    summary: {
      en: "Tic-tac-toe, four in a row, gomoku, reversi, checkers, chess, dots and boxes, battleship, memory, ludo, pick a card, high card, twenty-one, poker, truco, escoba, liar's dice, dice duel, generala, rock paper scissors, reflexes and hot potato, played player against player on 3D boards drawn in front of each player where they stand or at tables set down in the world that bystanders can watch, from open tables in a live lobby announced to the server or invitations to one or several players, for a stake in the server's currencies held by an escrow that survives a restart, with the winner taking the pot less a configurable server fee, per-game records and a public API.",
      es: "Tres en raya, cuatro en línea, gomoku, reversi, damas, ajedrez, puntos y cajas, hundir la flota, memoria, ludo, pick a card, carta alta, veintiuno, póker, truco, escoba, dados del mentiroso, duelo de dados, generala, piedra papel tijera, reflejos y patata caliente, jugados jugador contra jugador en tableros 3D dibujados delante de cada jugador allí donde está o en mesas colocadas en el mundo que los demás pueden mirar, desde mesas abiertas en un lobby en directo anunciadas al servidor o invitaciones a uno o varios jugadores, por un importe en las monedas del servidor retenido por un depósito que sobrevive a un reinicio, con el ganador llevándose el bote menos una comisión del servidor configurable, historial por juego y una API pública.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/tabletop/ExyliaTabletopBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-tabletop-18-board-card-duels.134403/",
    tags: [
      { en: "Minigames", es: "Minijuegos" },
      { en: "Duels", es: "Duelos" },
      { en: "Economy", es: "Economía" },
      { en: "Folia", es: "Folia" },
    ],
    nav: TABLETOP_NAV,
  },
  {
    id: "exyliaduels",
    name: "ExyliaDuels",
    tagline: { en: "Survival 1v1 duels with stakes paid exactly once", es: "Duelos 1v1 de survival con apuestas pagadas exactamente una vez" },
    summary: {
      en: "Survival 1v1 duels started with /duel and set up on one screen, fought with the players' own inventory (kept or at risk) or a server kit, in arenas that save, copy and regenerate themselves and can be bound to one kit, with money bets taxed as a sink and item bets in a two-player trade window, every stake held by an escrow that survives crashes, quits and restarts, spectators, records, and server-kit duels across a network on an arena server.",
      es: "Duelos 1v1 de survival que se inician con /duel y se configuran en una sola pantalla, con el inventario propio de los jugadores (sin riesgo o a riesgo) o con un kit del servidor, en arenas que se guardan, se copian y se regeneran solas y pueden ligarse a un kit, con apuestas de dinero con impuesto como sumidero y apuestas de objetos en una ventana de intercambio entre los dos, cada apuesta retenida por un depósito que sobrevive a crashes, desconexiones y reinicios, espectadores, estadísticas, y duelos con kit del servidor en red en un servidor de arenas.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "PvP", es: "PvP" },
    minecraft: "1.21.4+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/duels/ExyliaDuelsBanner.webp",
    tags: [
      { en: "Duels", es: "Duelos" },
      { en: "Arenas", es: "Arenas" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: DUELS_NAV,
  },
  {
    id: "exyliamobs",
    name: "ExyliaMobs",
    tagline: { en: "Custom mobs built in game, and the areas that keep them alive", es: "Mobs personalizados creados en el juego, y las zonas que los mantienen vivos" },
    summary: {
      en: "Custom mobs built entirely in game — name, type, equipment, attributes, flags, effects, staged skills from a library, fight phases, looks, reactions and Blockbench models worn without a resource pack — with ten reward lists from the top damager to the death loot, boosters and a queue for absent players, generators that spawn waves in an area while players are near, templates shared across a network, and a shared store other plugins such as ExyliaRewards spawn them from.",
      es: "Mobs personalizados creados por completo en el juego — nombre, tipo, equipo, atributos, flags, efectos, habilidades escenificadas de una biblioteca, fases de combate, aspecto, reacciones y modelos de Blockbench sin resource pack — con diez listas de recompensas desde el que más daño hizo hasta el botín de muerte, potenciadores y una cola para jugadores ausentes, generadores que lanzan oleadas en una zona mientras hay jugadores cerca, plantillas compartidas en toda una red, y un almacén compartido desde el que otros plugins como ExyliaRewards las generan.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21.4+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/mobs/ExyliaMobsBanner.webp",
    tags: [
      { en: "Mobs", es: "Mobs" },
      { en: "Displays", es: "Displays" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: MOBS_NAV,
  },
  {
    id: "exyliarewards",
    name: "ExyliaRewards",
    tagline: { en: "Rewards players come back for, built in game", es: "Recompensas por las que los jugadores vuelven, creadas en el juego" },
    summary: {
      en: "Daily, weekly and monthly rewards with streaks and streak freezes, timed, one-time, playtime and condition rewards, login calendars with paid catch-up, /redeem codes, AFK zones that pay more the longer players stay, NuVotifier votes with daily streaks and a network vote party that can send an ExyliaMobs piñata, and referrals paid once the new player settles in, all built and edited in game and stored in one database so every reward is paid once across the network.",
      es: "Recompensas diarias, semanales y mensuales con rachas y congelaciones de racha, recompensas con espera, de una vez, de tiempo de juego y de condición, calendarios de conexión con recuperación pagada, códigos de /redeem, zonas AFK que pagan más cuanto más se quedan los jugadores, votos de NuVotifier con rachas diarias y una fiesta de votos de red que puede enviar una piñata de ExyliaMobs, y referidos que se pagan cuando el jugador nuevo se asienta, todo creado y editado en el juego y guardado en una base de datos para que cada recompensa se pague una vez en toda la red.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21.4+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/rewards/ExyliaRewardsBanner.webp",
    tags: [
      { en: "Rewards", es: "Recompensas" },
      { en: "Economy", es: "Economía" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: REWARDS_NAV,
  },
  {
    id: "exyliacombat",
    name: "ExyliaCombat",
    tagline: { en: "A combat tag and the PvP server built round it", es: "Un combat tag y el servidor de PvP construido a su alrededor" },
    summary: {
      en: "A combat tag decided by itself or by DeluxeCombat, CelestCombat or PvPManager, with logout punishment and logout NPCs, every restriction a tagged player needs, a PvP barrier at the edge of WorldGuard, Lands, GriefPrevention, Towny and SuperiorSkyblock2 safe zones, vanilla item cooldowns per world and region, a PvP switch, newbie, respawn and loot protection, stats and leaderboards, anti kill-farming, kill rewards, streaks and bounties, death messages, nametags and a tag that follows players across a proxy, in sixteen modules that switch on and off on their own.",
      es: "Un combat tag que decide él mismo o DeluxeCombat, CelestCombat o PvPManager, con castigo y NPCs por desconexión, todas las restricciones que necesita un jugador en combate, una barrera PvP en el borde de las zonas seguras de WorldGuard, Lands, GriefPrevention, Towny y SuperiorSkyblock2, cooldowns de ítems por mundo y región, un interruptor de PvP, protección de novatos, al reaparecer y del botín, estadísticas y clasificaciones, anti farmeo de kills, recompensas, rachas y recompensas por cabeza, mensajes de muerte, nametags y un combate que sigue al jugador por todo un proxy, en dieciséis módulos que se activan por separado.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "PvP", es: "PvP" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/combat/ExyliaCombatBanner.webp",
    tags: [
      { en: "PvP", es: "PvP" },
      { en: "Combat", es: "Combate" },
      { en: "Stats", es: "Estadísticas" },
      { en: "Folia", es: "Folia" },
    ],
    nav: COMBAT_NAV,
  },
  {
    id: "exyliamarket",
    name: "ExyliaMarket",
    tagline: { en: "Every way players buy and sell", es: "Todas las formas de comprar y vender" },
    summary: {
      en: "An auction house, timed auctions with auto-bids, buy orders, a bazaar order book, a server shop edited in game, /sell with a worth list, sell wands and autosell, and safe face-to-face trades, with a shared price index, one /collect inbox and Discord webhooks.",
      es: "Casa de subastas, subastas con tiempo y pujas automáticas, pedidos de compra, un bazar con libro de órdenes, una tienda del servidor editada en el juego, /sell con lista de precios, varitas de venta y autoventa, e intercambios cara a cara seguros, con un índice de precios compartido, un solo buzón /collect y webhooks de Discord.",
    },
    version: "1.0.0",
    status: "beta",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/market/ExyliaMarketBanner.webp",
    tags: [
      { en: "Economy", es: "Economía" },
      { en: "Auctions", es: "Subastas" },
      { en: "Shop", es: "Tienda" },
      { en: "Folia", es: "Folia" },
    ],
    nav: MARKET_NAV,
  },
  {
    id: "exyliadisplays",
    name: "ExyliaDisplays",
    tagline: { en: "Holograms and NPCs, edited three ways", es: "Hologramas y NPCs, editados de tres formas" },
    summary: {
      en: "Packet holograms and NPCs with one click system: per-line size, motion and colour effects, items, blocks and heads, lines only some players see, pages each player reads alone, holograms that ride a player, NPCs with mirror skins and speech bubbles. Edited from screens, commands or the YAML files, which apply on save. Imports DecentHolograms, HolographicDisplays, FancyHolograms, Citizens and FancyNpcs. Free and open source.",
      es: "Hologramas y NPCs por paquetes con un mismo sistema de clics: tamaño, movimiento y efectos de color por línea, ítems, bloques y cabezas, líneas que solo ven algunos jugadores, páginas que cada jugador lee por su cuenta, hologramas que van encima de un jugador, NPCs con skin espejo y bocadillos. Se editan desde menús, comandos o los archivos YAML, que se aplican al guardar. Importa DecentHolograms, HolographicDisplays, FancyHolograms, Citizens y FancyNpcs. Gratis y de código abierto.",
    },
    version: "2.4.0",
    status: "stable",
    category: { en: "Utility", es: "Utilidad" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/displays/ExyliaDisplaysBanner.webp",
    download: "https://github.com/Exylia-Plugins/ExyliaDisplays/releases",
    tags: [
      { en: "Holograms", es: "Hologramas" },
      { en: "NPCs", es: "NPCs" },
      { en: "Imports", es: "Importaciones" },
      { en: "Folia", es: "Folia" },
    ],
    nav: DISPLAYS_NAV,
  },
  {
    id: "exyliaproxyutils",
    name: "ExyliaProxyUtils",
    tagline: { en: "The proxy half of ExyliaLib", es: "La mitad de ExyliaLib en el proxy" },
    summary: {
      en: "One jar for Velocity and BungeeCord that answers the backends over Redis: proxy commands from any Exylia plugin, cross-server teleports, network-wide lookups and kicks, punishments from LiteBans, LibertyBans, AdvancedBan or BanManager fed to ExyliaStaff, bans checked at login, and a jar that updates itself. Free.",
      es: "Un solo jar para Velocity y BungeeCord que responde a los backends por Redis: comandos en el proxy desde cualquier plugin de Exylia, teletransportes entre servidores, búsquedas y expulsiones en toda la red, sanciones de LiteBans, LibertyBans, AdvancedBan o BanManager enviadas a ExyliaStaff, baneos comprobados al entrar y un jar que se actualiza solo. Gratis.",
    },
    version: "2.0.2",
    status: "stable",
    category: { en: "Library", es: "Librería" },
    minecraft: "Velocity 3.4+ · BungeeCord",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/proxyutils/ExyliaProxyUtilsBanner.webp",
    download: "https://github.com/Exylia-Plugins/ExyliaProxyUtils/releases",
    tags: [
      { en: "Proxy", es: "Proxy" },
      { en: "Velocity", es: "Velocity" },
      { en: "BungeeCord", es: "BungeeCord" },
      { en: "Network", es: "Red" },
      { en: "Redis", es: "Redis" },
    ],
    nav: PROXYUTILS_NAV,
  },
  {
    id: "exyliaeconomy",
    name: "ExyliaEconomy",
    tagline: { en: "Server currencies, shared across a network", es: "Monedas del servidor, compartidas en toda la red" },
    summary: {
      en: "As many currencies as you want, kept in the database and edited in game, one published to Vault, payments with taxes and confirmations, banknotes a copy cannot redeem twice, interest, leaderboards, a ledger with rollback, and balances shared across every server. Free and open source.",
      es: "Tantas monedas como quieras, guardadas en la base de datos y editadas dentro del juego, una publicada en Vault, pagos con impuestos y confirmaciones, billetes que una copia no puede canjear dos veces, intereses, clasificaciones, un registro con reversión y saldos compartidos entre todos los servidores. Gratis y de código abierto.",
    },
    version: "1.1.0",
    status: "stable",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/economy/ExyliaEconomyBanner.webp",
    download: "https://github.com/Exylia-Plugins/ExyliaEconomy/releases",
    tags: [
      { en: "Economy", es: "Economía" },
      { en: "Vault", es: "Vault" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: ECONOMY_NAV,
  },
  {
    id: "exyliagraves",
    name: "ExyliaGraves",
    tagline: { en: "A grave where you died, collected exactly once", es: "Una tumba donde moriste, recogida una sola vez" },
    summary: {
      en: "A head where you fell holding exactly what you dropped, collected with one click, protected for the owner, with expiry and limits by rank, a /graves list across the network, paid teleports and staff restores — handed over exactly once on any server. Free and open source.",
      es: "Una cabeza donde caíste con exactamente lo que soltaste, recogida con un clic, protegida para el dueño, con caducidad y límites por rango, una lista /graves de toda la red, teletransportes de pago y restauraciones del staff — entregada una sola vez en cualquier servidor. Gratis y de código abierto.",
    },
    version: "1.0.0",
    status: "stable",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/graves/ExyliaGravesBanner.webp",
    download: "https://github.com/Exylia-Plugins/ExyliaGraves/releases",
    tags: [
      { en: "Graves", es: "Tumbas" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: GRAVES_NAV,
  },
  {
    id: "exyliaplayervaults",
    name: "ExyliaPlayerVaults",
    tagline: { en: "Personal vaults, open in one place at a time", es: "Baúles personales, abiertos en un solo sitio a la vez" },
    summary: {
      en: "Vaults per player kept in the database, their number and size set by rank, renamed, given icons, bought with any currency and searched by item, with staff browsing and history restores — open in exactly one window across the whole network. Free and open source.",
      es: "Baúles por jugador guardados en la base de datos, con cantidad y tamaño por rango, renombrables, con iconos, comprables con cualquier moneda y buscables por ítem, con navegación y restauración de historial para el staff — abiertos en una sola ventana en toda la red. Gratis y de código abierto.",
    },
    version: "1.0.0",
    status: "stable",
    category: { en: "Survival", es: "Survival" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/player-vaults/ExyliaPlayerVaultsBanner.webp",
    download: "https://github.com/Exylia-Plugins/ExyliaPlayerVaults/releases",
    tags: [
      { en: "Vaults", es: "Baúles" },
      { en: "Storage", es: "Almacenamiento" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: PLAYERVAULTS_NAV,
  },
  {
    id: "exyliasandbox",
    name: "ExyliaSandBox",
    tagline: {
      en: "Disposable PvP worlds, generated",
      es: "Mundos PvP desechables, generados",
    },
    summary: {
      en: "Generated PvP worlds with their own terrain presets and border, a random-teleport entry, a 1v1 queue that drops two players facing each other, kits players write themselves, a kit room, and teleport pads that send everybody standing on them at once.",
      es: "Mundos PvP generados con sus propios presets de terreno y su borde, entrada por teletransporte aleatorio, una cola 1v1 que suelta a dos jugadores mir\u00e1ndose, kits que escribe cada jugador, una sala de kits y plataformas que mandan a la vez a todo el que est\u00e9 encima.",
    },
    version: "1.2.0",
    status: "stable",
    category: { en: "PvP", es: "PvP" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/sandbox/ExyliaSandBoxBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-sandbox.123503/",
    tags: [
      { en: "PvP", es: "PvP" },
      { en: "Worlds", es: "Mundos" },
      { en: "Kits", es: "Kits" },
      { en: "Folia", es: "Folia" },
    ],
    nav: SANDBOX_NAV,
  },
  {
    id: "exylialib",
    name: "ExyliaLib",
    tagline: { en: "The library behind the ecosystem", es: "La librería que sostiene el ecosistema" },
    summary: {
      en: "Sixty-eight modules every Exylia plugin builds on: typed configuration with languages and a web editor, YAML menus, database, placeholders, sequences, holograms, NPCs, ragdolls and custom mobs drawn with display entities, regions, replays, rewards, economy and one scheduler for Spigot, Paper and Folia.",
      es: "Sesenta y ocho módulos sobre los que se apoya cada plugin de Exylia: configuración tipada con idiomas y un editor web, menús en YAML, base de datos, placeholders, secuencias, hologramas, NPCs, ragdolls y mobs personalizados dibujados con display entities, regiones, repeticiones, recompensas, economía y un solo scheduler para Spigot, Paper y Folia.",
    },
    version: "1.321.2",
    status: "stable",
    category: { en: "Library", es: "Librería" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/lib/ExyliaLibBanner.webp",
    tags: [
      { en: "Config", es: "Config" },
      { en: "Menus", es: "Menús" },
      { en: "Database", es: "Database" },
      { en: "Folia", es: "Folia" },
    ],
    nav: LIB_NAV,
  },
  {
    id: "exyliapracticebot",
    name: "ExyliaPracticeBot",
    tagline: { en: "A sparring partner that fights back", es: "Un rival de entrenamiento que responde" },
    summary: {
      en: "A PvP training bot each player spawns for themselves: seven combat models from sword to crystal, mace and boxing, five skill rungs that change reaction, aim and discipline, gear and buffs tuned from a menu, and a public API other plugins spawn it through.",
      es: "Un bot de entrenamiento de PvP que cada jugador genera para sí mismo: siete modelos de combate, de espada a crystal, mace y boxeo, cinco niveles de habilidad que cambian reacción, puntería y disciplina, equipo y buffs ajustables desde un menú, y una API pública desde la que otros plugins lo generan.",
    },
    version: "1.4.0",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21.9+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/bot/ExyliaPracticeBotBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-practicebot-crystal-mace-pvp.90881/",
    tags: [
      { en: "PvP", es: "PvP" },
      { en: "Training", es: "Entrenamiento" },
      { en: "Bots", es: "Bots" },
      { en: "Folia", es: "Folia" },
    ],
    nav: PRACTICEBOT_NAV,
  },
  {
    id: "exyliatotemtrainer",
    name: "ExyliaTotemTrainer",
    tagline: { en: "Totem training and best-of duels", es: "Entrenamiento de tótems y duelos al mejor de" },
    summary: {
      en: "Solo totem-pop drills at five tick speeds in six configurable modes, best-of duels against a chosen opponent, reactions graded PERFECT to SLOW, a leaderboard per mode, duel history and an admin surface that is only menus.",
      es: "Entrenamiento de pops de tótem en solitario a cinco velocidades en seis modos configurables, duelos al mejor de contra un rival elegido, reacciones calificadas de PERFECT a SLOW, una tabla por modo, historial de duelos y una administración que es solo menús.",
    },
    version: "1.2.0",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/totem-trainer/ExyliaTotemTrainerBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-totemtrainer.124009/",
    tags: [
      { en: "Totems", es: "Tótems" },
      { en: "Duels", es: "Duelos" },
      { en: "Leaderboards", es: "Tablas" },
      { en: "Folia", es: "Folia" },
    ],
    nav: TOTEMTRAINER_NAV,
  },
  {
    id: "exyliaaimtrainer",
    name: "ExyliaAimTrainer",
    tagline: { en: "Aim drills and best-of aim duels", es: "Ejercicios de puntería y duelos al mejor de" },
    summary: {
      en: "Packet targets every player sees alone: flick, reaction, tracking and combo drills tuned from the config, target size and distance chosen per player and weighed into a rating, best-of duels on the same target sequence, a board per drill plus an overall one, Java and Bedrock ranked apart, menus in five languages, and an admin surface that is only menus.",
      es: "Objetivos por paquetes que cada jugador ve solo: ejercicios de flick, reacción, tracking y combo ajustados desde la configuración, tamaño y distancia de objetivo elegidos por cada jugador y pesados en un rating, duelos al mejor de sobre la misma secuencia de objetivos, una tabla por ejercicio y otra general, Java y Bedrock clasificados por separado, menús en cinco idiomas, y una administración que es solo menús.",
    },
    version: "1.2.0",
    status: "stable",
    category: { en: "Gamemode", es: "Modo de juego" },
    minecraft: "1.21.4+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/aim-trainer/ExyliaAimTrainerBanner.webp",
    purchase: "https://builtbybit.com/resources/exyliaaimtrainer.126052/",
    tags: [
      { en: "Aim", es: "Puntería" },
      { en: "Duels", es: "Duelos" },
      { en: "Leaderboards", es: "Tablas" },
      { en: "Folia", es: "Folia" },
    ],
    nav: AIMTRAINER_NAV,
  },
  {
    id: "exyliastaff",
    name: "ExyliaStaff",
    tagline: { en: "Twenty-five moderation modules, one paper trail", es: "Veinticinco módulos de moderación, un solo rastro" },
    summary: {
      en: "Staff mode with a hotbar of tools, packet-level vanish with rank levels, freeze for screenshares, silent inventory mirrors for online and offline players, staff and network chat, reports and help requests with alerts on every server, replays of the last minute before a death, report or freeze, a punishment ladder enforced natively or through your ban plugin, with superior approval, an x-ray suspicion detector, inventory restore with item revocation, a staff log and audit, in five languages, and a link to Exylia Staff Web.",
      es: "Modo staff con una hotbar de herramientas, vanish a nivel de paquetes con niveles de rango, freeze para screenshares, espejos silenciosos de inventarios de jugadores conectados y desconectados, chat de staff y de red, reportes y peticiones de ayuda con alertas en todos los servidores, repeticiones del último minuto antes de una muerte, un reporte o un freeze, una escalera de sanciones aplicada de forma nativa o por tu plugin de baneos, con aprobación de un superior, un detector de sospecha de x-ray, restauración de inventarios con revocación de objetos, un registro y una auditoría del staff, en cinco idiomas, y un enlace con Exylia Staff Web.",
    },
    version: "1.6.0",
    status: "stable",
    category: { en: "Moderation", es: "Moderación" },
    minecraft: "1.21+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/staff/ExyliaStaffBanner.webp",
    purchase: "https://builtbybit.com/resources/exylia-staff.123500/",
    tags: [
      { en: "Staff mode", es: "Modo staff" },
      { en: "Vanish", es: "Vanish" },
      { en: "Reports", es: "Reportes" },
      { en: "Punishments", es: "Sanciones" },
      { en: "Network", es: "Red" },
      { en: "Folia", es: "Folia" },
    ],
    nav: STAFF_NAV,
  },
  {
    id: "exyliaanalytics",
    name: "ExyliaAnalytics",
    tagline: { en: "The agent behind Exylia Analytics", es: "El agente de Exylia Analytics" },
    summary: {
      en: "One jar for Paper, Spigot, Folia and Velocity that reports sessions, AFK, performance, punishments, votes, ranks, PlaceholderAPI values and the economy to the Exylia Analytics dashboard: linked with a code, configured from the web, with no open port.",
      es: "Un solo jar para Paper, Spigot, Folia y Velocity que envía sesiones, AFK, rendimiento, sanciones, votos, rangos, valores de PlaceholderAPI y la economía al panel de Exylia Analytics: se vincula con un código, se configura desde la web y no abre ningún puerto.",
    },
    version: "1.1.0",
    status: "beta",
    category: { en: "Analytics", es: "Analítica" },
    minecraft: "1.17+",
    banner: "https://s3.exylia.net/exylia-plugins/public/static/images/plugins/analytics/ExyliaAnalyticsBanner.webp",
    tags: [
      { en: "Dashboard", es: "Panel web" },
      { en: "Network", es: "Red" },
      { en: "Economy", es: "Economía" },
      { en: "Velocity", es: "Velocity" },
      { en: "Folia", es: "Folia" },
    ],
    nav: ANALYTICS_NAV,
  },
];

/**
 * The order the catalogue reads in — broadest first, the library last.
 *
 * Keyed by the English category so the grouping survives a translation, and
 * exhaustive on purpose: a category added to a plugin without a place here
 * lands at the end rather than disappearing.
 */
export const CATEGORY_ORDER = [
  "Gamemode",
  "Events",
  "Cosmetic",
  "Social",
  "Survival",
  "Moderation",
  "Analytics",
  "Utility",
  "Library",
] as const;

export type CategoryGroup = { key: string; label: Localized; plugins: Plugin[] };

/** The catalogue, split by category and ordered by `CATEGORY_ORDER`. */
export function groupByCategory(list: Plugin[] = plugins): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();
  for (const plugin of list) {
    const key = plugin.category.en;
    const group = groups.get(key) ?? { key, label: plugin.category, plugins: [] };
    group.plugins.push(plugin);
    groups.set(key, group);
  }
  const rank = (key: string) => {
    const i = CATEGORY_ORDER.indexOf(key as (typeof CATEGORY_ORDER)[number]);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  return [...groups.values()].sort((a, b) => rank(a.key) - rank(b.key));
}

/** How many pages a plugin publishes, across both languages' shared structure. */
export function pageCount(plugin: Plugin): number {
  return plugin.nav.reduce((n, group) => n + group.pages.length, 0);
}

export function getPlugin(id: string): Plugin | undefined {
  return plugins.find((p) => p.id === id);
}

/** The plugins whose documentation is published. */
export const documentedPlugins = plugins.filter((p) => p.nav.length > 0);

/** Narrows an arbitrary string to a supported language, or falls back. */
export function toLang(value: string | undefined): Lang {
  return LANGS.includes(value as Lang) ? (value as Lang) : DEFAULT_LANG;
}

/** The same page's slug in another language, for the language toggle. */
export function translateSlug(plugin: string, slug: string, from: Lang, to: Lang): string | null {
  const entry = getPlugin(plugin);
  if (!entry) return null;
  for (const group of entry.nav) {
    const match = group.pages.find((p) => p.slugs[from] === slug);
    if (match) return match.slugs[to];
  }
  return null;
}
