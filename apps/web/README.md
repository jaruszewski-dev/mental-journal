# Mental Journal Web (`apps/web`)

Next.js frontend for Mental Journal.

- Dev: [http://localhost:3000](http://localhost:3000)
- API (direct): [http://localhost:3001/v1](http://localhost:3001/v1) (see `apps/api`)
- Browser calls API via **same-origin** proxy: `http://localhost:3000/v1/*` → API

## Env

```sh
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `API_ORIGIN` | Upstream API origin for rewrites (default `http://localhost:3001`, server-only) |

Browser `apiClient` always uses `/v1` (same origin). Cookies from login land on `:3000`, so `proxy.ts` can see `access_token`.

Auth gate (`proxy.ts`): without `access_token`, only `/login`, `/register`, `/verify-email` (plus locale variants). Everything else → `/login`. Logged-in users hitting login/register → `/`.

API CORS still expects `FRONTEND_URL=http://localhost:3000` in `apps/api/.env` for any direct browser→API calls.

## Develop

From repo root (API + web + Docker):

```sh
pnpm dev
```

Only web:

```sh
pnpm --filter web dev
```

## UI

shadcn (style `base-nova`) + Tailwind v4.

Theme **Soft slate ink** (notes / book): paper background, ink primary, sand accent (`--sand`).

Fonts: **Source Sans 3** (UI) + **Literata** (headings / journal). Utility: `font-heading`.

Structure (feature-based):

```
app/[locale]/        routes (pl default, /en/… for English)
components/ui/       shared shadcn
components/layout/   shared shells (e.g. AppShell)
features/auth/       auth domain (shared + register/login/verify-email)
i18n/                next-intl routing + request config
messages/            pl.json, en.json
lib/                 cross-cutting utils
```

Auth slices: `features/auth/{shared,register,login,verify-email}`.

Shared API contract: `packages/api-types` (`ErrorResponse`, `ErrorCode`).

Locales: `pl` (default, no URL prefix) · `en` (`/en/...`).

## Calling the API

Browser client: `lib/api-client.ts` — Axios `baseURL: "/v1"` + `withCredentials: true`.

```ts
import { apiClient } from "@/lib/api-client";

await apiClient.get("/auth/me");
```
