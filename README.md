# Mental Journal

Anonymous, privacy-first emotional support platform. Users keep a **private journal**, can **publish** selected entries to a public feed, and leave **comments**. Public content goes through **AI moderation**; accounts that repeatedly violate rules can be **shadowbanned** (private journal still works).

This repo currently ships the **NestJS API**. A Next.js client is planned but not included yet.

For architecture diagrams and deeper design notes, see [`AGENT.md`](./AGENT.md).

## Stack

- **Monorepo:** pnpm + Turborepo
- **API:** NestJS 11, Prisma 7, PostgreSQL 16
- **Queue:** Redis 7 + BullMQ (moderation + mail)
- **Auth:** JWT access + refresh in httpOnly cookies; email verification via Resend
- **Moderation:** OpenAI Moderations API (async workers)
- **Other:** Swagger (non-production), throttling, i18n for tags (PL/EN)

## What’s in v1

| Area | Capabilities |
|------|----------------|
| Auth | Register, verify email, login, refresh, logout, `/me` |
| Journal | Private CRUD + `POST /journal/:id/publish` (creates public post snapshot) |
| Feed | List ACTIVE public posts (cursor, optional tags) |
| Comments | Create / list / delete on ACTIVE posts |
| Safety | Async AI moderation, trust score, temporary shadowban, moderation cases for human review later |
| Ops | Health check, cron to lift expired shadowbans |

Prefix: `/v1`. Example: `GET /v1/feed`.

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
# fill secrets in apps/api/.env
# optional: docker/.env for Postgres/Redis ports and credentials
```

Important env vars (`apps/api/.env`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection |
| `REDIS_URL` | BullMQ / Redis |
| `FRONTEND_URL` | CORS origin + links in verification emails |
| `JWT_ACCESS_SECRET`, `ACCESS_TOKEN_TTL`, `SESSION_REFRESH_TTL`, `EMAIL_TTL` | Auth / sessions |
| `RESEND_API_KEY`, `MAIL_FROM` | Outbound mail |
| `OPENAI_API_KEY` | Content moderation |
| `SHADOWBAN_EXPIRY_CRON`, `SHADOWBAN_TIME_ZONE` | Unban cron |
| `PORT` | API port (default `3001`) |

```sh
pnpm docker:up
pnpm db:migrate
```

## Develop

```sh
pnpm dev
```

- API: [http://localhost:3001/v1](http://localhost:3001/v1)
- Swagger (when not production): [http://localhost:3001/api](http://localhost:3001/api)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Docker up + API watch |
| `pnpm build` | Build workspace |
| `pnpm api:test` | API unit tests |
| `pnpm db:migrate` | Prisma migrate (dev) |
| `pnpm db:studio` | Prisma Studio |
| `pnpm docker:up` / `pnpm docker:down` | Postgres + Redis |
| `pnpm lint` / `pnpm check` | Lint / lint + format check |
| `pnpm ci:local` | Fix + check + tests |

## Layout

```
apps/api/     NestJS API, Prisma schema & migrations
docker/       Postgres + Redis compose
packages/     Shared ESLint / TypeScript configs
AGENT.md      Technical architecture (diagrams, flows)
```

## Out of scope (for now)

- Next.js (or any) client in this repo
- Chat / WebSockets / realtime feed
- CMS HTTP API to resolve moderation cases
- Password reset / profile editing

## Non-goals

No likes, rankings, followers, or engagement gamification. Tags are emotional, not clinical.
