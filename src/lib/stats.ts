import { Prisma } from "@/generated/prisma/client";
import { db } from "./db";

// All days are UTC days.
const DAY = 86_400_000;

export type Day = { date: string; n: number };

function startOfUtcDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

// One entry per day, oldest first, zeros included.
function fillDays(rows: { day: string; n: number }[], days: number): Day[] {
  const byDay = new Map(rows.map((r) => [r.day, r.n]));
  const today = startOfUtcDay(new Date());
  return Array.from({ length: days }, (_, i) => {
    const date = iso(new Date(today.getTime() - (days - 1 - i) * DAY));
    return { date, n: byDay.get(date) ?? 0 };
  });
}

function sinceDays(days: number) {
  return new Date(startOfUtcDay(new Date()).getTime() - (days - 1) * DAY);
}

const sum = (days: Day[]) => days.reduce((a, d) => a + d.n, 0);

export async function getOverview(userId: string) {
  const since14 = sinceDays(14);
  const since7 = sinceDays(7);

  const [rows, totals, top] = await Promise.all([
    db.$queryRaw<{ day: string; n: number }[]>(Prisma.sql`
      SELECT to_char(date_trunc('day', c."createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day,
             count(*)::int AS n
      FROM "Click" c JOIN "Link" l ON l.id = c."linkId"
      WHERE l."userId" = ${userId} AND c."createdAt" >= ${since14}
      GROUP BY 1`),
    db.link.aggregate({
      where: { userId },
      _sum: { clickCount: true },
      _count: { _all: true },
    }),
    db.$queryRaw<{ slug: string; n: number }[]>(Prisma.sql`
      SELECT l.slug, count(*)::int AS n
      FROM "Click" c JOIN "Link" l ON l.id = c."linkId"
      WHERE l."userId" = ${userId} AND c."createdAt" >= ${since7}
      GROUP BY l.slug ORDER BY n DESC, l.slug LIMIT 1`),
  ]);

  const series = fillDays(rows, 14);
  const prior = series.slice(0, 7);
  const recent = series.slice(7);

  return {
    series,
    week: sum(recent),
    priorWeek: sum(prior),
    today: recent[recent.length - 1].n,
    allTime: totals._sum.clickCount ?? 0,
    linkCount: totals._count._all,
    topLink: top[0] ?? null,
  };
}

export type Tally = { label: string; n: number };

async function tally(
  linkId: string,
  since: Date,
  by: "referrer" | "country" | "device" | "browser",
  empty: string,
): Promise<Tally[]> {
  const groups = await db.click.groupBy({
    by: [by],
    where: { linkId, createdAt: { gte: since } },
    _count: { _all: true },
  });
  return groups
    .map((g) => ({ label: g[by] ?? empty, n: g._count._all }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 6);
}

export async function getLinkStats(linkId: string, days: number) {
  const since = sinceDays(days);

  const [rows, referrers, countries, devices, browsers, last] = await Promise.all([
    db.$queryRaw<{ day: string; n: number }[]>(Prisma.sql`
      SELECT to_char(date_trunc('day', "createdAt" AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS day,
             count(*)::int AS n
      FROM "Click"
      WHERE "linkId" = ${linkId} AND "createdAt" >= ${since}
      GROUP BY 1`),
    tally(linkId, since, "referrer", "Direct"),
    tally(linkId, since, "country", "Unknown"),
    tally(linkId, since, "device", "Unknown"),
    tally(linkId, since, "browser", "Unknown"),
    db.click.findFirst({
      where: { linkId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const series = fillDays(rows, days);
  return {
    series,
    total: sum(series),
    referrers,
    countries,
    devices,
    browsers,
    lastClickAt: last?.createdAt ?? null,
  };
}
