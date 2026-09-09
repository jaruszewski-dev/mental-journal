# Mental Journal Web (`apps/web`)

Next.js frontend for Mental Journal — auth, feed, journal, comments, account, and realtime moderation updates.

Monorepo root docs: [`../../README.md`](../../README.md) · API: [`../api/README.md`](../api/README.md)

- Dev: [http://localhost:3000](http://localhost:3000)
- API (direct): [http://localhost:3001/v1](http://localhost:3001/v1)
- Browser calls API via **same-origin** proxy: `http://localhost:3000/v1/*` → API

## Stack

| Piece        | Tech                                      |
| ------------ | ----------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19         |
| Data         | TanStack Query (infinite lists), Axios    |
| Lists        | TanStack Virtual (window virtualizer)     |
| Forms        | react-hook-form + Zod                     |
| i18n         | next-intl (`pl` default, `en`)            |
| Realtime     | socket.io-client                          |
| UI           | shadcn (base-nova) + Tailwind v4          |
| Shared types | `@repo/api-types`                         |

## Features

| Route / area   | Behavior                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Auth           | Register, login, verify email, resend verification, logout / logout-all  |
| `/` (feed)     | Infinite public feed, tag filter (`GET /feed?tags=`), new-posts button   |
| `/journal`     | Composer + infinite timeline; sort by date/mood; edit / publish / delete |
| Comments       | Per-post section; create + delete own; realtime activate/hide            |
| `/account`     | Anon name, password, avatar; logout-all                                  |
| Realtime       | Socket after `GET /auth/ws-token`; own posts + open comments stay in sync|

**Journal sort UI** maps to `sortBy` + `orderBy` (`date`/`mood` × `asc`/`desc`).  
**Feed tags** use the shared journal tag catalog (multi-select).

Shadowbanned / pending / hidden states surface as badges and toasts where relevant.

## Env

```sh
cp .env.example .env.local
```

| Variable     | Purpose                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| `API_ORIGIN` | Upstream API origin for rewrites (default `http://localhost:3001`, server-only) |

Browser `apiClient` always uses `/v1` (same origin). Cookies from login land on `:3000`, so the auth proxy can see `access_token`.

Auth gate (`proxy.ts`): without `access_token`, only `/login`, `/register`, `/verify-email` (plus locale variants). Everything else → `/login`. Logged-in users hitting login/register → `/`.

API CORS still expects `FRONTEND_URL=http://localhost:3000` in `apps/api/.env`.

## Develop

From repo root (API + web + Docker):

```sh
pnpm dev
```

Only web:

```sh
pnpm --filter web dev
```

| Script        | Description        |
| ------------- | ------------------ |
| `dev`         | Next on port 3000  |
| `build`       | Production build   |
| `start`       | Serve build        |
| `check-types` | `tsc --noEmit`     |
| `lint`        | ESLint             |

## UI

Theme **Soft slate ink** (notes / book): paper background, ink primary, sand accent (`--sand`).

Fonts: **Source Sans 3** (UI) + **Literata** (headings / journal). Utility: `font-heading`.

## Structure

```
app/[locale]/
  (auth)/          login, register, verify-email
  (app)/           feed (/), journal, account + AppShell
components/        shared UI (shadcn, entry-actions-menu, layout)
features/
  auth/            forms, session mutations
  feed/            list, tag filter, cache helpers
  journal/         composer, list, sort, entry mutations
  comments/        section, composer, realtime hooks
  account/         profile form
  realtime/        socket client, providers, event consts
i18n/              next-intl routing + request config
messages/          pl.json, en.json
lib/               api-client, utils
```

Locales: `pl` (default, no URL prefix) · `en` (`/en/...`).

## Calling the API

Browser client: `lib/api-client.ts` — Axios `baseURL: "/v1"` + `withCredentials: true`.

```ts
import { apiClient } from '@/lib/api-client';

await apiClient.get('/auth/me');
```

Query keys are feature-scoped (`feed`, `journal`, …) and include list filters/sort so caches stay isolated per view state.
