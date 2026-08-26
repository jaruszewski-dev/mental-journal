# Mental Journal API (`apps/api`)

NestJS REST API for Mental Journal — private journal, public feed, comments, AI moderation, and auth.

Monorepo root docs: [`../../README.md`](../../README.md) · architecture notes: [`../../AGENT.md`](../../AGENT.md)

---

## Stack

| Piece | Tech |
|-------|------|
| Runtime | NestJS 11, TypeScript |
| DB | PostgreSQL 16, Prisma 7 |
| Queue | Redis + BullMQ |
| Auth | JWT in httpOnly cookies + hashed refresh sessions |
| Mail | Resend (async `mail` queue) |
| Moderation | OpenAI Moderations (async `moderation` queue) |

Global prefix: **`/v1`**. Swagger (non-production): **`/api`**.

---

## Architecture

```mermaid
flowchart LR
  Client["HTTP client"]
  API["NestJS /v1"]
  PG[(PostgreSQL)]
  Redis[(Redis)]
  OpenAI[OpenAI]
  Resend[Resend]

  Client -->|cookies| API
  API --> PG
  API --> Redis
  Redis -->|workers| API
  API -.-> OpenAI
  API -.-> Resend
```

**v1 style:** `controller → service → Prisma`. Ports/adapters only for external edges (auth use-cases, mail enqueue, OpenAI). HTTP responses are DTOs only.

### Modules

```
src/
  modules/
    auth/          register, login, verify, refresh, logout
    user/          user persistence + adapters for auth ports
    session/       refresh sessions + adapters
    mail/          Resend + MailProcessor
    journal/       private entries + publish → Post
    feed/          public ACTIVE posts
    comment/       comments on ACTIVE posts
    moderation/    OpenAI service, ModerationProcessor, shadowban cron
    queue/         BullMQ registration + job consts
    health/
  common/          guards, exceptions, assert* helpers
  prisma/          PrismaService
  generated/       Prisma client (generated)
```

### Domain (simplified)

```mermaid
erDiagram
  User ||--o{ JournalEntry : writes
  User ||--o{ Post : authors
  User ||--o{ Comment : authors
  User ||--o{ Session : has
  User ||--o{ ModerationCase : subject
  JournalEntry ||--o| Post : publish
  Post ||--o{ Comment : has
  ModerationCase ||--o{ ModerationEvidence : has
```

| Concept | Behavior |
|---------|----------|
| `JournalEntry` | Private; owner-only CRUD |
| `Post` | Snapshot created on publish; `PENDING` → AI → `ACTIVE` / `HIDDEN` |
| `Comment` | Same moderation pipeline as posts |
| `SHADOWBANNED` | Can use journal; cannot publish/comment |
| `ModerationCase` | Opened on AI block while already shadowbanned (for future human review) |

### Publish / comment moderation

```mermaid
flowchart TD
  A[Create Post or Comment PENDING] --> B[Enqueue moderation job]
  B --> C[OpenAI Moderations]
  C -->|allow| D[ACTIVE + trustScore +1]
  C -->|block| E[HIDDEN + trustScore -10]
  E --> F{Already SHADOWBANNED?}
  F -->|yes| G[ModerationCase + evidence]
  F -->|no| H{trustScore <= -50?}
  H -->|yes| I[SHADOWBANNED 3 days]
```

Trust deltas: `+1` allow, `-10` block, threshold `-50`. Shadowban until midnight Europe/Warsaw (+3 calendar days). Cron: `SHADOWBAN_EXPIRY_CRON` / `SHADOWBAN_TIME_ZONE`.

### Auth

```mermaid
sequenceDiagram
  participant C as Client
  participant A as API
  participant Q as mail queue

  C->>A: POST /v1/auth/register
  A->>Q: send verification email
  C->>A: GET /v1/auth/verify-email
  C->>A: POST /v1/auth/login
  A-->>C: Set-Cookie access_token, refresh_token
  C->>A: authenticated routes
  Note over A: JwtAuthGuard + AccountCanActGuard
```

---

## HTTP surface

| Area | Routes |
|------|--------|
| Health | `GET /v1/health` |
| Auth | `/v1/auth/register`, `login`, `verify-email`, `me`, `resend-verification`, `logout`, `logout-all`, `refresh` |
| Journal | `/v1/journal` CRUD + `POST /v1/journal/:id/publish` |
| Feed | `GET /v1/feed` |
| Comments | `POST|GET|DELETE /v1/comments` |

---

## Local setup

From **repo root** (recommended):

```sh
pnpm install
cp apps/api/.env.example apps/api/.env   # fill values
pnpm docker:up                           # Postgres + Redis
pnpm db:migrate
pnpm --filter api dev
```

Or from this package:

```sh
pnpm install          # from root first
pnpm dev              # predev brings docker up + prisma generate
pnpm test
pnpm check-types
pnpm db:migrate
```

See `.env.example` for required keys (`DATABASE_URL`, `REDIS_URL`, `JWT_*`, `OPENAI_API_KEY`, `RESEND_*`, …).

| URL | |
|-----|--|
| API | http://localhost:3001/v1 |
| Swagger | http://localhost:3001/api |

---

## Scripts (package)

| Script | Description |
|--------|-------------|
| `dev` | Nest watch (`predev`: docker + `prisma generate`) |
| `build` / `start:prod` | Build / run `dist` |
| `test` | Jest unit tests |
| `check-types` | `tsc --noEmit` |
| `db:migrate` / `db:push` / `db:studio` | Prisma |

---

## Out of scope (this package)

- Frontend
- Chat / WebSockets
- CMS endpoints to resolve `ModerationCase`
- Password reset
