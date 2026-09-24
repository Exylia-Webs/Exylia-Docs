import type { Lang, Localized } from "./registry";

/**
 * Every string of chrome the site draws.
 *
 * Page content lives in MDX; this file is only what surrounds it — navigation,
 * labels, empty states. Keeping it in one place is what makes a missing
 * translation a type error rather than an English word on a Spanish page.
 */
export const dict = {
  nav: {
    plugins: { en: "Plugins", es: "Plugins" },
    ecosystem: { en: "Approach", es: "Ecosistema" },
    search: { en: "Search", es: "Buscar" },
    menu: { en: "Menu", es: "Menú" },
    docsSuffix: { en: "/ docs", es: "/ docs" },
    aiNotice: {
      en: "Content generated with AI — it may contain mistakes.",
      es: "Contenido generado con IA — puede contener errores.",
    },
  },
  search: {
    placeholder: { en: "Search the documentation…", es: "Buscar en la documentación…" },
    empty: { en: "Type to search", es: "Escribe para buscar" },
    noResults: { en: "No results for", es: "Sin resultados para" },
    navigate: { en: "navigate", es: "navegar" },
    open: { en: "open", es: "abrir" },
    pages: { en: "pages", es: "páginas" },
    close: { en: "close", es: "cerrar" },
  },
  docs: {
    onThisPage: { en: "On this page", es: "En esta página" },
    previous: { en: "Previous", es: "Anterior" },
    next: { en: "Next", es: "Siguiente" },
    documentation: { en: "Documentation", es: "Documentación" },
    index: { en: "Index", es: "Índice" },
    start: { en: "Get started", es: "Empezar" },
    buy: { en: "Get it on BuiltByBit", es: "Conseguirlo en BuiltByBit" },
    support: { en: "Support on Discord", es: "Soporte en Discord" },
    soon: { en: "soon", es: "pronto" },
    missing: { en: "Something missing on this page?", es: "¿Falta algo en esta página?" },
    missingLink: { en: "Tell us on Discord", es: "Dínoslo en Discord" },
    copy: { en: "Copy code", es: "Copiar código" },
    copyValue: { en: "Click to copy", es: "Clic para copiar" },
    copied: { en: "Copied", es: "Copiado" },
    facts: {
      version: { en: "Version", es: "Versión" },
      minecraft: { en: "Minecraft", es: "Minecraft" },
      category: { en: "Category", es: "Categoría" },
      pages: { en: "Pages", es: "Páginas" },
    },
  },
  ai: {
    kicker: { en: "AI", es: "IA" },
    title: { en: "Write your idea", es: "Escribe tu idea" },
    lead: {
      en: "The prompt around it is already written — the step language, the limits, and effects that ship. Copy it, paste it into your AI, and paste the answer into effects.yml.",
      es: "El prompt que la rodea ya está escrito — el lenguaje de pasos, los límites y efectos que ya vienen. Cópialo, pégalo en tu IA y pega la respuesta en effects.yml.",
    },
    placeholder: {
      en: "What it is made of, what moves and where, how long it lasts, and the mood. Name the blocks and items — the more you write, the closer it lands.",
      es: "De qué está hecho, qué se mueve y hacia dónde, cuánto dura y qué ambiente tiene. Nombra los bloques y los ítems — cuanto más escribas, más se acerca.",
    },
    hint: { en: "Write your idea to build the prompt", es: "Escribe tu idea para montar el prompt" },
    ready: { en: "Prompt ready", es: "Prompt listo" },
    copy: { en: "Copy prompt", es: "Copiar prompt" },
    copied: { en: "Copied", es: "Copiado" },
    lines: { en: "lines", es: "líneas" },
    show: { en: "Read it", es: "Leerlo" },
    hide: { en: "Hide", es: "Ocultar" },
  },
  landing: {
    kicker: { en: "Official documentation", es: "Documentación oficial" },
    line1: { en: "Every plugin,", es: "Cada plugin," },
    line2: { en: "explained the way", es: "explicado como" },
    line3: { en: "it was built", es: "fue construido" },
    lead: {
      en: "Installation guides, configuration reference, commands, permissions, placeholders and API. No filler: only what the plugin actually does.",
      es: "Guías de instalación, referencia de configuración, comandos, permisos, placeholders y API. Sin relleno: solo lo que el plugin hace de verdad.",
    },
    ctaPrimary: { en: "Browse the plugins", es: "Ver los plugins" },
    ctaSecondary: { en: "Buy on BuiltByBit", es: "Comprar en BuiltByBit" },
    statPlugins: { en: "Plugins", es: "Plugins" },
    statPages: { en: "Pages written", es: "Páginas escritas" },
    statLangs: { en: "Languages", es: "Idiomas" },
    scroll: { en: "Scroll", es: "Scroll" },
    catalogKicker: { en: "Catalogue", es: "Catálogo" },
    catalogTitle: { en: "All the plugins", es: "Todos los plugins" },
    catalogLead: {
      en: "Grouped by what each one is for, and filterable. Every plugin reads the same way: getting started, configuring, systems and reference.",
      es: "Agrupados por para qué sirve cada uno, y filtrables. Todos los plugins se leen igual: empezar, configurar, sistemas y referencia.",
    },
    filterAll: { en: "Everything", es: "Todo" },
    filterPlaceholder: { en: "Filter by name, tag or feature…", es: "Filtrar por nombre, etiqueta o función…" },
    filterEmpty: { en: "No plugin matches", es: "Ningún plugin coincide" },
    filterClear: { en: "Clear the filter", es: "Quitar el filtro" },
    resultsOne: { en: "plugin", es: "plugin" },
    resultsMany: { en: "plugins", es: "plugins" },
    buy: { en: "Buy", es: "Comprar" },
    docsPages: { en: "pages", es: "páginas" },
    statusStable: { en: "Documented", es: "Documentado" },
    statusBeta: { en: "In progress", es: "En progreso" },
    statusSoon: { en: "Coming soon", es: "Próximamente" },
    unpublished: { en: "unpublished", es: "sin publicar" },
    openPlugin: { en: "Open", es: "Abrir" },
    approachKicker: { en: "How it is written", es: "Cómo se escribe" },
    approachTitle1: { en: "Documenting", es: "Documentar" },
    approachTitle2: { en: "is part of the", es: "es parte del" },
    approachTitle3: { en: "product", es: "producto" },
    approachLead: {
      en: "A plugin nobody can configure is not finished. These pages are the manual we would want to find when buying software for our own server.",
      es: "Un plugin que nadie sabe configurar no está terminado. Estas páginas son el manual que nos gustaría encontrar al comprar software para nuestro propio servidor.",
    },
    principles: [
      {
        title: { en: "Written next to the code", es: "Escrita junto al código" },
        body: {
          en: "Every default, permission and placeholder comes from the plugin's actual source, not from a template.",
          es: "Cada valor por defecto, cada permiso y cada placeholder sale del código real del plugin, no de una plantilla.",
        },
      },
      {
        title: { en: "One structure, every plugin", es: "Una estructura, todos los plugins" },
        body: {
          en: "Getting started, configuring, systems and reference. Learn to read it once and it holds for the rest.",
          es: "Empezar, configurar, sistemas y referencia. Aprendes a leer una vez y sirve para el resto.",
        },
      },
      {
        title: { en: "Versioned with the release", es: "Versionada con el release" },
        body: {
          en: "When a key is renamed or migrated, the page says so and explains what the migration does.",
          es: "Cuando una clave cambia de nombre o migra, la página lo dice y explica qué hace la migración.",
        },
      },
      {
        title: { en: "Quick to read", es: "Rápida de leer" },
        body: {
          en: "Instant search, a side index, keyboard navigation and static pages served without blocking.",
          es: "Búsqueda instantánea, índice lateral, navegación con teclado y páginas estáticas servidas sin bloqueo.",
        },
      },
    ],
    ctaTitle: { en: "Still not clear?", es: "¿Algo no queda claro?" },
    ctaLead: {
      en: "Support runs on Discord, next to the team that writes these plugins. Licences are handled there too.",
      es: "El soporte se atiende en Discord, junto al equipo que escribe estos plugins. Las licencias también se gestionan ahí.",
    },
    ctaButton: { en: "Join the Discord", es: "Entrar al Discord" },
    ctaSecondaryLink: { en: "See every resource", es: "Ver todos los recursos" },
  },
  categories: {
    /** The catalogue's own wording for what each family of plugins is for. */
    Gamemode: {
      en: "Full game modes: a server built around one plugin.",
      es: "Modos de juego completos: un servidor montado sobre un plugin.",
    },
    Events: {
      en: "Scheduled events and minigames that run on top of any server.",
      es: "Eventos programados y minijuegos que funcionan sobre cualquier servidor.",
    },
    Cosmetic: {
      en: "What players see: effects, skins, trims and shields.",
      es: "Lo que ven los jugadores: efectos, skins, trims y escudos.",
    },
    Social: {
      en: "Chat, groups, territory and everything played between players.",
      es: "Chat, grupos, territorio y todo lo que se juega entre jugadores.",
    },
    Survival: {
      en: "The survival toolkit, module by module.",
      es: "El kit de survival, módulo a módulo.",
    },
    Moderation: {
      en: "Tools for the team that keeps the server clean.",
      es: "Herramientas para el equipo que mantiene el servidor limpio.",
    },
    Analytics: {
      en: "Measuring the server: players, performance and the economy.",
      es: "Medir el servidor: jugadores, rendimiento y economía.",
    },
    Library: {
      en: "The foundation the rest is written on.",
      es: "La base sobre la que está escrito el resto.",
    },
  } as Record<string, Localized>,
  footer: {
    blurb: {
      en: "Official documentation for Exylia's plugin ecosystem. Written next to the code, versioned with every release.",
      es: "Documentación oficial del ecosistema de plugins de Exylia. Escrita junto al código, versionada con cada release.",
    },
    docs: { en: "Documentation", es: "Documentación" },
    allPlugins: { en: "All plugins", es: "Todos los plugins" },
    store: { en: "BuiltByBit", es: "BuiltByBit" },
    exylia: { en: "Exylia", es: "Exylia" },
    madeWith: { en: "Made with care, not in a hurry", es: "Hecho con cuidado, no con prisa" },
  },
  notFound: {
    kicker: { en: "Error 404", es: "Error 404" },
    title: { en: "This page does not exist", es: "Esta página no existe" },
    body: {
      en: "The documentation may have moved, or may not be published yet.",
      es: "Puede que la documentación se haya movido, o que aún no esté publicada.",
    },
    back: { en: "Back to the start", es: "Volver al inicio" },
  },
  redirect: {
    detecting: { en: "Detecting your language…", es: "Detectando tu idioma…" },
    manual: { en: "Continue in English", es: "Continuar en español" },
  },
} as const;

/** Reads one entry of the dictionary in a language. */
export function t(entry: Localized, lang: Lang): string {
  return entry[lang];
}
