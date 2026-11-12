import type { Lang, Localized } from "./registry";

/**
 * Every string of the super-admin panel (/admin), in every language the docs ship. Kept apart from
 * `dictionary.ts` so the public pages never bundle it. `{name}` marks a value `fill` puts in.
 */
type Tree = { [key: string]: Localized | Tree };

export const adminDict = {
  back: { en: "Back to the app", es: "Volver a la app" },
  overview: {
    meta: { en: "Admin · Overview", es: "Admin · Resumen" },
    title: { en: "Overview", es: "Resumen" },
    description: { en: "The docs assistant in {month} (UTC), every visitor together.", es: "El asistente de la documentación en {month} (UTC), todos los visitantes juntos." },
    calls: { en: "Assistant calls", es: "Llamadas al asistente" },
    tokens: { en: "Tokens this month", es: "Tokens este mes" },
    hits: { en: "Quota hits", es: "Límites alcanzados" },
    cap: { en: "Monthly cap", es: "Tope mensual" },
    alerts: {
      spent: { en: "The monthly cap is spent: the assistant refuses every question until next month", es: "El tope mensual está gastado: el asistente rechaza todas las preguntas hasta el mes que viene" },
      quota: { en: "Questions refused by the monthly cap this month", es: "Preguntas rechazadas por el tope mensual este mes" },
      aiOff: { en: "The assistant is switched off", es: "El asistente está apagado" },
      aiIncomplete: { en: "The assistant is on but has no model", es: "El asistente está activo pero sin modelo" },
    },
  },
  usage: {
    meta: { en: "Admin · AI usage", es: "Admin · Uso de IA" },
    title: { en: "AI usage", es: "Uso de IA" },
    description: { en: "The assistant's use each day of {month} (UTC), newest first, against the monthly cap.", es: "El uso del asistente cada día de {month} (UTC), del más reciente al más antiguo, frente al tope mensual." },
    day: { en: "Day", es: "Día" },
    tokens: { en: "Tokens", es: "Tokens" },
    sofar: { en: "Month so far / cap", es: "Mes hasta ese día / tope" },
    calls: { en: "Calls", es: "Llamadas" },
    hits: { en: "Quota hits", es: "Límites alcanzados" },
    imported: { en: "Includes {tokens} tokens counted before the database (no day of their own).", es: "Incluye {tokens} tokens contados antes de la base de datos (sin día propio)." },
    emptyTitle: { en: "No usage this month", es: "Sin uso este mes" },
    emptyDescription: { en: "Nobody has asked the assistant anything yet this month.", es: "Nadie ha preguntado nada al asistente este mes." },
  },
  audit: {
    meta: { en: "Admin · Audit log", es: "Admin · Auditoría" },
    title: { en: "Audit log", es: "Auditoría" },
    description: { en: "Every change made from this panel, with who made it.", es: "Cada cambio hecho desde este panel, con quién lo hizo." },
  },
  auditList: {
    actions: {
      "settings.ai": { en: "Changed the AI settings", es: "Cambió los ajustes de IA" },
    },
    targets: {
      ai: { en: "AI", es: "IA" },
    },
  },
  settings: {
    title: { en: "Platform settings", es: "Ajustes de la plataforma" },
    eyebrow: { en: "Super admin", es: "Superadmin" },
    description: {
      en: "Settings for the docs, stored in the database: changes apply within seconds, with no environment edit and no restart.",
      es: "Ajustes de la documentación, guardados en la base de datos: los cambios se aplican en segundos, sin editar el entorno ni reiniciar.",
    },
    meta: { en: "Admin · Settings", es: "Admin · Ajustes" },
    saved: { en: "Saved. It applies within a few seconds.", es: "Guardado. Se aplica en unos segundos." },
    errors: {
      invalid: { en: "Check the field “{field}”: its value is not allowed.", es: "Revisa el campo “{field}”: su valor no está permitido." },
      noMasterKey: {
        en: "SECRET_KEY is missing (or shorter than 32 characters), so an API key cannot be stored encrypted.",
        es: "Falta SECRET_KEY (o tiene menos de 32 caracteres), así que no se puede guardar una API key cifrada.",
      },
    },
    lastChanged: { en: "Last changed", es: "Último cambio" },
    lastChangedValue: { en: "{ago} by {name}", es: "{ago} por {name}" },
    neverChanged: { en: "Never (from the environment)", es: "Nunca (desde el entorno)" },
    unknownEditor: { en: "an admin", es: "un admin" },
    nav: {
      ai: { en: "AI", es: "IA" },
    },
    ai: {
      title: { en: "AI provider", es: "Proveedor de IA" },
      hint: { en: "The model behind the docs assistant", es: "El modelo detrás del asistente de la documentación" },
      enabled: { en: "Assistant switched on", es: "Asistente activado" },
      enabledHint: { en: "Off: no assistant button on the docs, and its route answers 404.", es: "Apagado: la documentación no muestra el botón del asistente y su ruta responde 404." },
      status: {
        on: { en: "On · {model}", es: "Activo · {model}" },
        off: { en: "Off", es: "Apagado" },
        incomplete: { en: "On, but no model set", es: "Activo, pero sin modelo" },
      },
      provider: { en: "Provider", es: "Proveedor" },
      providerHint: {
        en: "OpenAI-compatible covers OpenAI, Groq, LM Studio, vLLM and most self-hosted servers.",
        es: "Compatible con OpenAI cubre OpenAI, Groq, LM Studio, vLLM y la mayoría de servidores propios.",
      },
      providers: {
        openai: { en: "OpenAI-compatible", es: "Compatible con OpenAI" },
        ollama: { en: "Ollama (self-hosted)", es: "Ollama (propio)" },
        openrouter: { en: "OpenRouter", es: "OpenRouter" },
        anthropic: { en: "Anthropic", es: "Anthropic" },
      },
      model: { en: "Model", es: "Modelo" },
      modelHint: {
        en: "Exactly as the provider names it. Without tool calling the assistant answers from the docs' summary only.",
        es: "Tal como lo nombra el proveedor. Sin llamadas a herramientas el asistente solo responde desde el resumen de la documentación.",
      },
      apiKey: { en: "API key", es: "API key" },
      apiKeyHint: { en: "Stored encrypted. Not needed for Ollama.", es: "Se guarda cifrada. No hace falta para Ollama." },
      apiKeySaved: { en: "A key is saved. Leave empty to keep it, or type a new one.", es: "Hay una key guardada. Déjalo vacío para conservarla o escribe una nueva." },
      clearKey: { en: "Delete the saved key", es: "Borrar la key guardada" },
      baseUrl: { en: "Base URL", es: "URL base" },
      baseUrlHint: { en: "Empty uses the provider's own. Defaults: {defaults}", es: "Vacío usa la del proveedor. Por defecto: {defaults}" },
      baseUrlPlaceholder: { en: "Empty: the provider's default URL", es: "Vacío: la URL por defecto del proveedor" },
      test: {
        button: { en: "Test the connection", es: "Probar conexión" },
        hint: { en: "Uses the saved settings, switched on or not.", es: "Usa los ajustes guardados, esté activado o no." },
        ok: { en: "The model answered in {ms} ms: {answer}", es: "El modelo respondió en {ms} ms: {answer}" },
        empty: { en: "The provider answered in {ms} ms, but with no text.", es: "El proveedor respondió en {ms} ms, pero sin texto." },
        failed: { en: "It did not work: {reason}", es: "No funcionó: {reason}" },
        noModel: { en: "Save a model first.", es: "Guarda un modelo primero." },
      },
    },
    answers: {
      title: { en: "Answers", es: "Respuestas" },
      hint: { en: "Length and patience of each call, how much every visitor together may spend a month, and the bot check", es: "Longitud y paciencia de cada llamada, cuánto pueden gastar todos los visitantes juntos al mes y la verificación anti-bots" },
      maxTokens: { en: "Max tokens", es: "Tokens máximos" },
      maxTokensHint: { en: "Length limit of one answer.", es: "Límite de longitud de una respuesta." },
      timeout: { en: "Timeout", es: "Tiempo límite" },
      timeoutHint: { en: "Per model call. Small self-hosted models may need 120 s or more.", es: "Por llamada al modelo. Los modelos propios pequeños pueden necesitar 120 s o más." },
      monthlyTokens: { en: "Monthly tokens, every visitor", es: "Tokens al mes, todos los visitantes" },
      monthlyTokensHint: {
        en: "Tokens in and out every visitor together may spend a calendar month (UTC). 0 keeps the button but refuses every question.",
        es: "Tokens de entrada y salida que todos los visitantes juntos pueden gastar en un mes natural (UTC). 0 deja el botón pero rechaza todas las preguntas.",
      },
      turnstile: { en: "Cloudflare Turnstile", es: "Cloudflare Turnstile" },
      turnstileHint: {
        en: "A visitor solves a challenge before asking; one pass lasts an hour per address. The keys stay in TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY.",
        es: "El visitante resuelve un desafío antes de preguntar; un pase dura una hora por dirección. Las claves siguen en TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY.",
      },
      turnstileNoKeys: { en: "Set both TURNSTILE_* keys on the server to switch it on.", es: "Pon las dos claves TURNSTILE_* en el servidor para activarlo." },
      tokens: { en: "tokens", es: "tokens" },
    },
  },
  login: {
    meta: { en: "Admin sign in", es: "Acceso de administración" },
    eyebrow: { en: "Super admin", es: "Superadmin" },
    title: { en: "Sign in to the admin panel", es: "Entra al panel de administración" },
    description: {
      en: "Only Exylia's super admins can open it. The documentation and its assistant keep working without signing in.",
      es: "Solo los superadmins de Exylia pueden abrirlo. La documentación y su asistente siguen funcionando sin iniciar sesión.",
    },
    discord: { en: "Continue with Discord", es: "Continuar con Discord" },
    errors: {
      denied: { en: "This Discord account has no access to the admin panel.", es: "Esta cuenta de Discord no tiene acceso al panel de administración." },
      cancelled: { en: "Sign in was cancelled.", es: "Se canceló el inicio de sesión." },
      unconfigured: { en: "Discord login is not configured on this server.", es: "El acceso con Discord no está configurado en este servidor." },
      failed: { en: "Sign in failed. Try again.", es: "No se pudo iniciar sesión. Inténtalo de nuevo." },
    },
  },
} satisfies Tree;

type Strings<T> = { [K in keyof T]: T[K] extends Localized ? string : Strings<T[K]> };

const isLocalized = (node: Localized | Tree): node is Localized => typeof node.en === "string";

/** The dictionary in one language. */
export function adminStrings<T extends Tree>(tree: T, lang: Lang): Strings<T> {
  return Object.fromEntries(Object.entries(tree).map(([key, node]) => [key, isLocalized(node) ? node[lang] : adminStrings(node, lang)])) as Strings<T>;
}

/** `text` with each `{name}` replaced by its value. */
export const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
