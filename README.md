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

To deploy from your computer (the `preview` build of the Prisma CLI is the one that still has the `app` commands):

```bash
npx @prisma/cli@preview auth login
npx @prisma/cli@preview app deploy --project smalllink --app smalllink --framework nextjs
```

Do not pass `--env` or add an `env` line to `prisma.compute.ts` with your local `.env`. It holds local values. The production values live in the Compute project's settings.

Click countries come from the `x-vercel-ip-country` or `cf-ipcountry` header. If the host sends neither, countries show as unknown and everything else still works.
