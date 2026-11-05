# Exylia Docs

Documentación de los plugins de Exylia. Next.js con todas las páginas prerenderizadas en el build,
servidas por `next start`, que además atiende el asistente de IA en `/api/assistant/`. PostgreSQL
(Prisma) guarda el consumo del asistente.

Contenido en `content/<plugin>/<idioma>/*.mdx`, disponible en inglés y español.

## Desarrollo

```bash
pnpm install
pnpm db:migrate   # con DATABASE_URL en .env
pnpm dev
pnpm test   # node:test: búsqueda, read_page, límites, configuración
```

http://localhost:3010

## Producción

```bash
docker compose up -d --build   # necesita NPMRC (la línea del token de GitHub Packages) en el entorno
```

La imagen escucha en el puerto 80 como usuario `node` (no root), igual que el nginx de antes, y el
compose lo publica en el 3010. Healthcheck: `GET /robots.txt`. Al arrancar corre
`prisma migrate deploy` (necesita `DATABASE_URL`) y luego `next start`.

En Coolify: el mismo puerto (80), `DATABASE_URL` y las variables de ejecución de abajo. El
almacenamiento en `/app/data` solo hace falta hasta el primer arranque con base de datos: el contador
del mes que guardaba allí (`assistant-usage.json`) se importa una vez.

## Asistente de IA

Un chat de solo lectura en las páginas de documentación: busca en el contenido, lee páginas y
responde citando enlaces. Se configura solo por entorno (ver `.env.example`); se leen al arrancar,
sin rebuild.

| Variable | |
|---|---|
| `AI_MODEL` | Vacío: asistente apagado (`/api/assistant/` da 404 y no se dibuja el botón). |
| `AI_PROVIDER` | `openai` (por defecto), `ollama`, `openrouter` o `anthropic`. |
| `AI_BASE_URL` | Vacío: el endpoint por defecto del proveedor. |
| `AI_API_KEY` | Obligatoria salvo con `ollama`. Nunca llega al navegador; se redacta de los errores. |
| `AI_MAX_TOKENS` | Tokens de salida por llamada, 64-64000. Por defecto 1024. |
| `AI_TIMEOUT_SECONDS` | Por llamada, 1-600. Por defecto 60. |
| `AI_MONTHLY_TOKENS` | Tope global (entrada + salida, todos los visitantes) por mes UTC. Por defecto 2 000 000. |
| `AI_DATA_DIR` | Dónde estaba el contador del mes antes de la base de datos (se importa una vez). La imagen usa `/app/data`. |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Las dos o ninguna: Cloudflare Turnstile antes de preguntar. |

Una configuración inválida apaga el asistente y deja el motivo en el log.

Protección: tope mensual global (en la tabla `AssistantUsage`, con incrementos atómicos, correcto con
varias instancias y reinicios), 10 preguntas por minuto y 50 por día
por IP (la IP real tras Traefik/Cloudflare), solo `POST` del mismo origen con `application/json`,
cuerpo de 512 KB como máximo, historial y mensajes recortados por el núcleo de `@exylia-webs/ui`, y
con Turnstile un pase firmado de una hora por IP. Los límites por IP viven en memoria: un reinicio
los olvida y con varias réplicas cada una tendría los suyos.

## Panel de superadmin

`/admin/`: acceso con Discord (OAuth2 con state y PKCE) solo para los ids de `SUPER_ADMIN_DISCORD_IDS`,
comprobados en cada petición. La sesión vive en la tabla `AdminSession` (solo el SHA-256 del token,
cookie `__Host-` sobre https). Las páginas públicas y el asistente no leen nada de esto.

| Variable | |
|---|---|
| `PUBLIC_URL` | La dirección del sitio; vacío: `https://docs.exylia.net`. En desarrollo `http://localhost:3010`. |
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` | La aplicación de Discord; su redirect OAuth2 es `<PUBLIC_URL>/api/admin/auth/callback/`. |
| `SUPER_ADMIN_DISCORD_IDS` | Ids de Discord separados por comas; vacío no deja entrar a nadie. |

El panel usa el sistema de diseño (`@exylia-webs/ui`, Tailwind 4, `src/app/admin/admin.css`) y
next-intl solo para los textos propios del sistema; los del panel están en `src/content/admin.ts`.
El sitio público sigue en Tailwind 3: `scripts/postcss-tailwind.cjs` manda cada hoja a su versión.
