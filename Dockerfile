# syntax=docker/dockerfile:1
# Exylia Docs: every page prerendered at build time, served by Next's standalone Node server (which
# also runs the assistant's API route).
#
#   docker build -t exylia-docs --secret id=NPMRC,env=NPMRC .
#
# --- build ------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencies first, so a content-only change reuses this layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# The registry token for @exylia-webs/ui is a build secret (an .npmrc line), mounted only for this
# step so it never lands in a layer. Its id is NPMRC because Coolify passes each build-time
# variable as a secret under its own name ("Use Docker Build Secrets").
RUN --mount=type=secret,id=NPMRC,target=/root/.npmrc --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY . .
# Next inlines NEXT_PUBLIC_* into the client bundle; Coolify passes them as build secrets, mounted as env here.
RUN --mount=type=secret,id=NEXT_PUBLIC_GA_ID,env=NEXT_PUBLIC_GA_ID \
    --mount=type=secret,id=NEXT_PUBLIC_CLARITY_ID,env=NEXT_PUBLIC_CLARITY_ID \
    --mount=type=cache,id=docs-next,target=/app/.next/cache,sharing=locked pnpm run build

# --- serve ------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Port 80, as the nginx image before it, so the Coolify app keeps its port. Binding it as a
# non-root user works because Docker (20.10+) sets net.ipv4.ip_unprivileged_port_start=0 in every
# container; on a runtime that does not, set PORT=3000 and point Coolify's port at 3000.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=80 \
    AI_DATA_DIR=/app/data

# The traced server (with the MDX it reads at run time), then the assets it does not trace.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# The assistant's monthly token count lives here: mount a volume on it so a redeploy keeps it.
RUN mkdir -p /app/data && chown node:node /app/data
VOLUME ["/app/data"]

USER node

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=6 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/robots.txt" || exit 1

CMD ["node", "server.js"]
