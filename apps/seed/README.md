# Seed CLI (`apps/seed`)

Fills / wipes the **seed** Postgres database (`mental_journal_seed`) on the same Docker Postgres instance as the app. Never touches the main `mental_journal` database.

Monorepo root docs: [`../../README.md`](../../README.md)

## Setup

1. Copy env:

```bash
cp apps/seed/.env.example apps/seed/.env
```

2. Ensure Docker Postgres is up. On a **fresh** volume, `docker/postgres/init-seed-db.sh` creates `mental_journal_seed`. If the volume already existed:

```bash
docker exec -it mental-journal-postgres psql -U mental_journal -d mental_journal -c 'CREATE DATABASE mental_journal_seed'
```

(The CLI also creates the DB automatically when missing.)

## Commands

From repo root:

```bash
pnpm db:wipe    # TRUNCATE all tables in seed DB only
pnpm db:seed    # push schema to seed DB, then fill with Faker data
```

Package scripts (via filter): `wipe`, `push-schema`, `seed`.

## Login after seed

- Email: `seed.user.1@example.com` … `seed.user.50@example.com`
- Password: `Password1!`

Point API at the seed DB temporarily via `DATABASE_URL=…/mental_journal_seed` in `apps/api/.env` if you want to browse seeded data in the app (feed, journal, comments).
