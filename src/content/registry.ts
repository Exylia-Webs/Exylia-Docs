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
      page("overlays", "overlays", "overlays"),
      page("chat", "chat", "chat"),
      page("cosmetics", "cosmetics", "cosmeticos"),
    ],
  },
  {
    label: { en: "Gameplay", es: "Juego" },
    pages: [
      page("effects", "effects", "efectos"),
      page("sequences", "sequences", "secuencias"),
      page("displays", "displays-and-npcs", "displays-y-npcs"),
      page("display", "display", "pantalla"),
      page("schedules", "schedules", "horarios"),
      page("world", "world", "mundo"),
      page("players", "players", "jugadores"),
      page("rewards", "rewards", "recompensas"),
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("api", "api", "api"),
      page("modules", "modules", "modulos"),
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
    ],
  },
  {
    label: { en: "Reference", es: "Referencia" },
    pages: [
      page("commands", "commands", "comandos"),
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
      page("recruitment", "recruitment", "reclutamiento"),
      page("chat-and-mail", "chat-and-mail", "chat-y-correo"),
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
      page("progression", "progression", "progresion"),
      page("kits-and-crates", "kits-and-crates", "kits-y-cajas"),
      page("zones", "zones", "zonas"),
      page("restrictions", "restrictions", "restricciones"),
      page("quality-of-life", "quality-of-life", "utilidades"),
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
      page("reveal", "reveal", "revelar"),
      page("afk", "afk", "afk"),
      page("action-bar", "action-bar", "barra-de-accion"),
      page("staff-log", "staff-log", "registro-staff"),
      page("staff-admin", "staff-admin", "panel-admin"),
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
    version: "1.1.0",
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
    version: "1.0.9",
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
      en: "Zone-capture events, seven mechanics",
      es: "Eventos de captura de zona, siete mecánicas",
    },
    summary: {
      en: "KOTH, point-scored KOTH, Conquest, Payload and Destroy The Core, all created from in-game menus with a shared zone wand, schedules, rewards and clan support.",
      es: "KOTH, KOTH por puntos, Conquest, Payload y Destroy The Core, todos creados desde menús in-game con selector de zona, horarios, recompensas y soporte de clanes.",
    },
    version: "1.0.4",
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
      en: "100 kill effects across five categories, each one a body choreographed joint by joint among real items and blocks, often with the killer and the crowd acting it out: chosen from a menu, won out of a crate or bound to a weapon with a token, and written as sequences a server owner can edit.",
      es: "100 efectos de muerte en cinco categorías, cada uno un cuerpo coreografiado articulación a articulación entre objetos y bloques reales, muchas veces con el asesino y el público actuándolo: elegidos desde un menú, ganados en una caja o atados a un arma con una ficha, y escritos como secuencias que el dueño puede editar.",
    },
    version: "1.4.0",
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
      en: "90 hit effects across six categories, played on the body of whoever was struck and written to a budget of six tenths of a second: chosen from a menu or bound to a weapon with a token.",
      es: "90 efectos de golpe en seis categorías, lanzados sobre el cuerpo de quien recibe el impacto y escritos con un presupuesto de seis décimas de segundo: elegidos desde un menú o atados a un arma con una ficha.",
    },
    version: "1.1.0",
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
    id: "exyliaarmortrims",
    name: "ExyliaArmorTrims",
    tagline: { en: "Armour trims drawn with packets", es: "Trims de armadura dibujados con paquetes" },
    summary: {
      en: "Eighteen named presets plus any pattern and material combined by hand, chosen on one screen or carried as a trim item, and drawn on the way to the client so the armour itself is never converted.",
      es: "Dieciocho presets con nombre más cualquier combinación de patrón y material hecha a mano, elegidos en una sola pantalla o llevados como objeto, y dibujados en el camino al cliente para que la armadura nunca se convierta.",
    },
    version: "1.1.0",
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
      en: "Twenty animated colour-and-trim skins worn over any armour piece, chosen from a wardrobe or carried as an item, and drawn on the way to the client with packets: enchantments, attributes, durability and plugin data stay exactly as they were.",
      es: "Veinte skins animadas de color y trim que se llevan sobre cualquier pieza de armadura, elegidas en un vestidor o llevadas como objeto, y dibujadas en el camino al cliente con paquetes: encantamientos, atributos, durabilidad y datos de otros plugins quedan intactos.",
    },
    version: "1.0.0",
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
    version: "1.2.0",
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
      en: "41 patterns and 16 colours layered into custom shield designs, saved in numbered slots, sold by permission and shareable through a community library.",
      es: "41 patrones y 16 colores en capas para diseñar escudos, guardados en ranuras numeradas, vendidos por permiso y compartibles en una biblioteca comunitaria.",
    },
    version: "1.0.3",
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
    version: "1.0.0",
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
    version: "1.1.0",
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
    tagline: { en: "Forty-nine minigames in one plugin", es: "Cuarenta y nueve minijuegos en un plugin" },
    summary: {
      en: "TNT Tag, Spleef, OITC, CS:GO, Capture the Flag, Murder Mystery, Zombie Horde and forty more, each with its own arena, settings, kits, rewards and scoreboard, run from in-game menus \u2014 and gauntlets that chain them into one series.",
      es: "TNT Tag, Spleef, OITC, CS:GO, Capture the Flag, Murder Mystery, Zombie Horde y cuarenta m\u00e1s, cada uno con su arena, ajustes, kits, recompensas y scoreboard, todo desde men\u00fas in-game \u2014 m\u00e1s gauntlets que los encadenan en una serie.",
    },
    version: "1.4.0",
    status: "stable",
    category: { en: "Events", es: "Eventos" },
    minecraft: "1.21+",
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
      en: "Thirty survival modules in one plugin",
      es: "Treinta módulos de survival en un solo plugin",
    },
    summary: {
      en: "Homes, warps, TPA, RTP, kits, mines, bounties, loot chests, power-ups, rankup, farming milestones and regenerating zones, each one a module that registers nothing at all when it is turned off.",
      es: "Homes, warps, TPA, RTP, kits, minas, recompensas por cabeza, cofres de loot, power-ups, rankup, hitos de farmeo y zonas que se regeneran, cada uno un módulo que no registra absolutamente nada cuando está apagado.",
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
    version: "1.0.3",
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
      en: "Forty-six modules every Exylia plugin builds on: typed configuration with migrations, YAML menus, database, placeholders, sequences drawn with display entities, overlays, timetables, regions, rewards and one scheduler for Spigot, Paper and Folia.",
      es: "Cuarenta y seis módulos sobre los que se apoya cada plugin de Exylia: configuración tipada con migraciones, menús en YAML, base de datos, placeholders, secuencias dibujadas con display entities, overlays, horarios, regiones, recompensas y un solo scheduler para Spigot, Paper y Folia.",
    },
    version: "1.95.0",
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
    version: "1.2.2",
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
    version: "1.0.0",
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
    id: "exyliastaff",
    name: "ExyliaStaff",
    tagline: { en: "Twenty moderation modules, one paper trail", es: "Veinte módulos de moderación, un solo rastro" },
    summary: {
      en: "Staff mode with a hotbar of tools, packet-level vanish with rank levels, freeze for screenshares, silent inventory mirrors, staff and network chat, reports and help requests with alerts on every server, a punishment ladder run through your ban plugin, an x-ray suspicion detector, inventory restore with a queue for players who are offline, a staff log and an admin panel that audits the team.",
      es: "Modo staff con una hotbar de herramientas, vanish a nivel de paquetes con niveles de rango, freeze para screenshares, espejos silenciosos de inventarios, chat de staff y de red, reportes y peticiones de ayuda con alertas en todos los servidores, una escalera de sanciones ejecutada por tu plugin de baneos, un detector de sospecha de x-ray, restauración de inventarios con cola para jugadores desconectados, un registro del staff y un panel de administración que audita al equipo.",
    },
    version: "1.3.1",
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
  {
    id: "exyliaaimtrainer",
    name: "ExyliaAimTrainer",
    tagline: { en: "Aim drills and best-of aim duels", es: "Ejercicios de puntería y duelos al mejor de" },
    summary: {
      en: "Packet targets every player sees alone: flick, reaction, tracking and combo drills tuned from the config, target size and distance chosen per player and weighed into a rating, best-of duels on the same target sequence, a board per drill plus an overall one, and an admin surface that is only menus.",
      es: "Objetivos por paquetes que cada jugador ve solo: ejercicios de flick, reacción, tracking y combo ajustados desde la configuración, tamaño y distancia de objetivo elegidos por cada jugador y pesados en un rating, duelos al mejor de sobre la misma secuencia de objetivos, una tabla por ejercicio y otra general, y una administración que es solo menús.",
    },
    version: "1.0.0",
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
    nav: STAFF_NAV,
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
