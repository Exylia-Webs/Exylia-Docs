# syntax=docker/dockerfile:1
# --- build ------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

# Dependencies first, so a content-only change reuses this layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# The registry token for @exylia-webs/ui is a build secret (an .npmrc line), mounted only for this
# step so it never lands in a layer. Its id is NPMRC because Coolify passes each build-time
# variable as a secret under its own name ("Use Docker Build Secrets").
RUN --mount=type=secret,id=NPMRC,target=/root/.npmrc --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY . .
RUN --mount=type=cache,id=docs-next,target=/app/.next/cache,sharing=locked pnpm run build

# --- serve ------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=6 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
