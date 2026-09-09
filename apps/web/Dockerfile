# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

FROM base AS build
ENV HUSKY=0
ENV CI=1

ARG API_ORIGIN=http://api:3001
ARG NEXT_PUBLIC_WS_URL=http://localhost:3001
ENV API_ORIGIN=$API_ORIGIN
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/typescript-config ./packages/typescript-config/

RUN pnpm install --frozen-lockfile --filter web...

COPY packages/api-types ./packages/api-types
COPY apps/web ./apps/web

RUN pnpm --filter @repo/api-types build \
	&& pnpm --filter web build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
