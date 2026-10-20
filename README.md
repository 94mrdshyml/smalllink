# smalllink

A small link shortener. Sign in, make a short link with your own slug, and see how many people clicked it and where they came from.

Built with Next.js, Better-Auth, and Prisma ORM on Postgres. Every screen is a phone-width column.

## Run it on your computer

```bash
pnpm install
cp .env.example .env        # then fill in the three values
pnpm db:migrate:dev      # creates the tables
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

How it fits together:

- `service.ts` and `module.ts` tell Compute what to run. The module is named `smalllink-app`, so deploys go to the Prisma project with that name. The database lives in a different project (`smalllink`), because a deploy refuses a project that holds resources it did not create.
- `prisma.config.ts` is read by the Prisma 8 command line, which does the deploy.
- `prisma7.config.ts` is read by the Prisma 7 command line (`prisma7`), which does `generate` and `migrate`. The app's database code still runs on Prisma 7, because Prisma 8's ORM is not final yet.
- `.github/workflows/prisma-deploy.yml` deploys on every push. The default branch is production. Every other branch gets its own preview.
- `next.config.ts` sets `output: "standalone"`. Compute needs it, or the live address shows a 504.

Settings live in the Prisma project (production environment), not in the repo:

- `DATABASE_URL`: a direct Postgres address (`postgres://...`)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`: the live address, no slash at the end. Set it after the first deploy, then push once more.

A deploy does not create tables. Run `pnpm db:migrate:deploy` against the database for any new migration.

Previews are only as separate as their settings. A preview branch has no `DATABASE_URL` until you add one for the `preview` role.

Click countries come from the `x-vercel-ip-country` or `cf-ipcountry` header. If the host sends neither, countries show as unknown and everything else still works.
