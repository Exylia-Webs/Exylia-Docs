import type { Lang } from "@/content/registry";

/** Landing copy that is not already in the dictionary. Every line describes something the site does today. */
export const COPY = {
  en: {
    skip: "Skip to the content",
    chapters: ["Read", "Plugins", "Structure", "Tools", "Start"],
    searchHint: "Search",
    plugins: {
      lines: ["Every plugin,", "*by use*."],
      lead: "Grouped by what each one is for, and filterable. Point at one and *its shelf* lights up.",
    },
    structure: {
      lines: ["Read one,", "*know* them all."],
      lead: "Every plugin is split the same *four ways*. Once you know where things live in one, you know it for all of them.",
    },
    tools: {
      lines: ["Find it", "in *seconds*."],
      lead: "Written next to the code and *versioned with every release*. These are the tools on every page.",
      items: [
        ["Search that answers", "Every heading of every page, instant, from any page with ⌘K."],
        ["Ask the assistant", "It has read these docs, and it links the page it answers from."],
        ["English and Spanish", "Every page, both languages, same structure. Switch without losing your place."],
        ["Copy in one click", "Commands, permissions and config blocks copy in one click."],
        ["Config explorer", "The whole config file on one side, the explanation of each key on the other."],
        ["Tables you can filter", "Long tables of commands, permissions and placeholders get a filter, and every value copies with a click."],
        ["Ready for AI", "Each plugin has an llms.txt with its whole docs, plus a prompt you can paste into your assistant."],
        ["Plain pages", "Installation, configuration, commands, permissions, placeholders and API. No filler."],
      ],
      categories: "Categories",
    },
    start: {
      lines: ["Pick a plugin", "and *start*."],
      lead: "Start at *Getting started*: ten minutes from the jar to a working mode. If something is missing, the team is on Discord.",
      browse: ["Browse the plugins", "All of them, grouped by use"],
      search: ["Search the docs", "Every heading, with ⌘K"],
    },
    pages: "pages",
    free: "Free",
  },
  es: {
    skip: "Saltar al contenido",
    chapters: ["Leer", "Plugins", "Estructura", "Herramientas", "Empezar"],
    searchHint: "Buscar",
    plugins: {
      lines: ["Cada plugin,", "*por uso*."],
      lead: "Agrupados por para qué sirve cada uno, y filtrables. Pasa sobre uno y *su estante* se enciende.",
    },
    structure: {
      lines: ["Lees uno,", "*conoces* todos."],
      lead: "Todos los plugins se dividen en las mismas *cuatro partes*. Cuando sabes dónde está cada cosa en uno, lo sabes en todos.",
    },
    tools: {
      lines: ["Encuéntralo", "en *segundos*."],
      lead: "Escrita junto al código y *versionada con cada release*. Estas son las herramientas de cada página.",
      items: [
        ["Una búsqueda que responde", "Cada título de cada página, al instante, desde cualquier página con ⌘K."],
        ["Pregúntale al asistente", "Se ha leído esta documentación y enlaza la página de donde saca la respuesta."],
        ["Español e inglés", "Cada página en los dos idiomas, con la misma estructura. Cambia sin perder dónde estabas."],
        ["Copiar con un clic", "Comandos, permisos y bloques de configuración se copian con un clic."],
        ["Explorador de configuración", "El archivo de configuración entero a un lado y la explicación de cada clave al otro."],
        ["Tablas que se filtran", "Las tablas largas de comandos, permisos y placeholders se filtran, y cada valor se copia con un clic."],
        ["Lista para la IA", "Cada plugin tiene un llms.txt con toda su documentación y un prompt para pegar en tu asistente."],
        ["Páginas sin relleno", "Instalación, configuración, comandos, permisos, placeholders y API. Solo lo que hace el plugin."],
      ],
      categories: "Categorías",
    },
    start: {
      lines: ["Elige un plugin", "y *empieza*."],
      lead: "Empieza por *Empezar*: diez minutos del jar a un modo funcionando. Si falta algo, el equipo está en Discord.",
      browse: ["Ver los plugins", "Todos, agrupados por uso"],
      search: ["Buscar en la documentación", "Cada título, con ⌘K"],
    },
    pages: "páginas",
    free: "Gratis",
  },
} satisfies Record<Lang, unknown>;
