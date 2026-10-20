# smalllink

A small link shortener. Sign in, make a short link with your own slug, and see how many people clicked it and where they came from.

Built with Next.js, Better-Auth, and Prisma ORM on Postgres. Every screen is a phone-width column.

## Run it on your computer

```bash
pnpm install
cp .env.example .env        # then fill in the three values
pnpm prisma migrate dev     # creates the tables
pnpm dev
```

## Settings

| Name | What it is |
| --- | --- |
| `DATABASE_URL` | A direct Postgres address (`postgres://…`), not the `prisma+postgres://` one |
| `BETTER_AUTH_SECRET` | A long random string. `openssl rand -base64 32` makes one |
| `BETTER_AUTH_URL` | The public address of the site, no slash at the end |

## Host it on Prisma Compute

The app is one Next.js app, so one deploy runs the pages and the server code.

- `prisma.compute.ts` tells Compute this is a Next.js app.
- `next.config.ts` sets `output: "standalone"`. Compute needs it, or the live address shows a 504.
- Set the three settings above in the Compute project's production environment.
- Create the tables once with `pnpm db:migrate:deploy` pointed at the production database. A deploy does not do this for you.
- After the first deploy, set `BETTER_AUTH_URL` to the live address and deploy again.

Click countries come from the `x-vercel-ip-country` or `cf-ipcountry` header. If the host sends neither, countries show as unknown and everything else still works.
