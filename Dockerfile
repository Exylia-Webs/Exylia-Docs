# syntax=docker/dockerfile:1
# Exylia Docs: every page prerendered at build time, served by the Next server (which also runs the
# assistant's API route and the admin panel), which runs its migrations as it starts.
#
#   docker build -t exylia-docs --secret id=NPMRC,env=NPMRC .
#
# Same shape as Exylia-Utils: the runtime keeps the whole built project rather than Next's traced
# file list. pnpm's node_modules is a tree of symlinks, and a pruned copy is what breaks the Prisma
# CLI the migration step needs.

# ---------------------------------------------------------------- deps ------
FROM node:22-slim AS deps
WORKDIR /app
# No TTY in a build: pnpm must never stop to ask.
ENV CI=true

RUN corepack enable && apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Only the manifests, so a content-only change reuses the install layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# The registry token for @exylia-webs/ui is a build secret (an .npmrc line), mounted only for this
# step so it never lands in a layer. Its id is NPMRC because Coolify passes each build-time
# variable as a secret under its own name ("Use Docker Build Secrets").
RUN --mount=type=secret,id=NPMRC,target=/root/.npmrc --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile --prod=false --store-dir /pnpm/store

# --------------------------------------------------------------- build ------
FROM deps AS build
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Next inlines NEXT_PUBLIC_* into the client bundle; Coolify passes them as build secrets, mounted as
# env here. The Prisma client is generated code: `pnpm run build` generates it before Next compiles.
RUN --mount=type=secret,id=NEXT_PUBLIC_GA_ID,env=NEXT_PUBLIC_GA_ID \
    --mount=type=secret,id=NEXT_PUBLIC_CLARITY_ID,env=NEXT_PUBLIC_CLARITY_ID \
    --mount=type=cache,id=docs-next,target=/app/.next/cache,sharing=locked pnpm run build

# ------------------------------------------------------------- runtime ------
FROM node:22-slim AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# Port 80, as the nginx image before it, so the Coolify app keeps its port. Binding it as a
# non-root user works because Docker (20.10+) sets net.ipv4.ip_unprivileged_port_start=0 in every
# container; on a runtime that does not, set PORT=3000 and point Coolify's port at 3000.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=80 \
    AI_DATA_DIR=/app/data

# Dependencies and code in separate layers: node_modules only changes with the lockfile, so a
# deploy uploads and pulls just the code layer.
COPY --from=deps --chown=node:node /app ./
COPY --from=build --chown=node:node --exclude=node_modules /app ./

# Where the assistant kept its monthly token count before the database: the first request of this
# version imports this month's count from it, once. Keep the volume mounted until then.
RUN mkdir -p /app/data && chown node:node /app/data
VOLUME ["/app/data"]

# Never run as root.
USER node

EXPOSE 80

HEALTHCHECK --interval=10s --start-interval=1s --timeout=5s --start-period=10s --retries=6 \
  CMD curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/robots.txt" || exit 1

# Migrations run as the new container starts: Coolify's pre-deployment command would run them in
# the old container, with the old schema.
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && exec node node_modules/next/dist/bin/next start"]
