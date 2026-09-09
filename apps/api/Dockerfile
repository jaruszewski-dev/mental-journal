# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

FROM base AS build
ENV HUSKY=0
ENV CI=1
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/typescript-config ./packages/typescript-config/

RUN pnpm install --frozen-lockfile --filter api...

COPY packages/api-types ./packages/api-types
COPY apps/api ./apps/api

RUN pnpm --filter @repo/api-types build \
	&& pnpm --filter api exec prisma generate \
	&& pnpm --filter api build

FROM base AS runner
ENV NODE_ENV=production
ENV HUSKY=0
ENV CI=1
WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=build /app/packages/api-types ./packages/api-types
COPY --from=build /app/packages/typescript-config ./packages/typescript-config
COPY apps/api/docker-entrypoint.sh ./apps/api/docker-entrypoint.sh

RUN chmod +x ./apps/api/docker-entrypoint.sh

WORKDIR /app/apps/api
EXPOSE 3001
ENTRYPOINT ["./docker-entrypoint.sh"]
