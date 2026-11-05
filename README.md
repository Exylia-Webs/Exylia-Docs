# Exylia Docs

Documentación de los plugins de Exylia. Next.js con todas las páginas prerenderizadas en el build,
servidas por el servidor Node de Next (`output: "standalone"`), que además atiende el asistente de IA
en `/api/assistant/`.

Contenido en `content/<plugin>/<idioma>/*.mdx`, disponible en inglés y español.

## Desarrollo

```bash
pnpm install
pnpm dev
pnpm test   # node:test: búsqueda, read_page, límites, configuración
```

http://localhost:3010

## Producción

```bash
docker compose up -d --build   # necesita NPMRC (la línea del token de GitHub Packages) en el entorno
```

La imagen escucha en el puerto 80 como usuario `node` (no root), igual que el nginx de antes, y el
compose lo publica en el 3010. Healthcheck: `GET /robots.txt`. Sin `.env` el asistente está apagado y
el sitio funciona igual.

En Coolify: el mismo puerto (80). Añadir un almacenamiento persistente montado en `/app/data`
(guarda el contador mensual de tokens del asistente) y las variables de ejecución de abajo.

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
| `AI_DATA_DIR` | Dónde se guarda el contador del mes. La imagen usa `/app/data`. |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Las dos o ninguna: Cloudflare Turnstile antes de preguntar. |

Una configuración inválida apaga el asistente y deja el motivo en el log.

Protección: tope mensual global (persistido en `AI_DATA_DIR`), 10 preguntas por minuto y 50 por día
por IP (la IP real tras Traefik/Cloudflare), solo `POST` del mismo origen con `application/json`,
cuerpo de 512 KB como máximo, historial y mensajes recortados por el núcleo de `@exylia-webs/ui`, y
con Turnstile un pase firmado de una hora por IP. Los límites por IP viven en memoria: un reinicio
los olvida y con varias réplicas cada una tendría los suyos.
