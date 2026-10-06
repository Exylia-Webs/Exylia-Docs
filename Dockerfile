# syntax=docker/dockerfile:1
# --- build ------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

# Dependencies first, so a content-only change reuses this layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# The registry token for @exylia-webs/ui is a build secret (an .npmrc line), mounted only for this
# step so it never lands in a layer.
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY . .
RUN --mount=type=cache,id=docs-next,target=/app/.next/cache,sharing=locked pnpm run build

# --- serve ------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
