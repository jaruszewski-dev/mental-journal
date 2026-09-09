# Mental Journal

Anonymous, privacy-first emotional support platform. Users keep a **private journal**, can **publish** selected entries to a public feed, and leave **comments**. Public content goes through **AI moderation**; accounts that repeatedly violate rules can be **shadowbanned** (private journal still works).

The monorepo ships a **NestJS API**, a **Next.js** client, shared **API types**, and a **seed** CLI.

For architecture diagrams and deeper design notes, see [`AGENT.md`](./AGENT.md).

## Stack

- **Monorepo:** pnpm + Turborepo
- **API:** NestJS 11, Prisma 7, PostgreSQL 16
- **Web:** Next.js 16, React 19, TanStack Query / Virtual, next-intl (PL/EN)
- **Realtime:** Socket.IO (feed + comment moderation events)
- **Queue:** Redis 7 + BullMQ (moderation + mail)
- **Auth:** JWT access + refresh in httpOnly cookies; email verification via Resend
- **Moderation:** OpenAI Moderations API (async workers)
- **Other:** Swagger (non-production), throttling, shared tags/errors in `@repo/api-types`

## What’s in v1

| Area     | Capabilities                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------- |
| Auth     | Register, verify email, login, refresh, logout, logout-all, `/me`, short-lived `/ws-token`          |
| Account  | Update anon name / password / avatar (`PATCH /users/me`)                                            |
| Journal  | Private CRUD + publish; list with cursor, `sortBy` (`date` \| `mood`), `orderBy` (`asc` \| `desc`)  |
| Feed     | List ACTIVE public posts (cursor, optional `tags`); “new posts” + own-post moderation via Socket.IO |
| Comments | Create / list / delete on ACTIVE posts; realtime activate/hide                                      |
| Safety   | Async AI moderation, trust score, temporary shadowban, moderation cases for human review later      |
| Ops      | Health check, cron to lift expired shadowbans                                                       |

HTTP prefix: `/v1`. Example: `GET /v1/feed`.

**Auth notes**

- Cookies: `access_token`, `refresh_token` (`secure` when `NODE_ENV=production`)
- Refresh tokens stored hashed; rotation via atomic update
- Allowed statuses for authenticated use: `ACTIVE` and `SHADOWBANNED` (email must be verified)
- Shadowbanned users **cannot** publish or comment; private journal remains available

## Requirements

- Node.js ≥ 18
- pnpm 9
- Docker (Postgres + Redis)

## Setup

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# fill secrets in apps/api/.env
# optional: docker/.env for Postgres/Redis ports and credentials
```

Important env vars (`apps/api/.env`):

| Variable                                                                    | Purpose                                    |
| --------------------------------------------------------------------------- | ------------------------------------------ |
| `DATABASE_URL`                                                              | Postgres connection                        |
| `REDIS_URL`                                                                 | BullMQ / Redis                             |
| `FRONTEND_URL`                                                              | CORS origin + links in verification emails |
| `JWT_ACCESS_SECRET`, `ACCESS_TOKEN_TTL`, `SESSION_REFRESH_TTL`, `EMAIL_TTL` | Auth / sessions                            |
| `RESEND_API_KEY`, `MAIL_FROM`                                               | Outbound mail                              |
| `OPENAI_API_KEY`                                                            | Content moderation                         |
| `SHADOWBAN_EXPIRY_CRON`, `SHADOWBAN_TIME_ZONE`                              | Unban cron                                 |
| `PORT`                                                                      | API port (default `3001`)                  |

Web (`apps/web/.env.local`): `API_ORIGIN` — upstream for Next rewrites (default `http://localhost:3001`).

```sh
pnpm docker:up
pnpm db:migrate
```

## Develop

```sh
pnpm dev
```

- Web: [http://localhost:3000](http://localhost:3000) (proxies `/v1` → API)
- API: [http://localhost:3001/v1](http://localhost:3001/v1)
- Swagger (when not production): [http://localhost:3001/api](http://localhost:3001/api)

## Scripts

| Command                               | Description                |
| ------------------------------------- | -------------------------- |
| `pnpm dev`                            | Docker up + turbo `dev`    |
| `pnpm build`                          | Build workspace            |
| `pnpm api:test`                       | API unit tests             |
| `pnpm db:migrate`                     | Prisma migrate (dev)       |
| `pnpm db:seed`                        | Push schema + fill seed DB |
| `pnpm db:wipe`                        | Wipe seed DB only          |
| `pnpm db:studio`                      | Prisma Studio              |
| `pnpm docker:up` / `pnpm docker:down` | Postgres + Redis           |
| `pnpm lint` / `pnpm check`            | Lint / lint + format check |
| `pnpm ci:local`                       | Fix + check + tests        |

## Layout

```
apps/api/                 NestJS API, Prisma schema & migrations, Socket.IO
apps/web/                 Next.js frontend (feed, journal, account, auth)
apps/seed/                Faker seed + wipe CLI (mental_journal_seed DB)
docker/                   Postgres + Redis compose
packages/api-types/       Shared tags, error codes / response shapes
packages/eslint-config/   Shared ESLint presets
packages/typescript-config/ Shared tsconfig bases
AGENT.md                  Technical architecture (diagrams, flows)
```

Per-package docs: [`apps/api/README.md`](./apps/api/README.md) · [`apps/web/README.md`](./apps/web/README.md) · [`apps/seed/README.md`](./apps/seed/README.md) · [`packages/api-types/README.md`](./packages/api-types/README.md)

## Out of scope (for now)

- Chat / DMs
- CMS HTTP API to resolve moderation cases
- Password reset via email
- Likes, rankings, followers, or engagement gamification

## Non-goals

Tags are emotional, not clinical. No public real identity — anonymity via `anonName` (+ optional avatar).
