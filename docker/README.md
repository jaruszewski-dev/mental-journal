# Docker

## Dev (local)

Only Postgres + Redis for `pnpm dev`:

```sh
pnpm docker:up
```

Uses `docker-compose.yml` + optional `docker/.env`.

## Production (EC2 / single host)

Full stack: `postgres`, `redis`, `api`, `web`, `nginx`.

```sh
cp docker/.env.prod.example docker/.env.prod
# edit secrets + FRONTEND_URL + NEXT_PUBLIC_WS_URL (no :3000/:3001)

# from repo root:
pnpm docker:prod:up

# or:
docker compose -f docker/docker-compose.prod.yml --env-file docker/.env.prod up -d --build
```

| Service  | Port (host)           | Notes                          |
| -------- | --------------------- | ------------------------------ |
| nginx    | `HTTP_PORT` 80        | public entry                   |
| web      | internal `:3000`      | Next.js                        |
| api      | internal `:3001`      | REST `/v1` + Socket.IO         |
| postgres | internal only         | hostname `postgres`            |
| redis    | internal only         | hostname `redis`               |

Nginx routes:

- `/` → web  
- `/v1/` → api  
- `/socket.io/` → api (WebSocket)

Set:

```env
FRONTEND_URL=http://PUBLIC_IP
NEXT_PUBLIC_WS_URL=http://PUBLIC_IP
```

`NEXT_PUBLIC_WS_URL` is a **build arg** — change requires rebuild of `web`.

Security Group: open **80** (and later **443** for HTTPS). Do not publish 3000/3001.

API entrypoint runs `prisma migrate deploy` before start.

HTTPS (Let’s Encrypt) needs a domain — add after DNS points to the instance.
