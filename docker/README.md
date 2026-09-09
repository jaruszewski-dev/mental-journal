# Docker

## Dev (local)

Only Postgres + Redis for `pnpm dev`:

```sh
pnpm docker:up
```

Uses `docker-compose.yml` + optional `docker/.env`.

## Production (EC2 / single host)

Full stack: `postgres`, `redis`, `api`, `web`.

```sh
cp docker/.env.prod.example docker/.env.prod
# edit secrets + FRONTEND_URL + NEXT_PUBLIC_WS_URL

# from repo root:
pnpm docker:prod:up

# or:
docker compose -f docker/docker-compose.prod.yml --env-file docker/.env.prod up -d --build
```

| Service  | Port (host)     | Notes                                      |
| -------- | --------------- | ------------------------------------------ |
| web      | `WEB_PORT` 3000 | Next.js                                    |
| api      | `API_PORT` 3001 | REST `/v1` + Socket.IO                     |
| postgres | internal only   | hostname `postgres`                        |
| redis    | internal only   | hostname `redis`                           |

API entrypoint runs `prisma migrate deploy` before start.

Until Nginx/Caddy is in place, set:

- `FRONTEND_URL=http://PUBLIC_IP:3000`
- `NEXT_PUBLIC_WS_URL=http://PUBLIC_IP:3001`

`NEXT_PUBLIC_WS_URL` is a **build arg** — change requires rebuild of `web`.
