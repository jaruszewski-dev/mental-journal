# Mental Journal Web (`apps/web`)

Next.js frontend for Mental Journal.

- Dev: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001/v1](http://localhost:3001/v1) (see `apps/api`)

## Env

```sh
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | API origin without path prefix (default `http://localhost:3001`) |

API CORS expects `FRONTEND_URL=http://localhost:3000` in `apps/api/.env`.

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

Locales: `pl` (default, no URL prefix) · `en` (`/en/...`).

## Calling the API

Browser client: `lib/api-client.ts` (`apiClient`) — Axios with `baseURL` `…/v1` and `withCredentials: true` so httpOnly cookies work (3000 → 3001).

```ts
import { apiClient } from "@/lib/api-client";

await apiClient.get("/auth/me");
```
