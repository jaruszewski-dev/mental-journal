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

## Calling the API

Use `credentials: 'include'` so httpOnly cookies work cross-origin (3000 → 3001):

```ts
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`, {
  credentials: 'include',
});
```
