import type { Lang, Localized } from "./registry";

/**
 * Every string of the super-admin panel (/admin), in every language the docs ship. Kept apart from
 * `dictionary.ts` so the public pages never bundle it. `{name}` marks a value `fill` puts in.
 */
type Tree = { [key: string]: Localized | Tree };

export const adminDict = {
  eyebrow: { en: "Super admin", es: "Superadmin" },
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
